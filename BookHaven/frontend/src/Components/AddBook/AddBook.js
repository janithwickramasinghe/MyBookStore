import React, { useState } from 'react';
import {
  HiBookOpen,
  HiCurrencyDollar,
  HiGlobeAlt,
  HiUser,
  HiOfficeBuilding,
  HiIdentification,
  HiTag,
  HiDocumentText,
  HiPhotograph,
  HiPlus,
  HiCheckCircle,
  HiExclamationCircle,
  HiX
} from 'react-icons/hi';

const AddBook = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: '',
    language: '',
    author: '',
    publisher: '',
    isbn: '',
    isbn13: '',
    category: '',
    bookImage: null,
    description: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'bookImage') {
      setForm({ ...form, bookImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    // Simulate API call for demo
    setTimeout(() => {
      setMessage('Book added successfully!');
      setForm({
        name: '', price: '', quantity: '', language: '', author: '', publisher: '', isbn: '', isbn13: '', category: '', bookImage: null, description: ''
      });
      setLoading(false);
    }, 2000);
  };

  const inputFields = [
    { name: 'name', placeholder: 'Book Name', icon: HiBookOpen, type: 'text' },
    { name: 'price', placeholder: 'Price (₹)', icon: HiCurrencyDollar, type: 'number' },
    { name: 'quantity', placeholder: 'Quantity in Stock', icon: HiTag, type: 'number' },
    { name: 'language', placeholder: 'Language', icon: HiGlobeAlt, type: 'text' },
    { name: 'author', placeholder: 'Author Name', icon: HiUser, type: 'text' },
    { name: 'publisher', placeholder: 'Publisher', icon: HiOfficeBuilding, type: 'text' },
    { name: 'isbn', placeholder: 'ISBN', icon: HiIdentification, type: 'text' },
    { name: 'isbn13', placeholder: 'ISBN-13', icon: HiIdentification, type: 'text' },
    { name: 'category', placeholder: 'Category/Genre', icon: HiTag, type: 'text' }
  ];

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
      <div className="px-6 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="flex justify-center items-center space-x-3 text-3xl font-gilroyHeavy text-neutral-900">
            <HiPlus className="w-8 h-8 text-primary-600" />
            <span>Add New Book</span>
          </h1>
          <p className="mt-2 text-neutral-600 font-gilroyMedium">
            Add a new book to your inventory
          </p>
        </div>

        {/* Error/Success Message */}
        {message && (
          <div className={`flex items-center p-4 mb-6 space-x-3 rounded-xl border ${
            message.includes('success') 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            {message.includes('success') ? (
              <HiCheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
            ) : (
              <HiExclamationCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
            )}
            <span className={`font-gilroyMedium ${
              message.includes('success') ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </span>
            <button
              onClick={() => setMessage('')}
              className={`ml-auto ${
                message.includes('success') ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'
              }`}
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Form Card */}
        <div className="overflow-hidden bg-white rounded-2xl border shadow-lg border-neutral-100">
          {/* Form Header */}
          <div className="p-6 bg-gradient-to-r border-b from-primary-50 to-secondary-50 border-neutral-100">
            <div className="flex items-center space-x-3">
              <HiBookOpen className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-gilroyBold text-neutral-900">Book Information</h2>
            </div>
            <p className="mt-1 text-sm text-neutral-600 font-gilroyRegular">
              Fill in all the required details for the new book
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {inputFields.map((field) => {
                const IconComponent = field.icon;
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                      <IconComponent className="w-4 h-4 text-primary-600" />
                      <span>{field.placeholder}</span>
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                );
              })}

              {/* Description - Full Width */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                  <HiDocumentText className="w-4 h-4 text-primary-600" />
                  <span>Description</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter book description..."
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="px-4 py-3 w-full bg-white rounded-xl border transition-colors resize-none border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Image Upload - Full Width */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                  <HiPhotograph className="w-4 h-4 text-primary-600" />
                  <span>Book Cover Image</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="bookImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-gilroyMedium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
                {form.bookImage && (
                  <p className="text-sm text-primary-600 font-gilroyMedium">
                    Selected: {form.bookImage.name}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 mt-6 border-t border-neutral-100">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-8 py-3 space-x-2 text-white rounded-xl transition-all duration-200 bg-primary-600 font-gilroyBold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
                    <span>Adding Book...</span>
                  </>
                ) : (
                  <>
                    <HiPlus className="w-5 h-5" />
                    <span>Add Book</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="p-6 mt-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
          <div className="flex items-start space-x-3">
            <HiExclamationCircle className="flex-shrink-0 mt-1 w-5 h-5 text-primary-600" />
            <div>
              <h3 className="font-gilroyBold text-neutral-900">Important Notes</h3>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600 font-gilroyRegular">
                <li>• Ensure all book details are accurate before submitting</li>
                <li>• Upload a high-quality cover image for better presentation</li>
                <li>• ISBN and ISBN-13 should be valid and unique</li>
                <li>• Price should be in Rupees </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;