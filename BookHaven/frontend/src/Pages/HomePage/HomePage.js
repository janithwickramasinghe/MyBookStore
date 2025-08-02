import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import useScrollToHash from '../../Hooks/userScrollerToHash';

const BookCard = ({ book }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="overflow-hidden relative bg-white rounded-2xl border shadow-lg transition-all duration-300 transform group hover:shadow-2xl border-neutral-100 hover:border-primary-200 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Book Image */}
      <div className="overflow-hidden relative">
        {book.bookImage ? (
          <img 
            src={`http://backend:5000/uploads/${book.bookImage}`} 
            alt={book.name} 
            className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-64 bg-gradient-to-br from-neutral-100 to-neutral-200">
            <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link 
            to={`/book/${book._id}`}
            className="px-6 py-2 text-sm bg-white rounded-full transition-colors duration-200 transform text-neutral-900 font-gilroyBold hover:bg-primary-50 hover:scale-105"
          >
            View Book
          </Link>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 text-sm text-white rounded-full shadow-lg bg-primary-600 font-gilroyBold">
          Rs.{book.price}
        </div>
      </div>

      {/* Book Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="mb-2 text-lg transition-colors font-gilroyBold text-neutral-900 line-clamp-2 group-hover:text-primary-700">
            {book.name}
          </h3>
          <p className="text-sm font-gilroyRegular text-neutral-600">
            by {book.author}
          </p>
        </div>

        {/* Details Section */}
        <div className={`transition-all duration-300 overflow-hidden ${showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 space-y-2 border-t border-neutral-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-gilroyRegular text-neutral-500">Language:</span>
              <span className="text-sm font-gilroyBold text-neutral-700">{book.language}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-gilroyRegular text-neutral-500">Publisher:</span>
              <span className="text-sm font-gilroyBold text-neutral-700">{book.publisher}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-gilroyRegular text-neutral-500">ISBN:</span>
              <span className="text-sm font-gilroyBold text-neutral-700">{book.isbn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-gilroyRegular text-neutral-500">Category:</span>
              <span className="text-sm font-gilroyBold text-primary-600">{book.category}</span>
            </div>
          </div>
        </div>

        {/* Details Toggle Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex justify-center items-center py-2 mt-4 space-x-2 w-full rounded-lg border transition-colors duration-200 border-neutral-200 hover:bg-neutral-50 group/btn"
        >
          <span className="text-sm font-gilroyBold text-neutral-700 group-hover/btn:text-primary-600">
            {showDetails ? 'Hide Details' : 'Show Details'}
          </span>
          <svg 
            className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [sinhalaBooks, setSinhalaBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [search, setSearch] = useState({ name: '', author: '', publisher: '', isbn: '' });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useScrollToHash();

  // Fetch homepage sections
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [freqRes, newArrRes, sinhalaRes, allBooksRes] = await Promise.all([
          axios.get('/books/frequently-bought?limit=8'),
          axios.get('/books/new-arrivals?limit=8'),
          axios.get('/books?language=Sinhala'),
          axios.get('/books'),
        ]);
        setFrequentlyBought(freqRes.data.books);
        setNewArrivals(newArrRes.data.books);
        setSinhalaBooks(sinhalaRes.data.books);
        setAllBooks(allBooksRes.data.books);
        // Extract unique categories
        const cats = Array.from(new Set(allBooksRes.data.books.map(b => b.category)));
        setCategories(cats);
        setFilteredBooks(allBooksRes.data.books);
      } catch (err) {
        setError('Failed to load homepage data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-filter when search params change
  useEffect(() => {
    const filterBooks = () => {
      let filtered = allBooks;

      // Apply search filters
      if (search.name) {
        filtered = filtered.filter(book => 
          book.name.toLowerCase().includes(search.name.toLowerCase())
        );
      }
      if (search.author) {
        filtered = filtered.filter(book => 
          book.author.toLowerCase().includes(search.author.toLowerCase())
        );
      }
      if (search.publisher) {
        filtered = filtered.filter(book => 
          book.publisher.toLowerCase().includes(search.publisher.toLowerCase())
        );
      }
      if (search.isbn) {
        filtered = filtered.filter(book => 
          book.isbn.toLowerCase().includes(search.isbn.toLowerCase())
        );
      }
      if (selectedCategory) {
        filtered = filtered.filter(book => book.category === selectedCategory);
      }

      setFilteredBooks(filtered);
    };

    filterBooks();
  }, [search, selectedCategory, allBooks]);

  // Handle search/filter
  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const clearFilters = () => {
    setSearch({ name: '', author: '', publisher: '', isbn: '' });
    setSelectedCategory('');
  };

  const hasActiveFilters = search.name || search.author || search.publisher || search.isbn || selectedCategory;

  return (
    <div className="min-h-screen bg-gradient-to-br via-white from-neutral-50 to-primary-50/30">
      <Header />
      
      {/* Hero Section */}
      <div id="hero" className="overflow-hidden h-[600px] relative text-white bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 mt-[-100px] pt-[100px]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-24 mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="mb-6 text-5xl md:text-6xl font-gilroyHeavy animate-fade-in">
              Welcome to <span className="text-secondary-300">BookHaven</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90 font-gilroyRegular">
              Discover your next favorite book from our curated collection of literary treasures
            </p>
            
            {/* Search Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-6 py-3 space-x-3 text-white rounded-full border backdrop-blur-sm transition-all duration-300 transform bg-white/20 border-white/30 font-gilroyBold hover:bg-white/30 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{showFilters ? 'Hide Filters' : 'Search & Filter Books'}</span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute left-10 top-20 w-20 h-20 rounded-full blur-xl animate-pulse bg-white/10"></div>
        <div className="absolute right-10 bottom-20 w-32 h-32 rounded-full blur-2xl delay-1000 animate-pulse bg-secondary-400/20"></div>
      </div>

      <div className="px-6 py-12 mx-auto max-w-7xl">
        {/* Search & Filter Panel */}
        <div className={`transition-all duration-500 overflow-hidden ${showFilters ? 'mb-12 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-8 bg-white rounded-2xl border shadow-xl border-neutral-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-gilroyBold text-neutral-900">Search & Filter Books</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm transition-colors font-gilroyBold text-neutral-500 hover:text-primary-600"
                >
                  Clear All Filters
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {/* Book Name */}
              <div className="relative group">
                <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Book Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={search.name}
                    onChange={handleSearchChange}
                    placeholder="Search by book name"
                    className="px-4 py-3 pl-10 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>

              {/* Author */}
              <div className="relative group">
                <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Author</label>
                <div className="relative">
                  <input
                    type="text"
                    name="author"
                    value={search.author}
                    onChange={handleSearchChange}
                    placeholder="Search by author"
                    className="px-4 py-3 pl-10 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Publisher */}
              <div className="relative group">
                <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Publisher</label>
                <div className="relative">
                  <input
                    type="text"
                    name="publisher"
                    value={search.publisher}
                    onChange={handleSearchChange}
                    placeholder="Search by publisher"
                    className="px-4 py-3 pl-10 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>

              {/* ISBN */}
              <div className="relative group">
                <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">ISBN</label>
                <div className="relative">
                  <input
                    type="text"
                    name="isbn"
                    value={search.isbn}
                    onChange={handleSearchChange}
                    placeholder="Search by ISBN"
                    className="px-4 py-3 pl-10 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
              </div>

              {/* Category */}
              <div className="relative group md:col-span-2">
                <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="px-4 py-3 pl-10 w-full rounded-xl border transition-all duration-300 appearance-none bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <svg className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <svg className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary-600"></div>
          </div>
        )}

        {error && (
          <div className="px-6 py-4 mb-8 text-center text-red-800 bg-red-100 rounded-xl border border-red-200 font-gilroyRegular">
            {error}
          </div>
        )}

        {/* Search Results Section */}
        {(hasActiveFilters || showFilters) && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-gilroyHeavy text-neutral-900">
                Search Results
                <span className="ml-3 text-lg font-gilroyRegular text-neutral-500">
                  ({filteredBooks.length} books found)
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <svg className="mx-auto mb-4 w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-neutral-500 font-gilroyRegular">No books found matching your criteria.</p>
                </div>
              ) : (
                filteredBooks.map(book => <BookCard key={book._id} book={book} />)
              )}
            </div>
          </div>
        )}

        {/* Frequently Bought Section */}
        <div id="frequently-bought" className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-gilroyHeavy text-neutral-900">Frequently Bought</h2>
            <div className="flex-1 ml-8 h-1 bg-gradient-to-r rounded-full from-primary-500 to-secondary-500"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {frequentlyBought.length === 0 ? (
              <div className="col-span-full py-8 text-center">
                <p className="text-neutral-500 font-gilroyRegular">No data available.</p>
              </div>
            ) : (
              frequentlyBought.map(book => <BookCard key={book._id || book._id?.toString()} book={book} />)
            )}
          </div>
        </div>

        {/* New Arrivals Section */}
        <div id="new-arrivals"className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-gilroyHeavy text-neutral-900">New Arrivals</h2>
            <div className="flex-1 ml-8 h-1 bg-gradient-to-r rounded-full from-secondary-500 to-primary-500"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newArrivals.length === 0 ? (
              <div className="col-span-full py-8 text-center">
                <p className="text-neutral-500 font-gilroyRegular">No data available.</p>
              </div>
            ) : (
              newArrivals.map(book => <BookCard key={book._id} book={book} />)
            )}
          </div>
        </div>

        {/* Sinhala Language Books Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-gilroyHeavy text-neutral-900">Sinhala Language Books</h2>
            <div className="flex-1 ml-8 h-1 bg-gradient-to-r rounded-full from-accent-500 to-secondary-500"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sinhalaBooks.length === 0 ? (
              <div className="col-span-full py-8 text-center">
                <p className="text-neutral-500 font-gilroyRegular">No Sinhala books found.</p>
              </div>
            ) : (
              sinhalaBooks.map(book => <BookCard key={book._id} book={book} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;