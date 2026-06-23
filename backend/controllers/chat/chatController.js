// controllers/chatController.js

const Chat = require('../../models/chat/chatModel');

exports.getMessages = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ orderId: req.params.orderId });
        res.json(chat ? chat.messages : []); // Return only messages array
    } catch (error) {
        next(error);
    }
};

exports.postMessage = async (req, res, next) => {
    try {
        const { orderId, userId, kitchenId, message } = req.body;

        const newMessage = {
            userId,
            kitchenId,
            message,
            timestamp: new Date() // Set the timestamp on the backend
        };

        // Update the chat document or create a new one if it doesn't exist
        const chat = await Chat.findOneAndUpdate(
            { orderId }, // Find document by orderId
            { $push: { messages: newMessage } }, // Push the new message to the messages array
            { new: true, upsert: true } // Create the document if it doesn't exist (upsert: true)
        );

        res.status(201).json(chat);
    } catch (error) {
        next(error);
    }
};

