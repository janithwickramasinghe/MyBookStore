const Book = require('../Model/BookModel');
const {sendBookNotificationEmail} = require('../services/emailService')

// Add a new book (admin only)
const addBook = async (req, res, next) => {
    // Placeholder admin check (replace with real auth logic)
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Only admins can add books.' });
    }
    const { name, price, quantity, language, author, publisher, isbn, isbn13, category, description } = req.body;
    // bookImage will be handled by multer and available as req.file
    if (!name || !price || !quantity || !language || !author || !publisher || !isbn || !isbn13 || !category || !description) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    let bookImage = null;
    if (req.file) {
        bookImage = req.file.filename; // or req.file.path if you want the full path
    }
    try {
        const book = new Book({ name, price, quantity, language, author, publisher, isbn, isbn13, category, description, bookImage });
        await book.save();
        await sendBookNotificationEmail('added', book);
        return res.status(201).json({ message: 'Book added successfully.', book });
    } catch (err) {
        return res.status(500).json({ message: 'Error adding book.' });
    }
};

// Get all books with filtering
const getAllBooks = async (req, res, next) => {
    try {
        const { author, language, publisher, minPrice, maxPrice, name, isbn, isbn13, category, inStock } = req.query;
        let filter = {};
        if (author) filter.author = author;
        if (language) filter.language = language;
        if (publisher) filter.publisher = publisher;
        if (isbn) filter.isbn = isbn;
        if (isbn13) filter.isbn13 = isbn13;
        if (category) filter.category = category;
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (inStock === 'true') filter.quantity = { $gt: 0 };
        const books = await Book.find(filter);
        return res.status(200).json({ books });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching books.' });
    }
};

// Get a book by ID
const getBookById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        return res.status(200).json({ book });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching book.' });
    }
};

// Update a book (admin only)
const updateBook = async (req, res, next) => {
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Only admins can update books.' });
    }
    const { id } = req.params;
    const { name, price, quantity, language, author, publisher, isbn, isbn13, category, description } = req.body;
    try {
        const book = await Book.findByIdAndUpdate(
            id,
            { name, price, quantity, language, author, publisher, isbn, isbn13, category, description },
            { new: true, runValidators: true }
        );
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        await sendBookNotificationEmail('updated', book);
        return res.status(200).json({ message: 'Book updated successfully.', book });
    } catch (err) {
        return res.status(500).json({ message: 'Error updating book.' });
    }
};

// Delete a book (admin only)
const deleteBook = async (req, res, next) => {
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Only admins can delete books.' });
    }
    const { id } = req.params;
    try {
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        await sendBookNotificationEmail('deleted', book);
        return res.status(200).json({ message: 'Book deleted successfully.', book });
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting book.' });
    }
};

// Get new arrivals (latest N books)
const getNewArrivals = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const books = await Book.find().sort({ createdAt: -1 }).limit(limit);
        return res.status(200).json({ books });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching new arrivals.' });
    }
};

module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook, getNewArrivals }; 