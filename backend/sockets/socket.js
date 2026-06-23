const socketIo = require('socket.io');
const Chat = require('../models/chat/chatModel');

const connectSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user or kitchen owner connected:', socket.id);

    socket.on('joinUserRoom', (userId) => {
      socket.join(`room-user${userId}`);
      console.log(`User with ID ${userId} joined room-user${userId}`);
    });

    socket.on('joinKitchenRoom', (kitchenId) => {
      socket.join(`room-kitchen${kitchenId}`);
      console.log(`Kitchen with ID ${kitchenId} joined room-kitchen${kitchenId}`);
    });

    socket.on('updateOrderStatus', (data) => {
      console.log('Order status update:', data);
      io.to(`room-user${data.userId}`).emit('orderUpdate', data);
    });

    // Join order-specific room
    socket.on('joinOrderRoom', ({ orderId }) => {
      socket.join(`order-${orderId}`);
      console.log(`Joined room for order ${orderId}`);
    });

    // Handle chat messages
    socket.on('sendMessage', async ({ orderId, userId, kitchenId, message }) => {
      try {
        const newMessage = {
          userId,
          kitchenId,
          message,
          timestamp: new Date() // Set the timestamp
        };
    
        // Update the chat document or create a new one if it doesn't exist
        const chat = await Chat.findOneAndUpdate(
          { orderId },
          { $push: { messages: newMessage } },
          { new: true, upsert: true }
        );
    
        // Emit the new message to the specific room
        socket.to(`order-${orderId}`).emit('receiveMessage', newMessage);
      } catch (error) {
        console.error('Failed to send message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // socket.on('leavekitcheRoom', (kitchenId) => {
    //   socket.leave(`room-kitchen${kitchenId}`);
    //   console.log(`Kitchen with ID ${kitchenId} left room-kitchen${kitchenId}`);
    // });

    socket.on('disconnect', () => {
      console.log(`User or kitchen owner with socket ID ${socket.id} disconnected`);
    });
  });

  return io;
};

module.exports = connectSocket;
