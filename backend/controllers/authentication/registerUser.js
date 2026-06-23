const { getUserModel, generateVerificationToken, maxTokenTime, findUserByEmail } = require('../../utils/Utils');
const PendingRegistration = require('../../models/PendingRegistration');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../utils/emailService');
const bcrypt = require('bcrypt');
const getLatLngFromAddress = require('../../utils/geocodingService');

exports.signUpUser = async (req, res, next) => {
  try {
    console.log('Received registration request:', req.body);
    let {
      first_name,
      last_name,
      email,
      password,
      confirmPassword,
      phone_number,
      cnic,
      address,
      gender,
      profile_picture,
      role,
      kitchen_name,
      kitchen_address,
      kitchen_description,
      kitchen_picture,
      hostel_name,
      hostel_type,
      hostel_address,
      hostel_description,
      hostel_picture,
      facilities,
      nearby_institutes
    } = req.body;

    // Normalize role name
    if (role === 'kitchenowner') {
      role = 'kitchenOwner';
    } else if (role === 'hostelowner') {
      role = 'hostelOwner';
    }

    // Basic validation
    if (!first_name || !last_name || !email || !password || !phone_number || !cnic || !address || !role) {
      console.log('Missing required fields');
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      console.log('Password mismatch');
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists in VERIFIED users (main database)
    const existingVerifiedUser = await findUserByEmail(email);

    if (existingVerifiedUser) {
      // Email exists in main database (verified users only)
      if (existingVerifiedUser.role !== role) {
        console.log(`Email ${email} already exists under role: ${existingVerifiedUser.role}`);
        return res.status(400).json({
          message: `This email is already registered as a ${existingVerifiedUser.role}. Please use a different email or login with your existing account.`
        });
      } else {
        // Same role - user should login
        console.log(`Verified user with email ${email} already exists`);
        return res.status(400).json({
          message: "User with this email already exists. Please login instead."
        });
      }
    }

    // Check if email exists in pending registrations
    const existingPending = await PendingRegistration.findOne({ email });

    if (existingPending) {
      // Delete old pending registration to allow re-registration with new OTP
      console.log(`Deleting old pending registration for ${email}`);
      await PendingRegistration.findByIdAndDelete(existingPending._id);
    }

    // Validate role-specific fields
    const User = getUserModel(role);
    if (!User) {
      console.log('Invalid role:', role);
      return res.status(400).json({ message: "Invalid user role" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for email verification
    const otp = generateVerificationToken();
    const otpString = otp.toString();

    // Prepare registration data based on role
    let registrationData = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone_number,
      cnic,
      address,
      role
    };

    // Add role-specific fields
    if (role === 'student') {
      if (!gender || !profile_picture) {
        console.log('Missing student-specific fields');
        return res.status(400).json({ message: "Gender and profile picture are required for students" });
      }
      registrationData = {
        ...registrationData,
        gender,
        profile_picture
      };
    } else if (role === 'kitchenOwner') {
      if (!kitchen_name || !kitchen_description || !kitchen_picture) {
        console.log('Missing kitchen-specific fields');
        return res.status(400).json({ message: "Kitchen name, description, and picture are required for kitchen owners" });
      }

      const providerId = "KIT" + Math.floor(100000 + Math.random() * 900000);

      registrationData = {
        ...registrationData,
        kitchen_name,
        address: kitchen_address,
        kitchen_description,
        kitchen_picture,
        provider_id: providerId
      };
    } else if (role === 'hostelOwner') {
      if (!hostel_name || !hostel_type || !hostel_address || !hostel_description || !hostel_picture) {
        console.log('Missing hostel-specific fields');
        return res.status(400).json({ message: "Hostel details are required for hostel owners" });
      }

      const formattedNearbyInstitutes = nearby_institutes && Array.isArray(nearby_institutes) ?
        nearby_institutes.filter(inst => inst && inst.university) :
        [{ university: "Default University" }];

      const stripeAccountId = "ACC" + Math.floor(100000 + Math.random() * 900000);
      const ownerId = "HST" + Math.floor(100000 + Math.random() * 900000);

      registrationData = {
        ...registrationData,
        hostel_name,
        hostel_type,
        hostel_address,
        hostel_description,
        hostel_picture,
        facilities: facilities || [],
        nearby_institutes: formattedNearbyInstitutes,
        stripeAccountId,
        owner_id: ownerId
      };

      // Add geocoding for hostel address if possible
      try {
        const hostelLatLng = await getLatLngFromAddress(hostel_address);
        if (hostelLatLng) {
          registrationData.hostel_lat = hostelLatLng.lat;
          registrationData.hostel_lng = hostelLatLng.lng;
        }
      } catch (geoError) {
        console.error('Error geocoding hostel address:', geoError);
      }
    }

    console.log('Creating pending registration for:', email);

    // Save to PendingRegistration (NOT the actual user collection)
    const pendingRegistration = new PendingRegistration({
      email,
      role,
      registrationData,
      verification_token: otpString,
      verification_token_time: maxTokenTime()
    });

    await pendingRegistration.save();

    // Send verification email
    try {
      const emailSubject = 'Email Verification - Student Facility System';
      const emailText = `Your OTP for email verification is: ${otpString}

This code will expire in 30 minutes.

Thank you for registering with Student Facility System!`;

      await sendEmail(email, emailSubject, emailText);
      console.log('Verification email sent successfully to:', email);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);

      // Delete pending registration if email fails and REQUIRE_EMAIL_SUCCESS is true
      if (process.env.REQUIRE_EMAIL_SUCCESS === 'true') {
        await PendingRegistration.findByIdAndDelete(pendingRegistration._id);
        return res.status(500).json({
          message: "Failed to send verification email. Please try again or contact support.",
          error: emailError.message
        });
      }
    }

    // Create temporary JWT token (used only for verification endpoint)
    const payload = { email, role, isPending: true };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Pending registration created for:', email);
    res.status(201).json({
      message: `Registration initiated. Please check your email for the OTP to complete your ${role} registration.`,
      token,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
