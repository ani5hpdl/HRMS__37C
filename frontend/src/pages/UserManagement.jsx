import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, UserPlus, Filter, MoreVertical, Eye, Ban, CheckCircle, Mail, Phone, Calendar, Shield } from "lucide-react";
import NavBar from "../components/NavBar";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../services/api";

/* ================= API BASE URL ================= */
const API_BASE_URL = "http://localhost:5000/api"; // Adjust to your backend URL

/* ================= COMPONENT ================= */
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "user",
    isActive: true,
    isEmailVerified: false,
  });

  /* ---------- Fetch All Users ---------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();

      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        console.error("Error fetching users:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------- Filter Users ---------- */
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    const matchesStatus = filterStatus === "All" ||
      (filterStatus === "Active" && user.isActive) ||
      (filterStatus === "Inactive" && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  /* ---------- Add User ---------- */
  const handleAddUser = async () => {
    try {
      const response = await createUser(formData);

      if (response.data.success) {
        alert(response.data.message);
        fetchUsers();
        setShowAddModal(false);
        resetForm();
      } else {
        alert(response.data.message || "Error creating user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating user");
    }
  };

  /* ---------- Edit User ---------- */
  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await updateUser(selectedUser.id, editFormData);

      if (response.data.success) {
        alert(response.data.message);
        fetchUsers();
        setShowEditModal(false);
        setSelectedUser(null);
      } else {
        alert(response.data.message || "Error updating user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating user");
    }
  };

  /* ---------- Delete User (Soft Delete) ---------- */
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    try {
      const response = await deleteUser(userId);

      if (response.data.success) {
        alert(response.data.message);
        fetchUsers();
      } else {
        alert(response.data.message || "Error deleting user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting user");
    }
  };

  /* ---------- View User Details ---------- */
  const handleViewUser = async (userId) => {
    try {
      console.log("Fetching details for user ID:", userId);
      const response = await getUserById(userId);
      if (response.data.success) {
        setSelectedUser(response.data.data);
        setShowViewModal(true);
      } else {
        alert(response.data.message || "Error fetching user details");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error fetching user details");
    }
  };

  /* ---------- Open Edit Modal ---------- */
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
    });
    setShowEditModal(true);
  };

  /* ---------- Reset Form ---------- */
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  /* ---------- Stats ---------- */
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    verified: users.filter(u => u.isEmailVerified).length,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">

        {/* Filters */}
        <div className="px-8 py-4 bg-white border-b">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
            >
              <option value="All">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No users found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                            <span className="text-lime-700 font-semibold text-sm">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium text-gray-800">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isEmailVerified ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Ban className="w-5 h-5 text-gray-300" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewUser(user.id)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Deactivate User"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-lime-400 hover:bg-lime-500 rounded-lg font-medium"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editFormData.isEmailVerified}
                  onChange={(e) => setEditFormData({ ...editFormData, isEmailVerified: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">Email Verified</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="flex-1 px-4 py-2 bg-lime-400 hover:bg-lime-500 rounded-lg font-medium"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-500">Name</div>
                  <div className="font-medium">{selectedUser.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-medium">{selectedUser.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-500">Role</div>
                  <div className="font-medium capitalize">{selectedUser.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <CheckCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-medium">{selectedUser.isActive ? 'Active' : 'Inactive'}</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setShowViewModal(false); setSelectedUser(null); }}
              className="w-full mt-6 px-4 py-2 bg-lime-400 hover:bg-lime-500 rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;