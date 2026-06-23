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

// Get all hostel owners
exports.getHostelOwners = async (req, res) => {
    try {
        const Hostelowner = require('../../models/hostelowner/Hostelowner');
        const hostelOwners = await Hostelowner.find().select('-password');
        res.status(200).json(hostelOwners);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all kitchen owners
exports.getKitchenOwners = async (req, res) => {
    try {
        const Kitchenowner = require('../../models/kitchenowner/Kitchenowner');
        const kitchenOwners = await Kitchenowner.find().select('-password');
        res.status(200).json(kitchenOwners);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all hostels
exports.getAllHostels = async (req, res) => {
    try {
        const Hostelroom = require('../../models/hostelowner/Hostelroom');
        const hostels = await Hostelroom.find().populate('hostel_owner_id', 'first_name last_name email');
        res.status(200).json(hostels);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all kitchens
exports.getAllKitchens = async (req, res) => {
    try {
        const Dish = require('../../models/kitchenowner/Dish');
        const Kitchenowner = require('../../models/kitchenowner/Kitchenowner');
        const kitchens = await Kitchenowner.find().select('-password');
        res.status(200).json(kitchens);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Approve Hostel Owner Registration
exports.approveHostelOwner = async (req, res) => {
    try {
        const Hostelowner = require('../../models/hostelowner/Hostelowner');
        const { id } = req.params;

        const hostelOwner = await Hostelowner.findById(id);
        if (!hostelOwner) {
            return res.status(404).json({ message: "Hostel owner not found" });
        }

        hostelOwner.isApproved = true;
        hostelOwner.status = 'active';
        await hostelOwner.save();

        res.status(200).json({ message: "Hostel owner approved successfully", hostelOwner });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Reject Hostel Owner Registration
exports.rejectHostelOwner = async (req, res) => {
    try {
        const Hostelowner = require('../../models/hostelowner/Hostelowner');
        const { id } = req.params;

        const hostelOwner = await Hostelowner.findByIdAndDelete(id);
        if (!hostelOwner) {
            return res.status(404).json({ message: "Hostel owner not found" });
        }

        res.status(200).json({ message: "Hostel owner registration rejected and deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Approve Kitchen Owner Registration
exports.approveKitchenOwner = async (req, res) => {
    try {
        const Kitchenowner = require('../../models/kitchenowner/Kitchenowner');
        const { id } = req.params;

        const kitchenOwner = await Kitchenowner.findById(id);
        if (!kitchenOwner) {
            return res.status(404).json({ message: "Kitchen owner not found" });
        }

        kitchenOwner.isApproved = true;
        kitchenOwner.status = 'active';
        await kitchenOwner.save();

        res.status(200).json({ message: "Kitchen owner approved successfully", kitchenOwner });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Reject Kitchen Owner Registration
exports.rejectKitchenOwner = async (req, res) => {
    try {
        const Kitchenowner = require('../../models/kitchenowner/Kitchenowner');
        const { id } = req.params;

        const kitchenOwner = await Kitchenowner.findByIdAndDelete(id);
        if (!kitchenOwner) {
            return res.status(404).json({ message: "Kitchen owner not found" });
        }

        res.status(200).json({ message: "Kitchen owner registration rejected and deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Ban/Remove Hostel Owner
exports.banHostelOwner = async (req, res) => {
    try {
        const Hostelowner = require('../../models/hostelowner/Hostelowner');
        const { id } = req.params;

        const hostelOwner = await Hostelowner.findById(id);
        if (!hostelOwner) {
            return res.status(404).json({ message: "Hostel owner not found" });
        }

        hostelOwner.isBanned = true;
        hostelOwner.status = 'banned';
        await hostelOwner.save();

        res.status(200).json({ message: "Hostel owner banned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Hostel Owner permanently
exports.deleteHostelOwner = async (req, res) => {
    try {
        const Hostelowner = require('../../models/hostelowner/Hostelowner');
        const Hostelroom = require('../../models/hostelowner/Hostelroom');
        const { id } = req.params;

        // Delete all hostels owned by this owner
        await Hostelroom.deleteMany({ hostel_owner_id: id });

        // Delete the owner
        const hostelOwner = await Hostelowner.findByIdAndDelete(id);
        if (!hostelOwner) {
            return res.status(404).json({ message: "Hostel owner not found" });
        }

        res.status(200).json({ message: "Hostel owner and all their hostels deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Ban/Remove Kitchen Owner
exports.banKitchenOwner = async (req, res) => {
    try {
        const Kitchenowner = require('../../models/kitchenowner/Kitchenowner');
        const { id } = req.params;

        const kitchenOwner = await Kitchenowner.findById(id);
        if (!kitchenOwner) {
            return res.status(404).json({ message: "Kitchen owner not found" });
        }

        kitchenOwner.isBanned = true;
        kitchenOwner.status = 'banned';
        await kitchenOwner.save();

        res.status(200).json({ message: "Kitchen owner banned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Kitchen Owner permanently
exports.deleteKitchenOwner = async (req, res) => {
    try {
        const Kitchenowner = require('../../models/kitchenowner/Kitchenowner');
        const Dish = require('../../models/kitchenowner/Dish');
        const { id } = req.params;

        // Delete all dishes by this owner
        await Dish.deleteMany({ kitchen_owner_id: id });

        // Delete the owner
        const kitchenOwner = await Kitchenowner.findByIdAndDelete(id);
        if (!kitchenOwner) {
            return res.status(404).json({ message: "Kitchen owner not found" });
        }

        res.status(200).json({ message: "Kitchen owner and all their dishes deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Remove/Ban a specific hostel
exports.removeHostel = async (req, res) => {
    try {
        const Hostelroom = require('../../models/hostelowner/Hostelroom');
        const { id } = req.params;

        const hostel = await Hostelroom.findByIdAndDelete(id);
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        res.status(200).json({ message: "Hostel removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Remove/Ban a specific kitchen (dish)
exports.removeKitchen = async (req, res) => {
    try {
        const Dish = require('../../models/kitchenowner/Dish');
        const { id } = req.params;

        const dish = await Dish.findByIdAndDelete(id);
        if (!dish) {
            return res.status(404).json({ message: "Kitchen/Dish not found" });
        }

        res.status(200).json({ message: "Kitchen/Dish removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Ban Student
exports.banStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        student.isBanned = true;
        student.status = 'banned';
        await student.save();

        res.status(200).json({ message: "Student banned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const Hostelowner = require('../../models/hostelowner/Hostelowner');
        const Kitchenowner = require('../../models/kitchenowner/Kitchenowner');
        const Hostelroom = require('../../models/hostelowner/Hostelroom');
        const Dish = require('../../models/kitchenowner/Dish');
        const Booking = require('../../models/student/Booking');
        const Order = require('../../models/student/Order');

        const totalStudents = await Student.countDocuments();
        const totalHostelOwners = await Hostelowner.countDocuments();
        const totalKitchenOwners = await Kitchenowner.countDocuments();
        const totalHostels = await Hostelroom.countDocuments();
        const totalKitchens = await Kitchenowner.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalOrders = await Order.countDocuments();

        const pendingHostelOwners = await Hostelowner.countDocuments({ isApproved: false });
        const pendingKitchenOwners = await Kitchenowner.countDocuments({ isApproved: false });

        res.status(200).json({
            totalStudents,
            totalHostelOwners,
            totalKitchenOwners,
            totalHostels,
            totalKitchens,
            totalBookings,
            totalOrders,
            pendingHostelOwners,
            pendingKitchenOwners
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
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