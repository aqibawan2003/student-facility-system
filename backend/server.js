// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const connectSocket = require('./sockets/socket');

const authUsers = require('./routes/authRoutes/authUsers');
const profileRoutes = require('./routes/profileRoutes/profile');
const roomRoutes = require('./routes/Hostel/Room');
const hostelRoutes = require('./routes/Hostel/hostels');
const dishRoutes = require('./routes/kitchenownerroutes/Dish');
const kitchenRoutes = require('./routes/kitchenownerroutes/kitchens');
const bookingRoutes = require('./routes/Hostel/booking');
const cartRoutes = require('./routes/kitchenownerroutes/cartRoutes');
const studentRoutes = require('./routes/studentroutes/routes');
const orderRoutes = require('./routes/kitchenownerroutes/Order');
const webhookRoutes = require('./routes/payment/webhookRoutes');
const chatRoutes = require('./routes/chat/chatRoutes');
const chatbotRoutes = require('./routes/chatBot/chatbot');
const adminRoutes = require('./routes/adminroutes/routes');
const errorHandler = require('./middlewares/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = connectSocket(server);

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Body parsers - must be before routes
app.use(express.json({ limit: '50mb' }));  // Increased limit for image data
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
connectDB();

// API Routes
app.get('/', (req, res) => res.send('Hello World!'));

app.use('/auth', authUsers);
app.use('/profile', profileRoutes);
app.use('/hostel', hostelRoutes);
app.use('/kitchen', kitchenRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/admin', adminRoutes);
app.use('/api', webhookRoutes);

// DB Connection Test Route
app.get('/test-db', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ message: '✅ MongoDB connection active' });
  } else {
    res.status(500).json({ message: '❌ MongoDB connection inactive' });
  }
});

// Error handler middleware
app.use(errorHandler);

// Attach io instance to app
app.set('io', io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
