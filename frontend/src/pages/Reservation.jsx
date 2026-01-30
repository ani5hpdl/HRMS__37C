import React, { useState, useEffect } from 'react';
import { Eye, Phone, Mail, MapPin, Users, Bed, DollarSign, Edit, Trash2, CheckCircle, XCircle, Clock, UserCheck, LogOut, Search, Filter, Download, Plus, MoreVertical, RefreshCw } from 'lucide-react';
import NavBar from '../components/NavBar';
import toast from 'react-hot-toast';
import { getReservations, updateReservation, deleteReservation } from '../services/api';
import { ReservationCreationModal, RoomReservationsModal } from '../components/ReservationCreation';
import AdminNav from '../components/AdminNav';

const AdminReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoomReservationsModal, setShowRoomReservationsModal] = useState(false);
  const [selectedRoomForView, setSelectedRoomForView] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await getReservations();
      if (response.data?.success) {
        setReservations(response.data.data || []);
        toast.success('Reservations loaded successfully!');
      } else {
        toast.error('Failed to load reservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error(error.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getReservations();
      if (response.data?.success) {
        setReservations(response.data.data || []);
        toast.success('Reservations refreshed!');
      }
    } catch (error) {
      console.error('Error refreshing:', error);
      toast.error('Failed to refresh reservations');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Confirmed' },
      checked_in: { bg: 'bg-blue-100', text: 'text-blue-800', icon: UserCheck, label: 'Checked In' },
      checked_out: { bg: 'bg-gray-100', text: 'text-gray-800', icon: LogOut, label: 'Checked Out' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Cancelled' }
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      unpaid: { bg: 'bg-red-100', text: 'text-red-800', label: 'Unpaid' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      refunded: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Refunded' }
    };
    return configs[status] || configs.unpaid;
  };

  const handleUpdateStatus = async () => {
    if (!selectedReservation || !newStatus) return;

    try {
      const response = await updateReservation(selectedReservation.id, { status: newStatus });

      if (response.data?.success) {
        setReservations(reservations.map(r =>
          r.id === selectedReservation.id ? { ...r, status: newStatus } : r
        ));
        setSelectedReservation({ ...selectedReservation, status: newStatus });
        toast.success('Reservation status updated successfully!');
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setShowStatusDialog(false);
      setNewStatus('');
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedReservation || !newPaymentStatus) return;

    try {
      const response = await updateReservation(selectedReservation.id, { paymentStatus: newPaymentStatus });

      if (response.data?.success) {
        setReservations(reservations.map(r =>
          r.id === selectedReservation.id ? { ...r, paymentStatus: newPaymentStatus } : r
        ));
        setSelectedReservation({ ...selectedReservation, paymentStatus: newPaymentStatus });
        toast.success('Payment status updated successfully!');
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    } finally {
      setShowPaymentDialog(false);
      setNewPaymentStatus('');
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await deleteReservation(id);

      if (response.data?.success) {
        setReservations(reservations.filter(r => r.id !== id));
        if (selectedReservation?.id === id) {
          setSelectedReservation(null);
        }
        toast.success('Reservation deleted successfully!');
      } else {
        toast.error('Failed to delete reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error(error.response?.data?.message || 'Failed to delete reservation');
    }
  };

  const handleViewRoomReservations = (reservation) => {
    setSelectedRoomForView({
      id: reservation.Room?.id,
      number: reservation.Room?.id
    });
    setShowRoomReservationsModal(true);
  };

  const filteredReservations = reservations.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.Room?.roomNumber?.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    checkedIn: reservations.filter(r => r.status === 'checked_in').length,
    unpaid: reservations.filter(r => r.paymentStatus === 'unpaid').length
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reservations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">

              {/* Modal */}
        <ReservationCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => fetchReservations()}
        />

        <RoomReservationsModal
          isOpen={showRoomReservationsModal}
          onClose={() => {
            setShowRoomReservationsModal(false);
            setSelectedRoomForView(null);
          }}
          roomId={selectedRoomForView?.id}
          roomNumber={selectedRoomForView?.number}
        />
      <AdminNav
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`flex-1 transition-all duration-300 ${showCreateModal || showRoomReservationsModal ? 'backdrop-blur-lg' : ''}`}>

        {/* Status Update Dialog */}
        {showStatusDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Update Reservation Status</h3>
              <div className="space-y-3 mb-6">
                {['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(status => {
                  const config = getStatusConfig(status);
                  return (
                    <label key={status} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={newStatus === status}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className={`px-3 py-1 rounded text-sm ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusDialog(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Status Dialog */}
        {showPaymentDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Update Payment Status</h3>
              <div className="space-y-3 mb-6">
                {['unpaid', 'paid', 'refunded'].map(status => {
                  const config = getPaymentStatusConfig(status);
                  return (
                    <label key={status} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value={status}
                        checked={newPaymentStatus === status}
                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className={`px-3 py-1 rounded text-sm ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentDialog(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePayment}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 overflow-auto transition-all duration-300 ${showCreateModal || showRoomReservationsModal ? 'backdrop-blur-lg' : ''}`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Reservation Management</h1>
                <p className="text-sm text-gray-600">Manage all hotel reservations</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  <Download size={18} />
                  Export
                </button>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={18} />
                  New Reservation
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Reservations</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-700">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">Confirmed</p>
                <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">Checked In</p>
                <p className="text-2xl font-bold text-blue-700">{stats.checkedIn}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-700">Unpaid</p>
                <p className="text-2xl font-bold text-red-700">{stats.unpaid}</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex gap-6">
            {/* Reservations List */}
            <div className="flex-1 bg-white rounded-lg shadow">
              {/* Filters */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by guest name, email, or room..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="border border-gray-300 rounded px-4 py-2"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked In</option>
                  <option value="checked_out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm text-gray-600">
                      <th className="p-4 font-semibold">Guest</th>
                      <th className="p-4 font-semibold">Room</th>
                      <th className="p-4 font-semibold">Check In</th>
                      <th className="p-4 font-semibold">Check Out</th>
                      <th className="p-4 font-semibold">Nights</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Payment</th>
                      <th className="p-4 font-semibold">Total</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((reservation) => {
                      const statusConfig = getStatusConfig(reservation.status);
                      const paymentConfig = getPaymentStatusConfig(reservation.paymentStatus);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <tr
                          key={reservation.id}
                          className={`border-b hover:bg-gray-50 cursor-pointer ${selectedReservation?.id === reservation.id ? 'bg-blue-50' : ''}`}
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{reservation.guestName}</p>
                              <p className="text-sm text-gray-500">{reservation.guestEmail}</p>
                              <p className="text-sm text-black-500">{reservation.guestContact}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{reservation.Room?.roomNumber || 'N/A'}</p>
                              <p className="text-sm text-gray-500">{reservation.Room?.RoomType?.name || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{formatDate(reservation.checkInDate)}</td>
                          <td className="p-4 text-sm">{formatDate(reservation.checkOutDate)}</td>
                          <td className="p-4 text-sm">{reservation.nights}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${statusConfig.bg} ${statusConfig.text}`}>
                              <StatusIcon size={14} />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs ${paymentConfig.bg} ${paymentConfig.text}`}>
                              {paymentConfig.label}
                            </span>
                          </td>
                          <td className="p-4 font-semibold">${parseFloat(reservation.totalPrice).toFixed(2)}</td>
                          <td className="p-4">
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReservation(reservation);
                              }}
                            >
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredReservations.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No reservations found matching your criteria
                </div>
              )}
            </div>

            {/* Details Panel */}
            {selectedReservation && (
              <div className="w-96 bg-white rounded-lg shadow p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Reservation Details</h2>
                  <button
                    onClick={() => setSelectedReservation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Reservation ID</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{selectedReservation.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Guest Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={16} className="text-gray-400" />
                      <span className="font-medium">{selectedReservation.guestName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-gray-400" />
                      <span className="break-all">{selectedReservation.guestEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-gray-400" />
                      <span className="break-all">{selectedReservation.guestContact}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Room</p>
                    <p className="font-semibold">{selectedReservation.Room?.roomNumber || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{selectedReservation.Room?.RoomType?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Guests</p>
                    <p className="font-semibold">{selectedReservation.totalGuests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Check In</p>
                    <p className="font-semibold text-sm">{formatDate(selectedReservation.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Check Out</p>
                    <p className="font-semibold text-sm">{formatDate(selectedReservation.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nights</p>
                    <p className="font-semibold">{selectedReservation.nights}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created</p>
                    <p className="font-semibold text-xs">{formatDate(selectedReservation.createdAt)}</p>
                  </div>
                </div>

                {selectedReservation.specialRequest && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Special Request</p>
                    <p className="text-sm text-blue-800">{selectedReservation.specialRequest}</p>
                  </div>
                )}

                {selectedReservation.cancellationReason && (
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <p className="text-sm font-semibold text-red-900 mb-1">Cancellation Reason</p>
                    <p className="text-sm text-red-800">{selectedReservation.cancellationReason}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Room ({selectedReservation.nights} nights)</span>
                    <span className="font-medium">
                      ${selectedReservation.Room?.RoomType?.pricePerNight
                        ? (parseFloat(selectedReservation.Room.RoomType.pricePerNight) * selectedReservation.nights).toFixed(2)
                        : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Tax & Fees</span>
                    <span className="font-medium">
                      ${selectedReservation.Room?.RoomType?.pricePerNight
                        ? (parseFloat(selectedReservation.totalPrice) - parseFloat(selectedReservation.Room.RoomType.pricePerNight) * selectedReservation.nights).toFixed(2)
                        : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">${parseFloat(selectedReservation.totalPrice).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setNewStatus(selectedReservation.status);
                      setShowStatusDialog(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
                  >
                    <Edit size={16} />
                    Update Status
                  </button>
                  <button
                    onClick={() => {
                      setNewPaymentStatus(selectedReservation.paymentStatus);
                      setShowPaymentDialog(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50"
                  >
                    <DollarSign size={16} />
                    Update Payment
                  </button>
                  <button
                    onClick={() => handleViewRoomReservations(selectedReservation)}
                    className="w-full flex items-center justify-center gap-2 border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50"
                  >
                    <Eye size={16} />
                    View Room Reservations
                  </button>
                  <button
                    onClick={() => handleDeleteReservation(selectedReservation.id)}
                    className="w-full flex items-center justify-center gap-2 border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete Reservation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminReservationManagement;