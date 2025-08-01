import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  HiArrowLeft,
  HiShoppingCart,
  HiTrash,
  HiCreditCard,
  HiCheckCircle,
  HiExclamationCircle,
  HiBookOpen,
  HiUser,
  HiCurrencyDollar,
  HiX,
  HiShoppingBag,
  HiSparkles,
  HiSelector,
  HiCheck
} from 'react-icons/hi';
import Header from '../../Components/Header/Header';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/cart/view');
        setCart(res.data.cart);
        setSelectedItems(res.data.cart.items.map(item => item.book?._id || item.book)); // Default: select all
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load cart.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleSelectionChange = (bookId) => {
    setSelectedItems(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map(item => item.book?._id || item.book));
    }
  };

  const handleRemoveSelectedItems = async () => {
    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.delete('/cart/remove-items', {
        data: {
          selectedItems: selectedItems
        }
      });

      setSelectedItems([]); // Clear selection
      setSuccess('Items removed from cart successfully!');
      setTimeout(() => {
        setSuccess(null);
        // Refresh cart data
        const fetchCart = async () => {
          try {
            const res = await axios.get('/cart/view');
            setCart(res.data.cart);
          } catch (err) {
            setError('Failed to refresh cart.');
          }
        };
        fetchCart();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove items.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full border-b-2 animate-spin border-primary-600"></div>
          <p className="text-lg font-gilroyMedium text-neutral-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="p-8 text-center bg-white rounded-2xl border border-red-100 shadow-lg">
          <HiExclamationCircle className="mx-auto mb-4 w-16 h-16 text-red-500" />
          <h2 className="mb-2 text-xl text-red-600 font-gilroyBold">Error Loading Cart</h2>
          <p className="mb-4 text-neutral-600">{error}</p>
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center px-6 py-2 space-x-2 text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700 font-gilroyMedium"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="p-12 text-center bg-white rounded-2xl shadow-lg">
            <HiShoppingCart className="mx-auto mb-6 w-24 h-24 text-neutral-300" />
            <h2 className="mb-3 text-2xl font-gilroyBold text-neutral-600">Your Cart is Empty</h2>
            <p className="mb-6 text-neutral-500">Looks like you haven't added any books to your cart yet.</p>
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center px-8 py-3 space-x-2 text-white bg-gradient-to-r rounded-xl shadow-lg transition-all duration-300 from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 font-gilroyBold"
            >
              <HiShoppingBag className="w-5 h-5" />
              <span>Start Shopping</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  const selectedCartItems = cart.items.filter(item => selectedItems.includes(item.book?._id || item.book));
  const cartTotal = selectedCartItems.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header />
      <div className="py-8 min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="px-6 mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center space-x-2 transition-colors text-neutral-600 hover:text-primary-600 font-gilroyMedium"
              >
                <HiArrowLeft className="w-5 h-5" />
                <span>Continue Shopping</span>
              </button>
            </div>

            <div className="text-right">
              <h1 className="flex items-center space-x-3 text-3xl font-gilroyHeavy text-neutral-900">
                <HiShoppingCart className="w-8 h-8 text-primary-600" />
                <span>Shopping Cart</span>
              </h1>
              <p className="text-neutral-600 font-gilroyMedium">{totalItems} items in your cart</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden bg-white rounded-2xl border shadow-lg border-neutral-100">
                {/* Select All Header */}
                <div className="p-6 border-b border-neutral-100">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center space-x-3 transition-colors text-primary-600 hover:text-primary-700 font-gilroyBold"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedItems.length === cart.items.length
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-neutral-300 hover:border-primary-600'
                        }`}>
                        {selectedItems.length === cart.items.length && (
                          <HiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span>
                        {selectedItems.length === cart.items.length ? 'Deselect All' : 'Select All'}
                      </span>
                    </button>

                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleRemoveSelectedItems}
                        disabled={processing}
                        className="flex items-center space-x-2 text-red-600 transition-colors hover:text-red-700 font-gilroyBold disabled:opacity-50"
                      >
                        {processing ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-b-2 border-red-600 animate-spin"></div>
                            <span>Removing...</span>
                          </>
                        ) : (
                          <>
                            <HiTrash className="w-4 h-4" />
                            <span>Remove Selected ({selectedItems.length})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-neutral-100">
                  {cart.items.map((item, index) => {
                    const bookId = item.book?._id || item.book;
                    const isSelected = selectedItems.includes(bookId);

                    return (
                      <div key={bookId} className={`p-6 transition-colors ${isSelected ? 'bg-primary-50/50' : 'hover:bg-neutral-50'}`}>
                        <div className="flex items-start space-x-4">
                          {/* Checkbox */}
                          <button
                            onClick={() => handleSelectionChange(bookId)}
                            className="mt-2"
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                              ? 'bg-primary-600 border-primary-600'
                              : 'border-neutral-300 hover:border-primary-600'
                              }`}>
                              {isSelected && <HiCheck className="w-3 h-3 text-white" />}
                            </div>
                          </button>

                          {/* Book Image */}
                          <div className="flex-shrink-0">
                            <div className="overflow-hidden w-20 h-28 bg-gradient-to-br rounded-lg shadow-md from-neutral-100 to-neutral-200">
                              {item.book?.bookImage ? (
                                <img
                                  src={`http://localhost:5000/uploads/${item.book.bookImage}`}
                                  alt={item.book.name}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="flex justify-center items-center w-full h-full">
                                  <HiBookOpen className="w-8 h-8 text-neutral-400" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Book Details */}
                          <div className="flex-1 min-w-0">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                              {/* Book Info */}
                              <div className="md:col-span-2">
                                <h3 className="mb-1 text-lg truncate font-gilroyBold text-neutral-900">
                                  {item.book?.name || 'Unknown Book'}
                                </h3>
                                <div className="flex items-center mb-2 space-x-2 text-neutral-600">
                                  <HiUser className="w-4 h-4" />
                                  <span className="text-sm font-gilroyMedium">{item.book?.author}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full font-gilroyBold">
                                    <HiSparkles className="inline mr-1 w-3 h-3" />
                                    In Stock
                                  </span>
                                </div>
                              </div>

                              {/* Price */}
                              <div className="text-center">
                                <p className="mb-1 text-sm text-neutral-500 font-gilroyMedium">Price</p>
                                <div className="flex justify-center items-center space-x-1">
                                  <span className="text-lg font-gilroyBold text-primary-600">
                                    Rs.
                                    {item.book?.price}
                                  </span>
                                </div>
                              </div>

                              {/* Quantity & Total */}
                              <div className="text-center">
                                <div className="mb-2">
                                  <p className="mb-1 text-sm text-neutral-500 font-gilroyMedium">Quantity</p>
                                  <span className="px-3 py-1 rounded-lg bg-neutral-100 font-gilroyBold text-neutral-900">
                                    {item.quantity}
                                  </span>
                                </div>
                                <div>
                                  <p className="mb-1 text-sm text-neutral-500 font-gilroyMedium">Total</p>
                                  <span className="text-lg font-gilroyBold text-neutral-900">
                                    Rs. {(item.book?.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 p-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
                <h2 className="flex items-center mb-6 space-x-2 text-xl font-gilroyBold text-neutral-900">
                  <HiCreditCard className="w-6 h-6 text-primary-600" />
                  <span>Order Summary</span>
                </h2>

                <div className="mb-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 font-gilroyMedium">Selected Items:</span>
                    <span className="font-gilroyBold text-neutral-900">{selectedItems.length}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 font-gilroyMedium">Subtotal:</span>
                    <span className="font-gilroyBold text-neutral-900">Rs. {cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-gilroyBold text-neutral-900">Total:</span>
                      <span className="text-2xl font-gilroyHeavy text-primary-600">Rs. {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/payment', { state: { selectedItems: selectedCartItems } })}
                    disabled={selectedItems.length === 0}
                    className="flex justify-center items-center py-4 space-x-2 w-full text-lg text-white bg-gradient-to-r rounded-xl shadow-lg transition-all duration-300 from-primary-600 to-secondary-600 font-gilroyBold hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                  >
                    <HiCreditCard className="w-5 h-5" />
                    <span>Proceed to Payment</span>
                  </button>

                  <p className="text-xs text-center text-neutral-500 font-gilroyRegular">
                    Secure checkout powered by SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="flex fixed right-6 bottom-6 items-center p-4 space-x-2 text-green-800 bg-green-50 rounded-xl border border-green-200 shadow-lg animate-fade-in">
              <HiCheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-gilroyMedium">{success}</span>
            </div>
          )}

          {error && (
            <div className="flex fixed right-6 bottom-6 items-center p-4 space-x-3 text-red-800 bg-red-50 rounded-xl border border-red-200 shadow-lg animate-fade-in">
              <HiExclamationCircle className="w-5 h-5 text-red-600" />
              <span className="font-gilroyMedium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-700"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;