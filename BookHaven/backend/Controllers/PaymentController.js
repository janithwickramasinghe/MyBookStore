const Payment = require('../Model/PaymentModel');
const Order = require('../Model/OrderModel');
const Cart = require('../Model/CartModel');
const Book = require('../Model/BookModel');
const User = require('../Model/UserModel');
const { sendInvoiceEmail } = require('../services/emailService');
const { sendStockAlertEmail } = require('../services/emailService');

class PaymentController {
    // Create payment for existing order
    async createPayment(req, res) {
        try {
            const { orderId, amount, paymentMethod, cardLastFour } = req.body;
            const userId = req.user._id;

            // Validate order exists and belongs to user
            const order = await Order.findOne({ _id: orderId, user: userId });
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Process payment
            const paymentSuccess = await PaymentController.processPayment(amount, paymentMethod, cardLastFour);

            if (!paymentSuccess) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment failed. Please try again.'
                });
            }

            // Payment successful - create payment record
            const payment = new Payment({
                user: userId,
                order: orderId,
                amount,
                paymentMethod,
                cardLastFour,
                status: 'completed'
            });

            await payment.save();

            // Update order status only if payment was successful
            order.status = 'Confirmed';
            await order.save();

            // Remove items of this order from user's cart
            try {
                const cart = await Cart.findOne({ user: userId });
                if (cart) {
                    // Get book IDs from order items
                    const orderBookIds = order.items.map(item => item.book.toString());
                    // Remove items from cart that are in the order
                    cart.items = cart.items.filter(item => !orderBookIds.includes(item.book.toString()));
                    await cart.save();
                }
            } catch (cartError) {
                console.error('Failed to remove order items from cart:', cartError);
                // Don't fail the payment if cart update fails
            }

            // Send invoice email to user
            try {
                const user = await User.findById(userId);
                if (user && user.email) {
                    // Populate order with book details for invoice
                    const populatedOrder = await Order.findById(orderId)
                        .populate('items.book', 'name price');

                    await sendInvoiceEmail(user.email, user, populatedOrder, payment);
                }
            } catch (emailError) {
                console.error('Failed to send invoice email:', emailError);
                // Don't fail the payment if email fails
            }

            res.json({
                success: true,
                message: 'Payment processed and order confirmed successfully',
                data: {
                    payment: payment,
                    order: order
                }
            });

        } catch (error) {
            console.error('Payment creation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create payment'
            });
        }
    }

    // Get all payments for user
    async getPayments(req, res) {
        try {
            const userId = req.user._id;
            const payments = await Payment.find({ user: userId })
                .populate('order', 'totalAmount status createdAt')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                data: payments
            });

        } catch (error) {
            console.error('Get payments error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch payments'
            });
        }
    }

    // Get single payment
    async getPayment(req, res) {
        try {
            const { paymentId } = req.params;
            const userId = req.user._id;

            const payment = await Payment.findOne({ _id: paymentId, user: userId })
                .populate('order', 'totalAmount status items deliveryAddress createdAt');

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            res.json({
                success: true,
                data: payment
            });

        } catch (error) {
            console.error('Get payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch payment'
            });
        }
    }

    // Update payment status
    async updatePayment(req, res) {
        try {
            const { paymentId } = req.params;
            const { status } = req.body;
            const userId = req.user._id;

            const payment = await Payment.findOne({ _id: paymentId, user: userId });
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            payment.status = status;
            await payment.save();

            res.json({
                success: true,
                message: 'Payment updated successfully',
                data: payment
            });

        } catch (error) {
            console.error('Update payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update payment'
            });
        }
    }
    }

module.exports = new PaymentController(); 