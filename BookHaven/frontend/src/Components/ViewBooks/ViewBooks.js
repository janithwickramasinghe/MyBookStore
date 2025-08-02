import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
HiBookOpen,
HiFilter,
HiSearch,
HiPencil,
HiTrash,
HiSave,
HiX,
HiUser,
HiCurrencyDollar,
HiGlobeAlt,
HiOfficeBuilding,
HiIdentification,
HiTag,
HiDocumentText,
HiPhotograph,
HiRefresh,
HiChevronDown,
HiExclamationCircle,
HiCheckCircle
} from 'react-icons/hi';

const ViewBooks = () => {
const API_BASE = process.env.REACT_APP_API_URL;
const [books, setBooks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [editingBookId, setEditingBookId] = useState(null);
const [editForm, setEditForm] = useState({});
const [showFilters, setShowFilters] = useState(false);
const [updateLoading, setUpdateLoading] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(null);
const [filters, setFilters] = useState({
  category: '',
  author: '',
  language: '',
  publisher: ''
});

// Sample data for demo
const sampleBooks = [
  {
    _id: '1',
    name: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 299,
    quantity: 25,
    language: 'English',
    publisher: 'Penguin Classics',
    isbn: '978-0-14-144737-4',
    isbn13: '978-0-14-144737-4',
    category: 'Fiction',
    description: 'A classic American novel set in the Jazz Age.',
    bookImage: 'gatsby.jpg'
  },
  {
    _id: '2',
    name: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 349,
    quantity: 18,
    language: 'English',
    publisher: 'HarperCollins',
    isbn: '978-0-06-112008-4',
    isbn13: '978-0-06-112008-4',
    category: 'Fiction',
    description: 'A gripping tale of racial injustice and childhood innocence.',
    bookImage: 'mockingbird.jpg'
  },
  {
    _id: '3',
    name: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 199,
    quantity: 32,
    language: 'English',
    publisher: 'HarperOne',
    isbn: '978-0-06-231500-7',
    isbn13: '978-0-06-231500-7',
    category: 'Philosophy',
    description: 'A philosophical story about following your dreams.',
    bookImage: 'alchemist.jpg'
  }
];

const handleFilterChange = (e) => {
  setFilters({ ...filters, [e.target.name]: e.target.value });
};

useEffect(() => {
  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      setBooks(response.data.books);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };
  fetchBooks();
}, []);

const deleteBook = async (id) => {
  if (!window.confirm('Are you sure you want to delete this book?')) return;
  setDeleteLoading(id);
  try {
    await axios.delete(`/books/${id}`);
    setBooks(books.filter(book => book._id !== id));
  } catch (err) {
    setError('Failed to delete book');
  } finally {
    setDeleteLoading(null);
  }
};

const startEdit = (book) => {
  setEditingBookId(book._id);
  setEditForm({
    name: book.name,
    price: book.price,
    quantity: book.quantity,
    language: book.language,
    author: book.author,
    publisher: book.publisher,
    isbn: book.isbn,
    isbn13: book.isbn13,
    category: book.category,
    description: book.description || ''
  });
};

const handleEditChange = (e) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

const submitEdit = async (id) => {
  setUpdateLoading(id);
  try {
    const response = await axios.put(`/books/${id}`, editForm);
    setBooks(books.map(book => book._id === id ? { ...book, ...editForm } : book));
    setEditingBookId(null);
  } catch (err) {
    setError('Failed to update book');
  } finally {
    setUpdateLoading(null);
  }
};

const cancelEdit = () => {
  setEditingBookId(null);
};

const filteredBooks = books.filter(book => {
  return (
    (filters.category === '' || book.category?.toLowerCase().includes(filters.category.toLowerCase())) &&
    (filters.author === '' || book.author?.toLowerCase().includes(filters.author.toLowerCase())) &&
    (filters.language === '' || book.language?.toLowerCase().includes(filters.language.toLowerCase())) &&
    (filters.publisher === '' || book.publisher?.toLowerCase().includes(filters.publisher.toLowerCase()))
  );
});

if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
      <div className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full border-b-2 animate-spin border-primary-600"></div>
        <p className="text-lg font-gilroyMedium text-neutral-600">Loading books...</p>
      </div>
    </div>
  );
}

return (
  <div className="py-8 min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
    <div className="px-6 mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h1 className="flex items-center space-x-3 text-3xl font-gilroyHeavy text-neutral-900">
            <HiBookOpen className="w-8 h-8 text-primary-600" />
            <span>Book Inventory</span>
          </h1>
          <p className="text-neutral-600 font-gilroyMedium">{filteredBooks.length} books available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 mb-8 bg-white rounded-2xl border shadow-lg border-neutral-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <HiFilter className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-gilroyBold text-neutral-900">Filter Books</h2>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 md:hidden text-primary-600 font-gilroyMedium"
          >
            <span>Filters</span>
            <HiChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
              <HiTag className="w-4 h-4 text-primary-600" />
              <span>Category</span>
            </label>
            <input
              type="text"
              name="category"
              placeholder="Filter by Category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
              <HiUser className="w-4 h-4 text-primary-600" />
              <span>Author</span>
            </label>
            <input
              type="text"
              name="author"
              placeholder="Filter by Author"
              value={filters.author}
              onChange={handleFilterChange}
              className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
              <HiGlobeAlt className="w-4 h-4 text-primary-600" />
              <span>Language</span>
            </label>
            <input
              type="text"
              name="language"
              placeholder="Filter by Language"
              value={filters.language}
              onChange={handleFilterChange}
              className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
              <HiOfficeBuilding className="w-4 h-4 text-primary-600" />
              <span>Publisher</span>
            </label>
            <input
              type="text"
              name="publisher"
              placeholder="Filter by Publisher"
              value={filters.publisher}
              onChange={handleFilterChange}
              className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 mt-4 border-t border-neutral-100">
          <p className="text-sm text-neutral-500 font-gilroyRegular">
            Showing {filteredBooks.length} of {books.length} books
          </p>
          <button
            onClick={() => {
              setBooks([]);
              setLoading(true);
              const fetchBooks = async () => {
                try {
                  const response = await axios.get('/books');
                  setBooks(response.data.books);
                } catch (err) {
                  setError('Failed to fetch books');
                } finally {
                  setLoading(false);
                }
              };
              fetchBooks();
            }}
            className="flex items-center space-x-2 transition-colors text-primary-600 hover:text-primary-700 font-gilroyMedium"
          >
            <HiRefresh className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-4 mb-6 space-x-3 bg-red-50 rounded-xl border border-red-200">
          <HiExclamationCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
          <span className="text-red-800 font-gilroyMedium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Books List */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl shadow-lg">
          <HiBookOpen className="mx-auto mb-6 w-24 h-24 text-neutral-300" />
          <h2 className="mb-3 text-2xl font-gilroyBold text-neutral-600">
            No books found
          </h2>
          <p className="text-neutral-500 font-gilroyRegular">
            {books.length === 0 ? "No books have been added yet." : "Try adjusting your filters to see more results."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBooks.map((book) => (
            <div key={book._id} className="overflow-hidden bg-white rounded-2xl border shadow-lg border-neutral-100">
              {/* Book Header */}
              <div className="p-6 bg-gradient-to-r border-b from-primary-50 to-secondary-50 border-neutral-100">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {book.bookImage ? (
                        <img 
                        src={book.bookImage}
                          alt={book.name}
                          className="object-cover w-16 h-20 rounded-lg"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-16 h-20 bg-gradient-to-br rounded-lg from-neutral-200 to-neutral-300">
                          <HiBookOpen className="w-8 h-8 text-neutral-500" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-gilroyBold text-neutral-900">{book.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <div className="flex items-center space-x-1">
                          <HiUser className="w-4 h-4" />
                          <span className="font-gilroyMedium">{book.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiTag className="w-4 h-4" />
                          <span className="font-gilroyMedium">{book.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiCurrencyDollar className="w-4 h-4" />
                          <span className="font-gilroyBold text-primary-600">Rs.{book.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 text-sm rounded-full font-gilroyBold ${
                      book.quantity > 20 ? 'bg-green-100 text-green-800' :
                      book.quantity > 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Stock: {book.quantity}
                    </span>
                    {editingBookId !== book._id && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEdit(book)}
                          className="flex items-center px-3 py-2 space-x-1 text-sm rounded-lg border transition-colors bg-primary-100 text-primary-700 border-primary-200 font-gilroyMedium hover:bg-primary-200"
                        >
                          <HiPencil className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteBook(book._id)}
                          disabled={deleteLoading === book._id}
                          className="flex items-center px-3 py-2 space-x-1 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200 transition-colors font-gilroyMedium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === book._id ? (
                            <div className="w-4 h-4 rounded-full border-b-2 border-red-600 animate-spin"></div>
                          ) : (
                            <HiTrash className="w-4 h-4" />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Content */}
              <div className="p-6">
                {editingBookId === book._id ? (
                  /* Edit Form */
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                          <HiBookOpen className="w-4 h-4 text-primary-600" />
                          <span>Book Name</span>
                        </label>
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                          <HiUser className="w-4 h-4 text-primary-600" />
                          <span>Author</span>
                        </label>
                        <input
                          name="author"
                          value={editForm.author}
                          onChange={handleEditChange}
                          className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                          <HiCurrencyDollar className="w-4 h-4 text-primary-600" />
                          <span>Price</span>
                        </label>
                        <input
                          name="price"
                          type="number"
                          value={editForm.price}
                          onChange={handleEditChange}
                          className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                          <HiTag className="w-4 h-4 text-primary-600" />
                          <span>Quantity</span>
                        </label>
                        <input
                          name="quantity"
                          type="number"
                          value={editForm.quantity}
                          onChange={handleEditChange}
                          className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                          <HiGlobeAlt className="w-4 h-4 text-primary-600" />
                          <span>Language</span>
                        </label>
                        <input
                          name="language"
                          value={editForm.language}
                          onChange={handleEditChange}
                          className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                          <HiOfficeBuilding className="w-4 h-4 text-primary-600" />
                          <span>Publisher</span>
                        </label>
                        <input
                          name="publisher"
                          value={editForm.publisher}
                          onChange={handleEditChange}
                          className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                          <HiIdentification className="w-4 h-4 text-primary-600" />
                          <span>ISBN</span>
                        </label>
                        <input
                          name="isbn"
                          value={editForm.isbn}
                          onChange={handleEditChange}
                          className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                          <HiIdentification className="w-4 h-4 text-primary-600" />
                          <span>ISBN-13</span>
                        </label>
                        <input
                          name="isbn13"
                          value={editForm.isbn13}
                          onChange={handleEditChange}
                          className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                          <HiTag className="w-4 h-4 text-primary-600" />
                          <span>Category</span>
                        </label>
                        <input
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                        <HiDocumentText className="w-4 h-4 text-primary-600" />
                        <span>Description</span>
                      </label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows={3}
                        className="px-4 py-3 w-full bg-white rounded-xl border transition-colors resize-none border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div className="flex justify-end pt-4 space-x-3 border-t border-neutral-100">
                      <button
                        onClick={cancelEdit}
                        className="flex items-center px-4 py-2 space-x-2 rounded-lg transition-colors text-neutral-600 bg-neutral-100 font-gilroyMedium hover:bg-neutral-200"
                      >
                        <HiX className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={() => submitEdit(book._id)}
                        disabled={updateLoading === book._id}
                        className="flex items-center px-4 py-2 space-x-2 text-white rounded-lg transition-colors bg-primary-600 font-gilroyMedium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updateLoading === book._id ? (
                          <div className="w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
                        ) : (
                          <HiSave className="w-4 h-4" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display View */
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 rounded-xl bg-neutral-50">
                      <div className="flex items-center mb-2 space-x-2">
                        <HiGlobeAlt className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-gilroyMedium text-neutral-700">Language</span>
                      </div>
                      <p className="font-gilroyRegular text-neutral-900">{book.language}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50">
                      <div className="flex items-center mb-2 space-x-2">
                        <HiOfficeBuilding className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-gilroyMedium text-neutral-700">Publisher</span>
                      </div>
                      <p className="font-gilroyRegular text-neutral-900">{book.publisher}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50">
                      <div className="flex items-center mb-2 space-x-2">
                        <HiIdentification className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-gilroyMedium text-neutral-700">ISBN</span>
                      </div>
                      <p className="font-gilroyRegular text-neutral-900">{book.isbn}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50">
                      <div className="flex items-center mb-2 space-x-2">
                        <HiIdentification className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-gilroyMedium text-neutral-700">ISBN-13</span>
                      </div>
                      <p className="font-gilroyRegular text-neutral-900">{book.isbn13}</p>
                    </div>
                    <div className="p-4 rounded-xl md:col-span-2 bg-neutral-50">
                      <div className="flex items-center mb-2 space-x-2">
                        <HiDocumentText className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-gilroyMedium text-neutral-700">Description</span>
                      </div>
                      <p className="font-gilroyRegular text-neutral-900">{book.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};

export default ViewBooks;