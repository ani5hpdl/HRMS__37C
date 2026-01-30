import React, { useState } from 'react';
import { Calendar, Users, Bed, DollarSign, Mail, Menu, Bell, Settings, Search, ChevronDown, Plus, Eye, Package } from 'lucide-react';
import NavBar from '../components/NavBar';

const InventoryDashboard = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Bath Towels', category: 'Linen', availability: 'Available', inStock: 120, inReorder: 50, icon: '🛁', color: 'bg-green-200' },
    { id: 2, name: 'Shampoo Bottles', category: 'Toiletries', availability: 'Low', inStock: 20, inReorder: 100, icon: '🧴', color: 'bg-yellow-200' },
    { id: 3, name: 'Coffee Pods', category: 'Refreshments', availability: 'Out of Stock', inStock: 0, inReorder: 200, icon: '☕', color: 'bg-orange-200' },
    { id: 4, name: 'Room Key Cards', category: 'Electronics', availability: 'Available', inStock: 500, inReorder: 100, icon: '🔑', color: 'bg-blue-200' },
    { id: 5, name: 'Cleaning Supplies', category: 'Housekeeping', availability: 'Available', inStock: 300, inReorder: 50, icon: '🧹', color: 'bg-purple-200' },
    { id: 6, name: 'Mini Bar Snacks', category: 'Refreshments', availability: 'Low', inStock: 15, inReorder: 50, icon: '🍫', color: 'bg-pink-200' },
    { id: 7, name: 'Bed Sheets', category: 'Linen', availability: 'Available', inStock: 200, inReorder: 75, icon: '🛏️', color: 'bg-indigo-200' },
    { id: 8, name: 'Toilet Paper', category: 'Toiletries', availability: 'Low', inStock: 25, inReorder: 150, icon: '🧻', color: 'bg-teal-200' },
    { id: 9, name: 'Coffee Maker Filters', category: 'Refreshments', availability: 'Available', inStock: 80, inReorder: 40, icon: '☕', color: 'bg-amber-200' },
    { id: 10, name: 'Hand Soap', category: 'Toiletries', availability: 'Available', inStock: 150, inReorder: 60, icon: '🧼', color: 'bg-lime-200' }
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState('Newest');
  const [categoryFilter, setCategoryFilter] = useState('All Category');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewDetailItem, setViewDetailItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', category: 'Linen', inStock: 0, inReorder: 0 });

  const availabilityColors = {
    'Available': 'bg-green-100 text-green-800',
    'Low': 'bg-yellow-100 text-yellow-800',
    'Out of Stock': 'bg-red-100 text-red-800'
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleReorder = (itemId) => {
    const item = items.find(i => i.id === itemId);
    alert(`Reorder placed for ${item.name}. Quantity: ${item.inReorder}`);
  };

  const handleAddItem = () => {
    if (!newItem.name) {
      alert('Please enter item name');
      return;
    }
    const availability = newItem.inStock === 0 ? 'Out of Stock' : newItem.inStock < 30 ? 'Low' : 'Available';
    const icons = ['🎯', '📦', '🎁', '🔧', '🎨', '🧰', '📱', '💡'];
    const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];

    const item = {
      id: items.length + 1,
      name: newItem.name,
      category: newItem.category,
      availability: availability,
      inStock: Number(newItem.inStock),
      inReorder: Number(newItem.inReorder),
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setItems([...items, item]);
    setShowAddModal(false);
    setNewItem({ name: '', category: 'Linen', inStock: 0, inReorder: 0 });
    alert('Item added successfully!');
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Category' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'Newest') return b.id - a.id;
    if (sortBy === 'Oldest') return a.id - b.id;
    if (sortBy === 'Name A-Z') return a.name.localeCompare(b.name);
    if (sortBy === 'Name Z-A') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Search and Filters */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search item, category, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer focus:outline-none"
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="Name A-Z">Name A-Z</option>
                <option value="Name Z-A">Name Z-A</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer focus:outline-none flex items-center gap-2"
              >
                <option value="All Category">All Category</option>
                <option value="Linen">Linen</option>
                <option value="Toiletries">Toiletries</option>
                <option value="Refreshments">Refreshments</option>
                <option value="Electronics">Electronics</option>
                <option value="Housekeeping">Housekeeping</option>
              </select>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-lime-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-lime-500 flex items-center gap-2"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === sortedItems.length && sortedItems.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Item ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Category ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Availability ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Quantity in Stock ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Quantity in Reorder ↕
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Action ↕
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedItems.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-xl`}>
                          {item.icon}
                        </div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${availabilityColors[item.availability]} px-3 py-1 rounded-full text-xs font-medium`}>
                        {item.availability}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.inStock}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.inReorder}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewDetailItem(item)}
                          className="text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded text-sm font-medium"
                        >
                          View Detail
                        </button>
                        <button
                          onClick={() => handleReorder(item.id)}
                          className="bg-lime-400 text-gray-900 px-3 py-1 rounded text-sm font-medium hover:bg-lime-500"
                        >
                          Reorder
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Detail Modal */}
        {viewDetailItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">Item Details</h3>
                <button
                  onClick={() => setViewDetailItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 ${viewDetailItem.color} rounded-lg flex items-center justify-center text-3xl`}>
                    {viewDetailItem.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{viewDetailItem.name}</h4>
                    <p className="text-sm text-gray-600">{viewDetailItem.category}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className={`${availabilityColors[viewDetailItem.availability]} px-3 py-1 rounded-full text-xs font-medium`}>
                      {viewDetailItem.availability}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">In Stock:</span>
                    <span className="font-semibold">{viewDetailItem.inStock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reorder Quantity:</span>
                    <span className="font-semibold">{viewDetailItem.inReorder} units</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setViewDetailItem(null)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleReorder(viewDetailItem.id);
                      setViewDetailItem(null);
                    }}
                    className="flex-1 bg-lime-400 text-gray-900 px-4 py-2 rounded hover:bg-lime-500 font-medium"
                  >
                    Reorder Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">Add New Item</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
                    <option>Linen</option>
                    <option>Toiletries</option>
                    <option>Refreshments</option>
                    <option>Electronics</option>
                    <option>Housekeeping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Stock</label>
                  <input
                    type="number"
                    value={newItem.inStock}
                    onChange={(e) => setNewItem({ ...newItem, inStock: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Quantity</label>
                  <input
                    type="number"
                    value={newItem.inReorder}
                    onChange={(e) => setNewItem({ ...newItem, inReorder: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="flex-1 bg-lime-400 text-gray-900 px-4 py-2 rounded hover:bg-lime-500 font-medium"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 text-center text-sm text-gray-500 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p>Copyright © 2025 Lodgify</p>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-gray-600">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600">Terms and Conditions</a>
              <a href="#" className="hover:text-gray-600">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;