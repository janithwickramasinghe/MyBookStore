const express = require('express');
const router = express.Router();
const PaymentController = require('../Controllers/PaymentController');
const { authenticateUser } = require('../middleware/auth');

// Apply authentication middleware to all payment routes
router.use(authenticateUser);

// CRUD operations
router.post('/create', PaymentController.createPayment);
router.get('/all', PaymentController.getPayments);
router.get('/:paymentId', PaymentController.getPayment);
router.put('/:paymentId', PaymentController.updatePayment);
router.delete('/:paymentId', PaymentController.deletePayment);

// Process cart payment
router.post('/process-cart', PaymentController.processCartPayment);

module.exports = router; 