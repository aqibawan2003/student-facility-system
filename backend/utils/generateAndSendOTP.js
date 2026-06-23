const { generateVerificationToken, maxTokenTime } = require('./Utils');
const sendEmail = require('./emailService');

/**
 * Generate a new OTP and send it to the user via email
 * @param {Object} user - The user object to generate OTP for
 * @param {boolean} verify - If true, generate password reset OTP, otherwise email verification OTP
 * @returns {Promise<Object>} - Result of the operation
 */
const generateAndSendOTP = async (user, verify) => {
    try {
        console.log(`Generating OTP for ${user.email} (${verify ? 'password reset' : 'email verification'})`);
        
        // Generate a new OTP
        const otp = generateVerificationToken();
        
        // Update the user based on the type of OTP needed
        if (!verify) {
            // Email verification OTP
            user.verification_token = otp;
            user.verification_token_time = maxTokenTime();
            await user.save();
            
            // Send email verification OTP
            const emailSubject = 'Email Verification - Student Facility System';
            const emailText = `Your new OTP for email verification is: ${otp}

This code will expire in 30 minutes.

Thank you for using Student Facility System!`;
            
            const result = await sendEmail(user.email, emailSubject, emailText);
            console.log(`Email verification OTP sent to ${user.email}`);
            return { success: true, type: 'verification', ...result };
        } else {
            // Password reset OTP
            user.reset_password_token = otp;
            user.reset_password_token_time = maxTokenTime();
            await user.save();
            
            // Send password reset OTP
            const emailSubject = 'Password Reset - Student Facility System';
            const emailText = `Your new OTP for Password Reset is: ${otp}

This code will expire in 30 minutes.

If you did not request a password reset, please ignore this email or contact support.`;
            
            const result = await sendEmail(user.email, emailSubject, emailText);
            console.log(`Password reset OTP sent to ${user.email}`);
            return { success: true, type: 'password_reset', ...result };
        }
    } catch (error) {
        console.error(`Failed to generate and send OTP to ${user.email}:`, error);
        throw error;
    }
};

module.exports = generateAndSendOTP;
