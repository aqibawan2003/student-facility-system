// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const { getMessages, postMessage } = require('../../controllers/chat/chatController');
const verifyJWT = require('../../middlewares/AuthToken');


// Get chat messages by order ID
router.get('/:orderId', getMessages);

// Post a new chat message
router.post('/', postMessage);

module.exports = router;
