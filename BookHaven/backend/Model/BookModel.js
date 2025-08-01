const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    language: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    isbn: { type: String, required: true },
    isbn13: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    bookImage: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema); 