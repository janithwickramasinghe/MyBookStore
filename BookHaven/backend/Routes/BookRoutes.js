const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBookById, updateBook, deleteBook, getNewArrivals } = require('../Controllers/BookController');
const { getFrequentlyBoughtBooks } = require('../Controllers/OrderController');
const { authenticateUser } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Add a new book (admin only)
router.post('/add', authenticateUser, isAdmin, upload.single('bookImage'), addBook);

// List all books
router.get('/', getAllBooks);

// List new arrivals
router.get('/new-arrivals', getNewArrivals);

// List frequently bought books
router.get('/frequently-bought', getFrequentlyBoughtBooks);

// Get a book by ID
router.get('/:id', getBookById);

// Update a book (admin only)
router.put('/:id', authenticateUser, isAdmin, updateBook);

// Delete a book (admin only)
router.delete('/:id', authenticateUser, isAdmin, deleteBook);

module.exports = router;
