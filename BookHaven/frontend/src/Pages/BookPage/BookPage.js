import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import {
  HiArrowLeft,
  HiShoppingCart,
  HiHeart,
  HiShare,
  HiStar,
  HiUser,
  HiGlobe,
  HiOfficeBuilding,
  HiBookOpen,
  HiTag,
  HiInformationCircle,
  HiPlus,
  HiMinus,
  HiCheckCircle,
  HiExclamationCircle,
  HiSparkles
} from 'react-icons/hi';
import Header from '../../Components/Header/Header';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const [cartError, setCartError] = useState('');
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/books/${id}`);
        setBook(res.data.book || res.data);
      } catch (err) {
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    setCartMessage('');
    setCartError('');
    try {
      const res = await axios.post('/cart/add', {
        bookId: id,
        quantity: Number(quantity)
      });
      setCartMessage('Book added to cart successfully!');
      setTimeout(() => setCartMessage(''), 3000);
    } catch (err) {
      setCartError(err.response?.data?.message || 'Failed to add to cart.');
      setTimeout(() => setCartError(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full border-b-2 animate-spin border-primary-600"></div>
          <p className="text-lg font-gilroyMedium text-neutral-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="p-8 text-center bg-white rounded-2xl border border-red-100 shadow-lg">
          <HiExclamationCircle className="mx-auto mb-4 w-16 h-16 text-red-500" />
          <h2 className="mb-2 text-xl text-red-600 font-gilroyBold">Error Loading Book</h2>
          <p className="mb-4 text-neutral-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-2 space-x-2 text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700 font-gilroyMedium"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="p-8 text-center bg-white rounded-2xl shadow-lg">
            <HiBookOpen className="mx-auto mb-4 w-16 h-16 text-neutral-400" />
            <h2 className="mb-2 text-xl font-gilroyBold text-neutral-600">Book Not Found</h2>
            <p className="mb-4 text-neutral-500">The book you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center px-6 py-2 space-x-2 text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700 font-gilroyMedium"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  const total = (Number(book.price) * Number(quantity)).toFixed(2);

  return (
    <>
      <Header />
      <div className="py-8 min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="px-6 mx-auto max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center mb-6 space-x-2 transition-colors text-neutral-600 hover:text-primary-600 font-gilroyMedium"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Back to Books</span>
          </button>

          {/* Main Content */}
          <div className="overflow-hidden bg-white rounded-3xl border shadow-xl border-neutral-100">
            <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
              {/* Book Image */}
              <div className="relative">
                <div className="aspect-[3/4] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl overflow-hidden shadow-lg">
                  {book.bookImage ? (
                    <img
                      src={`http://backend:5000/uploads/${book.bookImage}`}
                      alt={book.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-full">
                      <HiBookOpen className="w-24 h-24 text-neutral-400" />
                    </div>
                  )}
                </div>

                {/* Action Buttons 
              <div className="flex absolute top-4 right-4 flex-col space-y-2">
                <button
                  onClick={handleWishlist}
                  className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
                    isWishlisted
                      ? 'text-red-600 bg-red-100 hover:bg-red-200'
                      : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-red-600'
                  }`}
                >
                  <HiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 bg-white/80 text-neutral-600 hover:bg-white hover:text-primary-600">
                  <HiShare className="w-5 h-5" />
                </button>
              </div>*/}
              </div>

              {/* Book Details */}
              <div className="space-y-6">
                {/* Title and Rating */}
                <div>
                  <h1 className="mb-2 text-3xl font-gilroyHeavy text-neutral-900">
                    {book.name}
                  </h1>
                  <div className="flex items-center mb-4 space-x-4">
                    {/*<div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-neutral-600">(4.5)</span>
                  </div>*/}
                  </div>
                </div>

                {/* Book Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center p-3 space-x-3 rounded-xl bg-neutral-50">
                    <HiUser className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-neutral-500 font-gilroyMedium">Author</p>
                      <p className="font-gilroyBold text-neutral-900">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 space-x-3 rounded-xl bg-neutral-50">
                    <HiGlobe className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-neutral-500 font-gilroyMedium">Language</p>
                      <p className="font-gilroyBold text-neutral-900">{book.language}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 space-x-3 rounded-xl bg-neutral-50">
                    <HiOfficeBuilding className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-neutral-500 font-gilroyMedium">Publisher</p>
                      <p className="font-gilroyBold text-neutral-900">{book.publisher}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 space-x-3 rounded-xl bg-neutral-50">
                    <HiTag className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-neutral-500 font-gilroyMedium">Category</p>
                      <p className="font-gilroyBold text-neutral-900">{book.category}</p>
                    </div>
                  </div>
                </div>

                {/* ISBN */}
                <div className="p-4 bg-gradient-to-r rounded-xl border from-primary-50 to-secondary-50 border-primary-100">
                  <div className="flex items-center space-x-3">
                    <HiBookOpen className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-primary-600 font-gilroyMedium">ISBN</p>
                      <p className="font-gilroyBold text-primary-800">{book.isbn}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <HiInformationCircle className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-gilroyBold text-neutral-900">Description</h3>
                  </div>
                  <p className="leading-relaxed text-neutral-700 font-gilroyRegular">
                    {book.description || 'No description available for this book.'}
                  </p>
                </div>

                {/* Price and Purchase */}
                <div className="pt-6 border-t border-neutral-100">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm text-neutral-500 font-gilroyMedium">Price</p>
                      <p className="text-3xl font-gilroyHeavy text-primary-600">
                        Rs. {book.price}
                        {/*<span className="ml-2 text-lg line-through text-neutral-400">
                        Rs. {(Number(book.price) * 1.2).toFixed(2)}
                      </span>*/}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-gilroyMedium text-neutral-600">Quantity:</span>
                      <div className="flex items-center rounded-lg border border-neutral-200">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          className="p-2 transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <HiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-gilroyBold text-neutral-900 min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="p-2 transition-colors hover:bg-neutral-50"
                        >
                          <HiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="p-4 mb-6 bg-gradient-to-r rounded-xl from-primary-50 to-secondary-50">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-gilroyBold text-neutral-900">Total Amount:</span>
                      <span className="text-2xl font-gilroyHeavy text-primary-600">Rs. {total}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding || quantity < 1}
                      className="flex justify-center items-center py-4 space-x-2 w-full text-lg text-white bg-gradient-to-r rounded-xl shadow-lg transition-all duration-300 from-primary-600 to-secondary-600 font-gilroyBold hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                    >
                      {adding ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
                          <span>Adding to Cart...</span>
                        </>
                      ) : (
                        <>
                          <HiShoppingCart className="w-5 h-5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Messages */}
                  {cartMessage && (
                    <div className="flex items-center p-4 mt-4 space-x-2 text-green-800 bg-green-50 rounded-xl border border-green-200">
                      <HiCheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-gilroyMedium">{cartMessage}</span>
                    </div>
                  )}

                  {cartError && (
                    <div className="flex items-center p-4 mt-4 space-x-2 text-red-800 bg-red-50 rounded-xl border border-red-200">
                      <HiExclamationCircle className="w-5 h-5 text-red-600" />
                      <span className="font-gilroyMedium">{cartError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookPage;