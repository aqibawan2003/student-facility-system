const Order = require('../../models/student/Order');
const Student = require('../../models/student/Student'); // Import the Student model
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_ORDER);

// Create order and Stripe session
exports.createOrder = async (req, res, next) => {
  console.log('Hi from createOrder');
  console.log('req.body', req.body);
  try {
    // Extract data from request
    const { kitchenOwnerId, kitchenName, deliveryAddress, dishes, totalQuantity, totalPrice, paymentMethod } = req.body;

    // Get customerId from authenticated user (via JWT)
    const customerId = req.user.id;

    // Fetch the student data to get the full name
    const student = await Student.findById(customerId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentFullName = `${student.first_name} ${student.last_name}`;
    const studentAddress = student.address;

    // Create a Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: dishes.map(dish => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: dish.name,  // Name of each dish
          },
          unit_amount: dish.price * 100,  // Convert to cents
        },
        quantity: dish.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/orders?session_id={CHECKOUT_SESSION_ID}`,  // Frontend success page
      cancel_url: `${req.headers.origin}/food/checkout`,
    });

    // Create the order in the database with 'paid' payment status (for now)
    const newOrder = new Order({
      customerId,  // This now comes from req.user
      customerName: studentFullName, // Save the student's full name
      customerAddress: studentAddress, // Save the student's address
      kitchenOwnerId,
      kitchenName,
      dishes: dishes.map(dish => ({
        dishId: dish.id,
        name: dish.name,  // Include dish name here
        quantity: dish.quantity,
        price: dish.price,
      })),
      totalQuantity,
      totalPrice,
      paymentStatus: 'paid',  // Directly set the payment status to 'paid'
      paymentMethod,
      deliveryAddress,
      status: 'placed',  // Set the status as 'placed'
    });

    // Save the order to the database
    await newOrder.save();

    const io = req.app.get('io'); // Get Socket.IO instance

    // Emit event to kitchen room
    io.to(`room-kitchen${kitchenOwnerId}`).emit('newOrder', newOrder);

    // Send back the Stripe session ID to the frontend
    res.status(201).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating order:", error);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

// Update order status and emit to user room
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    const io = req.app.get('io'); // Get Socket.IO instance

    // Emit event to the user room
    io.to(`room-user${updatedOrder.customerId}`).emit('orderUpdate', updatedOrder);

    res.status(200).send({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

exports.getOrdersForKitchen = async (req, res, next) => {
  try {
    const orders = await Order.find({ kitchenOwnerId: req.user.id });
    res.status(200).send(orders);
  } catch (error) {
    next(error); // Use next to handle errors
  }
};

exports.getOrdersForCustomer = async (req, res, next) => {
  console.log('Hi from getOrdersForCustomer');
  try {
    const customerId = req.user.id; // Extract from JWT token
    const orders = await Order.find({ customerId });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this customer." });
    }
    res.status(200).json(orders);
  } catch (error) {
    next(error); // Handle errors
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      throw new Error("Order not found");
    }
    res.status(200).send({ message: "Order deleted successfully" });
  } catch (error) {
    next(error); // Use next to handle errors
  }
};
