const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    reviewed_item: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: true },
    onModel: {
        type: String,
        required: true,
        enum: ['HostelRoom', 'Dish']
    },
    rating: { type: Number, required: true },
    review_text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
