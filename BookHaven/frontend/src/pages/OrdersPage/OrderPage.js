import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  HiArrowLeft,
  HiClipboardList,
  HiFilter,
  HiCalendar,
  HiCurrencyDollar,
  HiLocationMarker,
  HiBookOpen,
  HiUser,
  HiX,
  HiCheckCircle,
  HiClock,
  HiTruck,
  HiExclamationCircle,
  HiBan,
  HiShoppingBag,
  HiEye,
  HiRefresh,
  HiChevronDown
} from 'react-icons/hi';
import Header from '../../Components/Header/Header';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const statusOptions = [
    { value: '', label: 'All Orders', icon: HiClipboardList, color: 'text-neutral-600' },
    { value: 'Pending', label: 'Pending', icon: HiClock, color: 'text-yellow-600' },
    { value: 'Confirmed', label: 'Confirmed', icon: HiCheckCircle, color: 'text-blue-600' },
    { value: 'Shipped', label: 'Shipped', icon: HiTruck, color: 'text-purple-600' },
    { value: 'Delivered', label: 'Delivered', icon: HiCheckCircle, color: 'text-green-600' },
    { value: 'Cancelled', label: 'Cancelled', icon: HiBan, color: 'text-red-600' }
  ];

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = statusFilter ? `/orders/status/${statusFilter}` : '/orders/all';
      const res = await axios.get(url);
      const data = res.data.data?.orders || res.data.data || [];
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const cancelOrder = async (orderId) => {
    setCancelling(orderId);
    try {
      await axios.delete(`/orders/${orderId}/cancel`);
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setCancelling(null);
    }
  };

  const formatAddress = (addr) =>
    `${addr.fullName}, ${addr.street}, ${addr.city}, ${addr.postalCode}, ${addr.country}`;

  const getStatusConfig = (status) => {
    const config = statusOptions.find(opt => opt.value === status) || statusOptions[0];
    return config;
  };

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    const colorClasses = {
      'text-yellow-600': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'text-blue-600': 'bg-blue-100 text-blue-800 border-blue-200',
      'text-purple-600': 'bg-purple-100 text-purple-800 border-purple-200',
      'text-green-600': 'bg-green-100 text-green-800 border-green-200',
      'text-red-600': 'bg-red-100 text-red-800 border-red-200',
      'text-neutral-600': 'bg-neutral-100 text-neutral-800 border-neutral-200'
    };

    const badgeClass = colorClasses[config.color] || colorClasses['text-neutral-600'];

    return (
      <span className={`inline-flex items-center px-3 py-1 space-x-1 text-sm rounded-full border font-gilroyBold ${badgeClass}`}>
        <IconComponent className="w-4 h-4" />
        <span>{status}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full border-b-2 animate-spin border-primary-600"></div>
          <p className="text-lg font-gilroyMedium text-neutral-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

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
                <span>Back</span>
              </button>
            </div>

            <div className="text-right">
              <h1 className="flex items-center space-x-3 text-3xl font-gilroyHeavy text-neutral-900">
                <HiClipboardList className="w-8 h-8 text-primary-600" />
                <span>Your Orders</span>
              </h1>
              <p className="text-neutral-600 font-gilroyMedium">{orders.length} orders found</p>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 mb-8 bg-white rounded-2xl border shadow-lg border-neutral-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <HiFilter className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-gilroyBold text-neutral-900">Filter Orders</h2>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 md:hidden text-primary-600 font-gilroyMedium"
              >
                <span>Filters</span>
                <HiChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              {statusOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = statusFilter === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(prev => prev === option.value ? '' : option.value)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-gilroyMedium transition-all duration-300 ${isActive
                        ? 'border-2 bg-primary-100 text-primary-700 border-primary-200'
                        : 'border-2 border-transparent bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t border-neutral-100">
              <p className="text-sm text-neutral-500 font-gilroyRegular">
                Showing {orders.length} {statusFilter ? `${statusFilter.toLowerCase()} ` : ''}orders
              </p>
              <button
                onClick={fetchOrders}
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

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl shadow-lg">
              <HiShoppingBag className="mx-auto mb-6 w-24 h-24 text-neutral-300" />
              <h2 className="mb-3 text-2xl font-gilroyBold text-neutral-600">
                {statusFilter ? `No ${statusFilter.toLowerCase()} orders found` : 'No orders yet'}
              </h2>
              <p className="mb-6 text-neutral-500 font-gilroyRegular">
                {statusFilter
                  ? `You don't have any ${statusFilter.toLowerCase()} orders at the moment.`
                  : "Looks like you haven't placed any orders yet. Start shopping to see your orders here!"
                }
              </p>
              <button
                onClick={() => navigate('/home')}
                className="inline-flex items-center px-8 py-3 space-x-2 text-white bg-gradient-to-r rounded-xl shadow-lg transition-all duration-300 from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 font-gilroyBold"
              >
                <HiShoppingBag className="w-5 h-5" />
                <span>Start Shopping</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="overflow-hidden bg-white rounded-2xl border shadow-lg border-neutral-100">
                  {/* Order Header */}
                  <div className="p-6 bg-gradient-to-r border-b from-primary-50 to-secondary-50 border-neutral-100">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-gilroyBold text-neutral-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <div className="flex items-center space-x-1">
                            <HiCalendar className="w-4 h-4" />
                            <span className="font-gilroyMedium">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HiCurrencyDollar className="w-4 h-4" />
                            <span className="font-gilroyBold text-primary-600">
                              Rs. {order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                          <button
                            onClick={() => cancelOrder(order._id)}
                            disabled={cancelling === order._id}
                            className="flex items-center px-4 py-2 space-x-2 text-red-700 bg-red-100 rounded-lg transition-colors hover:bg-red-200 font-gilroyMedium disabled:opacity-50"
                          >
                            {cancelling === order._id ? (
                              <>
                                <div className="w-4 h-4 rounded-full border-b-2 border-red-600 animate-spin"></div>
                                <span>Cancelling...</span>
                              </>
                            ) : (
                              <>
                                <HiX className="w-4 h-4" />
                                <span>Cancel Order</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    {/* Delivery Address */}
                    <div className="p-4 mb-6 rounded-xl bg-neutral-50">
                      <div className="flex items-start space-x-3">
                        <HiLocationMarker className="flex-shrink-0 mt-1 w-5 h-5 text-primary-600" />
                        <div>
                          <h4 className="mb-1 font-gilroyBold text-neutral-900">Delivery Address</h4>
                          <p className="text-neutral-600 font-gilroyRegular">
                            {formatAddress(order.deliveryAddress)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="flex items-center mb-4 space-x-2 font-gilroyBold text-neutral-900">
                        <HiBookOpen className="w-5 h-5 text-primary-600" />
                        <span>Items Ordered ({order.items.length})</span>
                      </h4>

                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-neutral-50">
                            <div className="flex items-center space-x-4">
                              <div className="flex justify-center items-center w-12 h-16 bg-gradient-to-br rounded-lg from-neutral-200 to-neutral-300">
                                <HiBookOpen className="w-6 h-6 text-neutral-500" />
                              </div>
                              <div>
                                <h5 className="font-gilroyBold text-neutral-900">
                                  {item.book?.name || 'Unknown Book'}
                                </h5>
                                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                                  <HiUser className="w-3 h-3" />
                                  <span className="font-gilroyMedium">
                                    {item.book?.author || 'Unknown Author'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-gilroyBold text-neutral-900">
                                Rs. {(item.book?.price || 0).toFixed(2)}
                              </div>
                              <div className="text-sm text-neutral-600 font-gilroyMedium">
                                Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;