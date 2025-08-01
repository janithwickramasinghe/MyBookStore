const Order = require('../Model/OrderModel');
const Payment = require('../Model/PaymentModel');
const Book = require('../Model/BookModel');
const User = require('../Model/UserModel');

class OrderController {
    // Create order
    async createOrder(req, res) {
        try {
            const { items, deliveryAddress, totalAmount } = req.body;
            const userId = req.user._id;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Order must contain at least one item'
                });
            }

            if (!deliveryAddress) {
                return res.status(400).json({
                    success: false,
                    message: 'Delivery address is required'
                });
            }

            if (!totalAmount || totalAmount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid total amount is required'
                });
            }

            // Validate books exist and have sufficient stock
            for (const item of items) {
                const book = await Book.findById(item.book);
                if (!book) {
                    return res.status(404).json({
                        success: false,
                        message: `Book with ID ${item.book} not found`
                    });
                }

                if (book.quantity < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient stock for ${book.name}. Available: ${book.quantity}`
                    });
                }
            }

            const order = new Order({
                user: userId,
                items,
                deliveryAddress,
                totalAmount,
                status: 'Pending'
            });

            await order.save();

            // Remove ordered items from user's cart
            const Cart = require('../Model/CartModel');
            let cart = await Cart.findOne({ user: userId });
            if (cart) {
                // Remove each ordered item from the cart
                const orderedBookIds = items.map(item => item.book.toString());
                cart.items = cart.items.filter(item => !orderedBookIds.includes(item.book.toString()));
                await cart.save();
            }

            res.json({
                success: true,
                message: 'Order created successfully',
                data: order
            });

        } catch (error) {
            console.error('Order creation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create order'
            });
        }
    }

    // Inside OrderController class
    async getAllOrders(req, res) {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Admins only.'
                });
            }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const orders = await Order.find()
                .populate('user', 'name email') // show basic user info
                .populate('items.book', 'name price author')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const total = await Order.countDocuments();

            res.json({
                success: true,
                data: {
                    orders,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            });

        } catch (error) {
            console.error('Admin getAllOrders error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch all orders'
            });
        }
    }


    // Get all orders for user
    async getOrders(req, res) {
        try {

            const userId = req.user._id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;

            let query = { user: userId };
            if (status) {
                query.status = status;
            }

            const orders = await Order.find(query)
                .populate('items.book', 'name price author')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const total = await Order.countDocuments(query);

            res.json({
                success: true,
                data: {
                    orders,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get orders error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch orders'
            });
        }
    }

    // Get single order
    async getOrder(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.user._id;

            const order = await Order.findOne({ _id: orderId, user: userId })
                .populate('items.book', 'name price author publisher isbn');

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Get payment information for this order
            const payment = await Payment.findOne({ order: orderId });

            res.json({
                success: true,
                data: {
                    order,
                    payment: payment || null
                }
            });

        } catch (error) {
            console.error('Get order error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch order'
            });
        }
    }

    // Update order status
    async updateOrder(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;
            const userId = req.user._id;

            const order = await Order.findOne({ _id: orderId, user: userId });
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Validate status transition
            const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order status'
                });
            }

            // If cancelling order, check if payment exists and is completed
            if (status === 'Cancelled') {
                const payment = await Payment.findOne({ order: orderId });
                if (payment && payment.status === 'completed') {
                    return res.status(400).json({
                        success: false,
                        message: 'Cannot cancel order with completed payment'
                    });
                }
            }

            order.status = status;
            await order.save();

            res.json({
                success: true,
                message: 'Order updated successfully',
                data: order
            });

        } catch (error) {
            console.error('Update order error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update order'
            });
        }
    }

    // Update only order status (PATCH)
    async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;
            const userId = req.user._id;

            const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order status'
                });
            }

            const order = await Order.findOne({ _id: orderId, user: userId });
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            order.status = status;
            await order.save();

            res.json({
                success: true,
                message: 'Order status updated successfully',
                data: order
            });
        } catch (error) {
            console.error('Update order status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update order status'
            });
        }
    }

    // Cancel order
    async cancelOrder(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.user._id;

            const order = await Order.findOne({ _id: orderId, user: userId });
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Check if order can be cancelled
            if (order.status === 'Delivered') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot cancel delivered order'
                });
            }

            // Check if payment exists and is completed
            const payment = await Payment.findOne({ order: orderId });
            if (payment && payment.status === 'completed') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot cancel order with completed payment. Contact support for refund.'
                });
            }

            order.status = 'Cancelled';
            await order.save();

            res.json({
                success: true,
                message: 'Order cancelled successfully',
                data: order
            });

        } catch (error) {
            console.error('Cancel order error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to cancel order'
            });
        }
    }

    // Get order statistics
    async getOrderStats(req, res) {
        try {
            const userId = req.user._id;

            const stats = await Order.aggregate([
                { $match: { user: new require('mongoose').Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' }
                    }
                }
            ]);

            const totalOrders = await Order.countDocuments({ user: userId });
            const totalSpent = await Order.aggregate([
                { $match: { user: new require('mongoose').Types.ObjectId(userId) } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]);

            res.json({
                success: true,
                data: {
                    stats,
                    totalOrders,
                    totalSpent: totalSpent[0]?.total || 0
                }
            });

        } catch (error) {
            console.error('Get order stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch order statistics'
            });
        }
    }

    // Get orders by status
    async getOrdersByStatus(req, res) {
        try {
            const { status } = req.params;
            const userId = req.user.id;

            const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order status'
                });
            }

            const orders = await Order.find({ user: userId, status })
                .populate('items.book', 'name price author')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                data: orders
            });

        } catch (error) {
            console.error('Get orders by status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch orders'
            });
        }
    }
}

// Get most frequently bought books (top N)
const getFrequentlyBoughtBooks = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const result = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.book",
                    totalBought: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalBought: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book"
                }
            },
            { $unwind: "$book" }
        ]);
        res.status(200).json({ books: result.map(r => ({ ...r.book, totalBought: r.totalBought })) });
    } catch (err) {
        res.status(500).json({ message: "Error fetching frequently bought books." });
    }
};

module.exports = new OrderController();
module.exports.getFrequentlyBoughtBooks = getFrequentlyBoughtBooks; 