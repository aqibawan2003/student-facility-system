// routes/authRoutes/authUsers.js
const express = require('express');
const router = express.Router();
const {signUpUser} = require('../../controllers/authentication/registerUser');
const {loginUser} = require('../../controllers/authentication/loginUser');
const {verifyEmail} = require('../../controllers/authentication/verifyEmail');
const {resendOTP} = require('../../controllers/authentication/resendOTP');
const {sendOtp} = require('../../controllers/authentication/forgetPassword');
const {verifyOtp} = require('../../controllers/authentication/verifyPassswordOtp');
const {resetPassword} = require('../../controllers/authentication/resetPassword');
const verifyJWT = require('../../middlewares/AuthToken');




router.post('/register', signUpUser);
router.patch('/verifyEmail',verifyJWT, verifyEmail);
router.get('/resendOTP',verifyJWT, resendOTP);
router.post('/login', loginUser);
router.post('/forgot-password', sendOtp);
router.post('/verify-otp',verifyJWT, verifyOtp);
router.patch('/reset-password',verifyJWT, resetPassword);

module.exports = router;
