const express = require('express');
const router = express.Router();
const OrderController = require('../Controllers/OrderController');
const { authenticateUser } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Apply authentication middleware to all order routes
router.use(authenticateUser);

// CRUD operations
router.post('/create', OrderController.createOrder);
router.get('/all', OrderController.getOrders);
router.get('/:orderId', authenticateUser,OrderController.getOrder);
router.put('/:orderId', authenticateUser,OrderController.updateOrder);

// Update only order status
router.patch('/:orderId/status', OrderController.updateOrderStatus);

// Special operations
router.delete('/:orderId/cancel', authenticateUser,OrderController.cancelOrder);
router.get('/stats/overview', authenticateUser,OrderController.getOrderStats);
router.get('/status/:status', OrderController.getOrdersByStatus);

//Get All orders
router.get('/admin/all', OrderController.getAllOrders);

module.exports = router; 