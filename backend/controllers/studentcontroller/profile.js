// controllers/studentController.js

const Student = require('../../models/student/Student'); // Assuming the Student model is already defined

// Fetch student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming you have an authenticated user and `req.user` contains the user ID

    // Fetch student details by ID
    const student = await Student.findById(studentId).select('first_name last_name phone_number address');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
