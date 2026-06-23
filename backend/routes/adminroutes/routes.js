const express = require('express');
const router = express.Router();
const authControlleradmin = require('../../controllers/admincontroller/controller');

// Admin registration and login
router.post('/register', authControlleradmin.registerAdmin);
router.post('/login', authControlleradmin.loginAdmin);

// Dashboard statistics
router.get('/stats', authControlleradmin.getDashboardStats);

// Student management
router.get('/students', authControlleradmin.getStudents);
router.delete('/students/:id', authControlleradmin.deleteStudent);
router.patch('/students/:id/ban', authControlleradmin.banStudent);

// Hostel Owner management
router.get('/hostel-owners', authControlleradmin.getHostelOwners);
router.patch('/hostel-owners/:id/approve', authControlleradmin.approveHostelOwner);
router.delete('/hostel-owners/:id/reject', authControlleradmin.rejectHostelOwner);
router.patch('/hostel-owners/:id/ban', authControlleradmin.banHostelOwner);
router.delete('/hostel-owners/:id', authControlleradmin.deleteHostelOwner);

// Kitchen Owner management
router.get('/kitchen-owners', authControlleradmin.getKitchenOwners);
router.patch('/kitchen-owners/:id/approve', authControlleradmin.approveKitchenOwner);
router.delete('/kitchen-owners/:id/reject', authControlleradmin.rejectKitchenOwner);
router.patch('/kitchen-owners/:id/ban', authControlleradmin.banKitchenOwner);
router.delete('/kitchen-owners/:id', authControlleradmin.deleteKitchenOwner);

// Hostel management
router.get('/hostels', authControlleradmin.getAllHostels);
router.delete('/hostels/:id', authControlleradmin.removeHostel);

// Kitchen management
router.get('/kitchens', authControlleradmin.getAllKitchens);
router.delete('/kitchens/:id', authControlleradmin.removeKitchen);

module.exports = router;