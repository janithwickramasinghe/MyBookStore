const Cart = require('../Model/CartModel');
const Book = require('../Model/BookModel');
const User = require('../Model/UserModel')

// Add book to cart
const addToCart = async (req, res, next) => {
    const userId = req.user._id; // assuming req.user is populated by auth middleware
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Valid bookId and quantity are required.' });
    }

    try {
        // Validate book existence
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        // Check if user already has a cart
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                user: userId,
                items: [{ book: bookId, quantity }]
            });
        } else {
            // Check if book already exists in cart
            const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({ book: bookId, quantity });
            }
        }

        await cart.save();
        return res.status(200).json({ message: 'Book added to cart.', cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error adding to cart.' });
    }
};

// View cart
const viewCart = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ user: userId })
            .populate('items.book')
            .populate('user', 'firstName lastName email');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        return res.status(200).json({ cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving cart.' });
    }
};

// Remove item from cart by Book ID
const removeFromCart = async (req, res) => {
    try {
      const { selectedItems } = req.body; // list of book IDs
  
      const cart = await Cart.findOne({ user: req.user._id });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      cart.items = cart.items.filter(
        item => !selectedItems.includes(item.book.toString())
      );
      await cart.save();
  
      res.json({ message: 'Selected items removed from cart' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove items from cart' });
    }
  };
// Update quantity of an item in the cart
const updateCartItemQuantity = async (req, res, next) => {
    const userId = req.user._id;
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity || quantity < 1) {
        return res.status(400).json({ message: 'Valid bookId and quantity (>=1) are required.' });
    }

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Book not found in cart.' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return res.status(200).json({ message: 'Cart item quantity updated.', cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating cart item quantity.' });
    }
};

module.exports = {
    addToCart,
    viewCart,
    removeFromCart,
    updateCartItemQuantity
};
