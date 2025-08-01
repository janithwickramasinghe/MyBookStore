import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import {
  HiUser,
  HiMail,
  HiPhone,
  HiCalendar,
  HiLocationMarker,
  HiPencil,
  HiSave,
  HiX,
  HiTrash,
  HiExclamationCircle,
  HiCheckCircle,
  HiUserCircle,
  HiIdentification
} from 'react-icons/hi';

const UserProfile = () => {
  const { id } = useParams(); // get user id from URL
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !id) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setFormData(response.data.user);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    try {
      const decoded = jwtDecode(token);
      await axios.put(`/api/users/${decoded.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully');
      setEditMode(false);
      setUser({ ...user, ...formData });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!confirm) return;

    setDeleteLoading(true);
    try {
      const decoded = jwtDecode(token);
      await axios.delete(`/api/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Account deleted successfully');
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/'; // Redirect to home or login
      }, 2000);
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete account');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setFormData(user); // Reset form data to original user data
  };

  const profileFields = [
    { name: 'firstName', label: 'First Name', icon: HiUser, type: 'text' },
    { name: 'lastName', label: 'Last Name', icon: HiUser, type: 'text' },
    { name: 'phone', label: 'Phone Number', icon: HiPhone, type: 'tel' },
    { name: 'dob', label: 'Date of Birth', icon: HiCalendar, type: 'date' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full border-b-2 animate-spin border-primary-600"></div>
          <p className="text-lg font-gilroyMedium text-neutral-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="p-12 text-center bg-white rounded-2xl shadow-lg">
          <HiExclamationCircle className="mx-auto mb-6 w-24 h-24 text-neutral-300" />
          <h2 className="mb-3 text-2xl font-gilroyBold text-neutral-600">No User Data Found</h2>
          <p className="text-neutral-500 font-gilroyRegular">Unable to load user profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
      <div className="px-6 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="flex justify-center items-center space-x-3 text-3xl font-gilroyHeavy text-neutral-900">
            <HiUserCircle className="w-8 h-8 text-primary-600" />
            <span>User Profile</span>
          </h1>
          <p className="mt-2 text-neutral-600 font-gilroyMedium">
            {editMode ? 'Edit your profile information' : 'View and manage your account'}
          </p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className="flex items-center p-4 mb-6 space-x-3 bg-green-50 rounded-xl border border-green-200">
            <HiCheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
            <span className="text-green-800 font-gilroyMedium">{message}</span>
            <button
              onClick={() => setMessage('')}
              className="ml-auto text-green-600 hover:text-green-700"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center p-4 mb-6 space-x-3 bg-red-50 rounded-xl border border-red-200">
            <HiExclamationCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
            <span className="text-red-800 font-gilroyMedium">{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="overflow-hidden bg-white rounded-2xl border shadow-lg border-neutral-100">
          {/* Profile Header */}
          <div className="p-6 bg-gradient-to-r border-b from-primary-50 to-secondary-50 border-neutral-100">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-br rounded-full from-primary-200 to-primary-300">
                  <HiUser className="w-8 h-8 text-primary-700" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-gilroyBold text-neutral-900">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.name || 'User Profile'
                    }
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <HiMail className="w-4 h-4" />
                    <span className="font-gilroyMedium">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center px-4 py-2 space-x-2 text-white rounded-xl transition-all duration-200 bg-primary-600 font-gilroyMedium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <HiPencil className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={cancelEdit}
                      className="flex items-center px-4 py-2 space-x-2 rounded-xl transition-colors text-neutral-600 bg-neutral-100 font-gilroyMedium hover:bg-neutral-200"
                    >
                      <HiX className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={updateLoading}
                      className="flex items-center px-4 py-2 space-x-2 text-white rounded-xl transition-all duration-200 bg-primary-600 font-gilroyMedium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateLoading ? (
                        <div className="w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
                      ) : (
                        <HiSave className="w-4 h-4" />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Basic Information Fields */}
              {profileFields.map((field) => {
                const IconComponent = field.icon;
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                      <IconComponent className="w-4 h-4 text-primary-600" />
                      <span>{field.label}</span>
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={field.type === 'date' && formData[field.name] 
                        ? formData[field.name].substring(0, 10) 
                        : formData[field.name] || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 bg-white rounded-xl border font-gilroyRegular transition-colors ${
                        editMode 
                          ? 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500' 
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                      }`}
                    />
                  </div>
                );
              })}

              {/* Email Field (Always Disabled) */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                  <HiMail className="w-4 h-4 text-primary-600" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  disabled
                  className="px-4 py-3 w-full rounded-xl border bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-600"
                />
                <p className="text-xs text-neutral-500 font-gilroyRegular">Email cannot be changed</p>
              </div>

              {/* Address Field (Full Width) */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                  <HiLocationMarker className="w-4 h-4 text-primary-600" />
                  <span>Address</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white rounded-xl border font-gilroyRegular transition-colors resize-none ${
                    editMode 
                      ? 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500' 
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                  }`}
                  placeholder="Enter your full address..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="overflow-hidden mt-8 bg-white rounded-2xl border border-red-200 shadow-lg">
          <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
            <div className="flex items-center space-x-3">
              <HiExclamationCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg text-red-900 font-gilroyBold">Danger Zone</h3>
            </div>
            <p className="mt-1 text-sm text-red-700 font-gilroyRegular">
              Irreversible and destructive actions
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h4 className="font-gilroyBold text-neutral-900">Delete Account</h4>
                <p className="text-sm text-neutral-600 font-gilroyRegular">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center px-6 py-3 space-x-2 text-white bg-red-600 rounded-xl transition-all duration-200 font-gilroyBold hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <div className="w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
                ) : (
                  <HiTrash className="w-4 h-4" />
                )}
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="p-6 mt-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
          <div className="flex items-start space-x-3">
            <HiIdentification className="flex-shrink-0 mt-1 w-5 h-5 text-primary-600" />
            <div>
              <h3 className="font-gilroyBold text-neutral-900">Account Information</h3>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600 font-gilroyRegular">
                <li>• Your email address is used for login and cannot be modified</li>
                <li>• All other profile information can be updated as needed</li>
                <li>• Account deletion is permanent and cannot be undone</li>
                <li>• Contact support if you need assistance with your account</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;