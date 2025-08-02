import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HiArrowLeft,
  HiCreditCard,
  HiLocationMarker,
  HiShoppingCart,
  HiBookOpen,
  HiUser,
  HiHome,
  HiOfficeBuilding,
  HiGlobe,
  HiMail,
  HiPhone,
  HiCurrencyDollar,
  HiLockClosed,
  HiCheckCircle,
  HiExclamationCircle,
  HiSparkles,
  HiShieldCheck,
  HiTruck,
  HiCash,
  HiCollection
} from 'react-icons/hi';
import { FaPaypal, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import Header from '../../Components/Header/Header';

const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];

  const paymentMethods = [
    {
      value: 'credit_card',
      label: 'Credit Card',
      icon: FaCcVisa,
      description: 'Visa, Mastercard, and other major cards'
    },
    {
      value: 'debit_card',
      label: 'Debit Card',
      icon: FaCcMastercard,
      description: 'Direct payment from your bank account'
    },
    {
      value: 'paypal',
      label: 'PayPal',
      icon: FaPaypal,
      description: 'Pay securely with your PayPal account'
    },
    {
      value: 'cash',
      label: 'Cash on Delivery',
      icon: HiCash,
      description: 'Pay when your order arrives'
    }
  ];

  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      setError('No items selected for payment.');
      setLoading(false);
      return;
    }

    setCartItems(selectedItems);
    setLoading(false);
  }, [selectedItems]);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);
  const shippingCost = 0; // Free shipping
  const taxAmount = cartTotal * 0.1; // 10% tax
  const finalTotal = cartTotal + shippingCost + taxAmount;

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    setSuccess(null);

    if (!deliveryAddress.fullName || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.postalCode || !deliveryAddress.country) {
      setError('All address fields are required.');
      setProcessing(false);
      return;
    }

    if ((paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && cardNumber.length < 4) {
      setError('Please enter a valid card number.');
      setProcessing(false);
      return;
    }

    const selectedBookIds = cartItems.map(item => item.book._id);

    try {
      const res = await axios.post('/payments/process-cart', {
        selectedItems: selectedBookIds,
        deliveryAddress,
        paymentMethod,
        cardLastFour: (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') ? cardNumber.slice(-4) : ''
      });

      setSuccess('Payment successful! Order placed successfully.');
      setCartItems([]);
      setTimeout(() => navigate('/orders'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCardNumber(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full border-b-2 animate-spin border-primary-600"></div>
          <p className="text-lg font-gilroyMedium text-neutral-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="p-8 text-center bg-white rounded-2xl border border-red-100 shadow-lg">
            <HiExclamationCircle className="mx-auto mb-4 w-16 h-16 text-red-500" />
            <h2 className="mb-2 text-xl text-red-600 font-gilroyBold">Payment Error</h2>
            <p className="mb-4 text-neutral-600">{error}</p>
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center px-6 py-2 space-x-2 text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700 font-gilroyMedium"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="py-8 min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="px-6 mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center space-x-2 transition-colors text-neutral-600 hover:text-primary-600 font-gilroyMedium"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span>Back to Cart</span>
            </button>

            <div className="text-right">
              <h1 className="flex items-center space-x-3 text-3xl font-gilroyHeavy text-neutral-900">
                <HiCreditCard className="w-8 h-8 text-primary-600" />
                <span>Secure Checkout</span>
              </h1>
              <p className="text-neutral-600 font-gilroyMedium">Complete your purchase</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Payment Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Order Summary */}
              <div className="p-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
                <h2 className="flex items-center mb-6 space-x-2 text-xl font-gilroyBold text-neutral-900">
                  <HiShoppingCart className="w-6 h-6 text-primary-600" />
                  <span>Order Summary</span>
                </h2>

                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.book?._id || item.book} className="flex justify-between items-center p-4 rounded-xl bg-neutral-50">
                      <div className="flex items-center space-x-4">
                      {item.book?.bookImage ? (
                                <img
                                src={book.bookImage}
                                  alt={item.book.name}
                                  className="object-cover w-6 h-6"
                                />
                              ) : (
                                <div className="flex justify-center items-center w-full h-full">
                                  <HiBookOpen className="w-6 h-6 text-neutral-400" />
                                </div>
                              )}
                        <div>
                          <h3 className="font-gilroyBold text-neutral-900">{item.book?.name}</h3>
                          <p className="text-sm text-neutral-600 font-gilroyMedium">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-gilroyBold text-neutral-900">Rs. {((item.book?.price || 0) * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-neutral-500">Rs. {item.book?.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
                <h2 className="flex items-center mb-6 space-x-2 text-xl font-gilroyBold text-neutral-900">
                  <HiLocationMarker className="w-6 h-6 text-primary-600" />
                  <span>Delivery Address</span>
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">
                      Full Name *
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-1/2 w-5 h-5 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={deliveryAddress.fullName}
                        onChange={e => setDeliveryAddress({ ...deliveryAddress, fullName: e.target.value })}
                        className="py-3 pr-4 pl-10 w-full rounded-xl border transition-colors border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-gilroyMedium"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">
                      Street Address *
                    </label>
                    <div className="relative">
                      <HiHome className="absolute left-3 top-1/2 w-5 h-5 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={deliveryAddress.street}
                        onChange={e => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                        className="py-3 pr-4 pl-10 w-full rounded-xl border transition-colors border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-gilroyMedium"
                        placeholder="Enter street address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">
                      City *
                    </label>
                    <div className="relative">
                      <HiOfficeBuilding className="absolute left-3 top-1/2 w-5 h-5 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={deliveryAddress.city}
                        onChange={e => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                        className="py-3 pr-4 pl-10 w-full rounded-xl border transition-colors border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-gilroyMedium"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">
                      Postal Code *
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-3 top-1/2 w-5 h-5 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={deliveryAddress.postalCode}
                        onChange={e => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                        className="py-3 pr-4 pl-10 w-full rounded-xl border transition-colors border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-gilroyMedium"
                        placeholder="Enter postal code"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">
                      Country *
                    </label>
                    <div className="relative">
                      <HiGlobe className="absolute left-3 top-1/2 w-5 h-5 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={deliveryAddress.country}
                        onChange={e => setDeliveryAddress({ ...deliveryAddress, country: e.target.value })}
                        className="py-3 pr-4 pl-10 w-full rounded-xl border transition-colors border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-gilroyMedium"
                        placeholder="Enter country"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
                <h2 className="flex items-center mb-6 space-x-2 text-xl font-gilroyBold text-neutral-900">
                  <HiCreditCard className="w-6 h-6 text-primary-600" />
                  <span>Payment Method</span>
                </h2>

                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    const isSelected = paymentMethod === method.value;

                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setPaymentMethod(method.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                          }`}
                      >
                        <div className="flex items-center mb-2 space-x-3">
                          <IconComponent className={`w-6 h-6 ${isSelected ? 'text-primary-600' : 'text-neutral-600'}`} />
                          <span className={`font-gilroyBold ${isSelected ? 'text-primary-900' : 'text-neutral-900'}`}>
                            {method.label}
                          </span>
                        </div>
                        <p className={`text-sm ${isSelected ? 'text-primary-700' : 'text-neutral-600'} font-gilroyRegular`}>
                          {method.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Card Number Input */}
                {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                  <div>
                    <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">
                      Card Number *
                    </label>
                    <div className="relative">
                      <HiCreditCard className="absolute left-3 top-1/2 w-5 h-5 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={formatCardNumber(cardNumber)}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="py-3 pr-4 pl-10 w-full font-mono rounded-xl border transition-colors border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-gilroyMedium"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                      <HiLockClosed className="absolute right-3 top-1/2 w-5 h-5 text-green-500 transform -translate-y-1/2" />
                    </div>
                    <p className="mt-1 text-xs text-neutral-500 font-gilroyRegular">
                      Your card information is encrypted and secure
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 p-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
                <h2 className="flex items-center mb-6 space-x-2 text-xl font-gilroyBold text-neutral-900">
                  <HiCurrencyDollar className="w-6 h-6 text-primary-600" />
                  <span>Payment Summary</span>
                </h2>

                <div className="mb-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 font-gilroyMedium">Subtotal:</span>
                    <span className="font-gilroyBold text-neutral-900">Rs. {cartTotal.toFixed(2)}</span>
                  </div>

                  {/*<div className="flex justify-between items-center">
                  <span className="text-neutral-600 font-gilroyMedium">Tax (10%):</span>
                  <span className="font-gilroyBold text-neutral-900">Rs. {taxAmount.toFixed(2)}</span>
                </div>*/}

                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-gilroyBold text-neutral-900">Total:</span>
                      <span className="text-2xl font-gilroyHeavy text-primary-600">Rs. {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="flex justify-center items-center py-4 mb-4 space-x-2 w-full text-lg text-white bg-gradient-to-r rounded-xl shadow-lg transition-all duration-300 from-primary-600 to-secondary-600 font-gilroyBold hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <HiLockClosed className="w-5 h-5" />
                      <span>Pay Now</span>
                    </>
                  )}
                </button>

                <div className="flex justify-center items-center space-x-2 text-sm text-neutral-500">
                  <HiShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="font-gilroyRegular">256-bit SSL encrypted</span>
                </div>

                {/*<div className="p-3 mt-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 text-green-800">
                  <HiTruck className="w-4 h-4" />
                  <span className="text-sm font-gilroyMedium">Free shipping on all orders</span>
                </div>
              </div>*/}
              </div>
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="flex fixed right-6 bottom-6 items-center p-4 space-x-2 max-w-md text-green-800 bg-green-50 rounded-xl border border-green-200 shadow-lg animate-fade-in">
              <HiCheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
              <div>
                <span className="font-gilroyMedium">{success}</span>
                <p className="mt-1 text-xs text-green-600">Redirecting to orders...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex fixed right-6 bottom-6 items-center p-4 space-x-2 max-w-md text-red-800 bg-red-50 rounded-xl border border-red-200 shadow-lg animate-fade-in">
              <HiExclamationCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
              <span className="font-gilroyMedium">{error}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentPage;