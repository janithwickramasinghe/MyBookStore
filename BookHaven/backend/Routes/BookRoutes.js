const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBookById, updateBook, deleteBook, getNewArrivals } = require('../Controllers/BookController');
const { getFrequentlyBoughtBooks } = require('../Controllers/OrderController');
const { authenticateUser } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const { upload } = require('../middleware/CloudinaryConfig');

router.post('/add', authenticateUser, isAdmin, upload.single('bookImage'), addBook);

// Other routes remain the same
router.get('/', getAllBooks);
router.get('/new-arrivals', getNewArrivals);
router.get('/frequently-bought', getFrequentlyBoughtBooks);
router.get('/:id', getBookById);
router.put('/:id', authenticateUser, isAdmin, updateBook);
router.delete('/:id', authenticateUser, isAdmin, deleteBook);

module.exports = router;
