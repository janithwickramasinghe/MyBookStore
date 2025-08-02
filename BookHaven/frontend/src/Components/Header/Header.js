import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  HiHome,
  HiViewGrid,
  HiSparkles,
  HiShoppingCart,
  HiBell,
  HiUser,
  HiChevronDown,
  HiLockClosed,
  HiHeart,
  HiCog,
  HiLogout,
  HiMenu,
  HiX,
  HiBookOpen
} from 'react-icons/hi';

const Header = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.firstName || 'User');
        setUserId(decoded.id);
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileClick = () => {
    if (userId) {
      navigate(`/user-profile/${userId}`);
      setShowProfileMenu(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/home#hero', label: 'Home', icon: HiHome },
    { path: '/home#frequently-bought', label: 'Frequently Bought', icon: HiViewGrid },
    { path: '/home#new-arrivals', label: 'New Arrivals', icon: HiSparkles },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'border-b shadow-sm backdrop-blur-md bg-white/80 border-neutral-200/50'
        : 'bg-white/50'
      }`}>
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r rounded-xl shadow-lg transition-transform duration-300 transform from-primary-600 to-secondary-500 group-hover:scale-110">
                <HiBookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r rounded-xl opacity-25 blur transition duration-300 from-primary-600 to-secondary-500 group-hover:opacity-75"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r font-gilroyHeavy from-primary-700 to-secondary-600">
                BookHaven
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-gilroyBold text-sm transition-all duration-300 group ${isActiveLink(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActiveLink(item.path) && (
                    <div className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full transform -translate-x-1/2 bg-primary-600"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-4">
            {/* Shopping Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg transition-all duration-300 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 group">
              <HiShoppingCart className="w-6 h-6" />
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center p-2 pr-4 space-x-3 rounded-lg transition-all duration-300 text-neutral-700 hover:bg-neutral-50 group"
              >
                <div className="relative">
                  <div className="flex justify-center items-center w-8 h-8 bg-gradient-to-r rounded-lg from-primary-500 to-secondary-500">
                    <HiUser className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-gilroyBold text-neutral-900">{userName || 'Guest'}</p>
                </div>
                <HiChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 py-2 mt-2 w-64 rounded-xl border shadow-xl backdrop-blur-md bg-white/95 border-neutral-100 animate-fade-in">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="font-gilroyBold text-neutral-900">{userName || 'Guest'}</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center px-4 py-2 space-x-3 w-full text-left transition-colors text-neutral-700 hover:bg-neutral-50 font-gilroyRegular"
                    >
                      <HiUser className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>

                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 space-x-3 w-full text-left transition-colors text-neutral-700 hover:bg-neutral-50 font-gilroyRegular"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <HiLockClosed className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-neutral-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 space-x-3 w-full text-left text-red-600 transition-colors hover:bg-red-50 font-gilroyRegular"
                    >
                      <HiLogout className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg transition-colors md:hidden text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
            >
              {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="py-4 border-t md:hidden border-neutral-100/50 animate-fade-in">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-gilroyBold transition-colors ${isActiveLink(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                      }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;