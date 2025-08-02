import React, { useState } from 'react';
import AddBook from '../../Components/AddBook/AddBook';
import ViewBooks from '../../Components/ViewBooks/ViewBooks';
import AdminOrdersDashboard from '../AdminOrdersDashboard/AdminOrdersDashboard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // default view

  const renderComponent = () => {
    switch (activeTab) {
      case 'orders':
        return <AdminOrdersDashboard />;
      case 'addBook':
        return <AddBook />;
      case 'viewBooks':
        return <ViewBooks />;
      default:
        return <AdminOrdersDashboard />;
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mx-2 rounded ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${activeTab === 'addBook' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('addBook')}
        >
          Add Book
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${activeTab === 'viewBooks' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('viewBooks')}
        >
          View Books
        </button>
      </div>

      <div className="p-4 bg-white rounded border shadow">
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
