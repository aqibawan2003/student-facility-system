const express = require('express');
const router = express.Router();
const authControlleradmin = require('../../controllers/admincontroller/controller');

// Admin registration and login
router.post('/register', authControlleradmin.registerAdmin);
router.post('/login', authControlleradmin.loginAdmin);



//Routes for student controll
router.get('/getStudents', authControlleradmin.getStudents);
// Delete a student
router.delete('/deleteStudent/:id', authControlleradmin.deleteStudent);
module.exports = router;