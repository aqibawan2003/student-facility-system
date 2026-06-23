const express = require('express');
const router = express.Router();
const { getStudentProfile } = require('../../controllers/studentcontroller/profile');
const authenticateToken = require('../../middlewares/AuthToken');




// Student registration,verification and login
// router.post('/student/register', authController.registerStudent);
// router.patch('/student/verify', authController.verifyStudent);
// router.get('/student/resendVerificationEmail', authController.resendVerificationEmail);
// router.post('/student/login', authController.loginStudent);


router.get('/profile', authenticateToken, getStudentProfile);

 


module.exports = router;