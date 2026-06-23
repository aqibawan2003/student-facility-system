const Student = require('../../models/student/Student');
const Admin = require('../../models/admin/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.registerAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            admin_id: new mongoose.Types.ObjectId(),
            first_name: first_name,
            last_name: last_name,
            email,
            password: hashedPassword,
        });

        await admin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, admin });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Additional functions for Admin
exports.manageUsers = async (req, res) => {
    // Implement manage users logic
};

exports.approveKYC = async (req, res) => {
    // Implement approve KYC logic
};

exports.viewResolveSupportTickets = async (req, res) => {
    // Implement view and resolve support tickets logic
};

exports.manageHostelsAndFoodProviders = async (req, res) => {
    // Implement manage hostels and food providers logic
};

exports.monitorSystemActivities = async (req, res) => {
    // Implement monitor system activities logic
};

exports.suspendUsers = async (req, res) => {
    // Implement suspend users logic
};

exports.chatWithUsers = async (req, res) => {
    // Implement chat logic
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//get students

exports.getStudents = async (req, res) => {
    try {
        console.log("get students");
        // console.log(await Student.find());
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error", error });
    }
};