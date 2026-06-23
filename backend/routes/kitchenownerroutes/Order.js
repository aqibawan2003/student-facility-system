// orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/kitchenownercontroller/orderController');
const authenticateToken = require('../../middlewares/AuthToken');  // Ensure the user is authenticated



// POST request to create a new order
router.post('/create',authenticateToken, orderController.createOrder);

// GET request to retrieve orders for a kitchen owner
router.get('/kitchen',authenticateToken, orderController.getOrdersForKitchen);
router.patch('/update/:orderId', authenticateToken, orderController.updateOrderStatus);
// router.delete('/:orderId', authenticateToken, orderController.removeOrder);

// GET request to retrieve orders for a customer
router.get('/customer',authenticateToken, orderController.getOrdersForCustomer);

// PUT request to update an order's status
router.put('/update/:orderId',authenticateToken, orderController.updateOrderStatus);

// DELETE request to delete an order
router.delete('/delete/:orderId',authenticateToken, orderController.deleteOrder);

module.exports = router;
