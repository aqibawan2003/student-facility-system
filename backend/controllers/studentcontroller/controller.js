const Student = require('../../models/student/Student');
const Booking = require('../../models/student/Booking');
const Order = require('../../models/student/Order');
const Review = require('../../models/student/Review');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Utils = require('../../utils/Utils');
const sendEmail = require('../../utils/emailService');


// Register a new student   
exports.registerStudent = async (req, res) => {
  try { 

    const { first_name, last_name, email, password, confirmPassword, phone_number, address, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Utils.generateVerificationToken();

    const student = new Student({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone_number,
      address,
      gender, 
      verification_token: otp,
      verification_token_time: Utils.maxTokenTime()
    });
    // save the student in the database
    await student.save();

    // Send OTP email
    const emailSubject = 'Email Verification';
    const emailText = `Your OTP for email verification is: ${otp}`;
    await sendEmail(email, emailSubject, emailText);

    const payload = { id: student._id, email : student.email ,role: 'student' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: "Student registered successfully. Please check your email for the OTP." , token : token});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error", error });
  }
};
  
// verify student email using OTP   
exports.verifyStudent = async (req, res) => {
    try {
      const { email, token } = req.body;

      // Find and update the student's verification status
      const student = await Student.findOneAndUpdate(
        { email, verification_token: token, verification_token_time: { $gte: Date.now() } },
        { $set: { email_verified: true, verification_token: null, verification_token_time: null } },
        { new: true }
      );
  
      if (student) {
        res.status(200).json({ message: "Student verified successfully", student });
      } else {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Server error", error });
    }
  };

// Resend OTP verification email to student   
exports.resendVerificationEmail = async (req, res) => {
    try {
        // Extracting the 'email' query parameter from the URL
        const { email } = req.query;

        // Finding the student in the database using the email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "User not found" });
        }

        // Checking if the email is already verified
        if (student.email_verified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Generating a new OTP and updating the token expiration time
        const newOtp = Utils.generateVerificationToken();
        const newTokenTime = Utils.maxTokenTime();

        // Updating the student's verification token and expiration time
        student.verification_token = newOtp;
        student.verification_token_time = newTokenTime;
        await student.save();

        // Sending the new OTP via email
        const emailSubject = 'Resend Email Verification';
        const emailText = `Your new OTP for email verification is: ${newOtp}`;
        await sendEmail(email, emailSubject, emailText);

        res.status(200).json({ message: "Verification email resent successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error", error });
    }
};


// Login a student 
exports.loginStudent = async (req, res) => {
    try {
     
        const { email, password } = req.body;
      
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = { id: student._id, email : student.email ,role: 'student' };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token , student });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Additional functions for Student
exports.searchHostels = async (req, res) => {
    // Implement search logic
};

exports.viewHostelDetails = async (req, res) => {
    // Implement view hostel details logic
};


exports.bookHostel = async (req, res) => {
    try {
        const { student_id, room_id } = req.body;

        const booking = new Booking({
            student_id,
            room_id,
            status: 'Booked'
        });

        await booking.save();
        res.status(201).json({ message: "Booking made successfully", booking });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.searchFoodProviders = async (req, res) => {
    // Implement search food providers logic
};

exports.viewFoodProviderDetails = async (req, res) => {
    // Implement view food provider details logic
};

exports.orderFood = async (req, res) => {
    try {
        const { student_id, dish_id } = req.body;

        const order = new Order({
            order_id: new mongoose.Types.ObjectId(),
            student_id,
            dish_id,
            order_date: new Date(),
            status: 'Pending'
        });

        await order.save();
        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.viewOrderHistory = async (req, res) => {
    try {
        const { student_id } = req.params;

        const orders = await Order.find({ student_id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.rateAndReview = async (req, res) => {
    try {
        const { student_id, entity_id, entity_type, rating, review_text } = req.body;

        const review = new Review({
            review_id: new mongoose.Types.ObjectId(),
            student_id,
            entity_id,
            entity_type,
            rating,
            review_text
        });

        await review.save();
        res.status(201).json({ message: "Review submitted successfully", review });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.chatWithAdmin = async (req, res) => {
    // Implement chat logic
};

exports.resetPassword = async (req, res) => {
    // Implement password reset logic
};


//CRUD operations for Student


// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update a student
exports.updateStudent = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_number, address, gender } = req.body;

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { first_name, last_name, email, phone_number, address, gender },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student updated successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

