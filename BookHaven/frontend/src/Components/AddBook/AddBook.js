import React, { useState } from 'react';
import axios from '../../api/axios';
import {
  HiBookOpen, HiCurrencyDollar, HiGlobeAlt, HiUser, HiOfficeBuilding,
  HiIdentification, HiTag, HiDocumentText, HiPhotograph, HiPlus,
  HiCheckCircle, HiExclamationCircle, HiX
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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'bookImage') {
      setForm({ ...form, bookImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Book name is required.';
        break;
      case 'price':
        if (!value || value <= 0) error = 'Enter a valid price.';
        break;
      case 'quantity':
        if (!value || value < 0) error = 'Quantity must be 0 or more.';
        break;
      case 'language':
        if (!value.trim()) error = 'Language is required.';
        break;
      case 'author':
        if (!value.trim()) error = 'Author name is required.';
        break;
      case 'publisher':
        if (!value.trim()) error = 'Publisher is required.';
        break;
      case 'isbn':
        if (!value.trim()) error = 'ISBN is required.';
        else if (!/^\d{10}$/.test(value)) error = 'ISBN must be 10 digits.';
        break;
      case 'isbn13':
        if (!value.trim()) error = 'ISBN-13 is required.';
        else if (!/^\d{13}$/.test(value)) error = 'ISBN-13 must be 13 digits.';
        break;
      case 'category':
        if (!value.trim()) error = 'Category is required.';
        break;
      case 'description':
        if (!value.trim()) error = 'Description is required.';
        break;
      case 'bookImage':
        if (!form.bookImage) error = 'Book cover image is required.';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, val]) => {
      validateField(key, val);
      if (errors[key]) newErrors[key] = errors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let imageUrl = '';

      if (form.bookImage) {
        const formData = new FormData();
        formData.append('bookImage', form.bookImage);

        const uploadRes = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadRes.data.url;
      }

      const bookData = { ...form, bookImage: imageUrl };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/books/add`, bookData);

      setMessage('Book added successfully!');
      setForm({
        name: '', price: '', quantity: '', language: '', author: '', publisher: '',
        isbn: '', isbn13: '', category: '', bookImage: null, description: ''
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      setMessage('Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'name', placeholder: 'Book Name', icon: HiBookOpen, type: 'text' },
    { name: 'price', placeholder: 'Price (Rs.)', icon: HiCurrencyDollar, type: 'number' },
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
        <div className="mb-8 text-center">
          <h1 className="flex justify-center items-center space-x-3 text-3xl font-gilroyHeavy text-neutral-900">
            <HiPlus className="w-8 h-8 text-primary-600" />
            <span>Add New Book</span>
          </h1>
          <p className="mt-2 text-neutral-600 font-gilroyMedium">Add a new book to your inventory</p>
        </div>

        {message && (
          <div className={`flex items-center p-4 mb-6 space-x-3 rounded-xl border ${
            message.includes('success') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {message.includes('success') ? (
              <HiCheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <HiExclamationCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-gilroyMedium ${
              message.includes('success') ? 'text-green-800' : 'text-red-800'}`}>
              {message}
            </span>
            <button onClick={() => setMessage('')} className={`ml-auto ${
              message.includes('success') ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}>
              <HiX className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="overflow-hidden bg-white rounded-2xl border shadow-lg border-neutral-100">
          <div className="p-6 bg-gradient-to-r border-b from-primary-50 to-secondary-50 border-neutral-100">
            <div className="flex items-center space-x-3">
              <HiBookOpen className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-gilroyBold text-neutral-900">Book Information</h2>
            </div>
            <p className="mt-1 text-sm text-neutral-600 font-gilroyRegular">
              Fill in all the required details for the new book
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {inputFields.map(({ name, placeholder, icon: IconComponent, type }) => (
                <div key={name} className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                    <IconComponent className="w-4 h-4 text-primary-600" />
                    <span>{placeholder}</span>
                  </label>
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`px-4 py-3 w-full bg-white rounded-xl border transition-colors font-gilroyRegular ${
                      errors[name] ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors[name] && (
                    <p className="text-sm text-red-600 font-gilroyMedium">{errors[name]}</p>
                  )}
                </div>
              ))}

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
                  onBlur={handleBlur}
                  required
                  rows={4}
                  className={`px-4 py-3 w-full bg-white rounded-xl border resize-none transition-colors font-gilroyRegular ${
                    errors.description ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 font-gilroyMedium">{errors.description}</p>
                )}
              </div>

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
                    onBlur={handleBlur}
                    className="px-4 py-3 w-full bg-white rounded-xl border transition-colors border-neutral-300 font-gilroyRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-gilroyMedium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {errors.bookImage && (
                    <p className="text-sm text-red-600 font-gilroyMedium">{errors.bookImage}</p>
                  )}
                </div>
                {form.bookImage && (
                  <p className="text-sm text-primary-600 font-gilroyMedium">
                    Selected: {form.bookImage.name}
                  </p>
                )}
              </div>
            </div>

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

        <div className="p-6 mt-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
          <div className="flex items-start space-x-3">
            <HiExclamationCircle className="mt-1 w-5 h-5 text-primary-600" />
            <div>
              <h3 className="font-gilroyBold text-neutral-900">Important Notes</h3>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600 font-gilroyRegular">
                <li>• Ensure all book details are accurate before submitting</li>
                <li>• Upload a high-quality cover image for better presentation</li>
                <li>• ISBN and ISBN-13 should be valid and unique</li>
                <li>• Price should be in Rupees</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
