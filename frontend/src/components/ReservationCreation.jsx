// Updated AdminReservationManagement.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Users,Phone,DollarSign,User, Edit, Trash2, CheckCircle, XCircle, Clock, UserCheck, LogOut, Search, Download, Plus, MoreVertical, RefreshCw, FileText, X, AlertCircle, Eye, Bed, Mail } from 'lucide-react';
import NavBar from '../components/NavBar';
import toast from 'react-hot-toast';
import { getReservations, updateReservation, deleteReservation, createReservation, getAvailableRooms, getReservationsByRoom } from '../services/api';

// Component 1: Reservation Creation Modal
const ReservationCreationModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        totalGuests: 1,
        specialRequest: ''
    });

    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [calculatedNights, setCalculatedNights] = useState(0);
    const [estimatedPrice, setEstimatedPrice] = useState(0);

    useEffect(() => {
        if (isOpen && formData.checkInDate && formData.checkOutDate) {
            fetchAvailableRooms();
        }
    }, [isOpen, formData.checkInDate, formData.checkOutDate]);

    useEffect(() => {
        calculateNightsAndPrice();
    }, [formData.checkInDate, formData.checkOutDate, formData.roomId, availableRooms]);

    const fetchAvailableRooms = async () => {
        try {
            const response = await getAvailableRooms({
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate
            });
            if (response.data?.success) {
                setAvailableRooms(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const calculateNightsAndPrice = () => {
        if (formData.checkInDate && formData.checkOutDate && formData.roomId) {
            const checkIn = new Date(formData.checkInDate);
            const checkOut = new Date(formData.checkOutDate);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

            if (nights > 0) {
                setCalculatedNights(nights);
                const selectedRoom = availableRooms.find(r => r.id === formData.roomId);
                if (selectedRoom?.RoomType?.pricePerNight) {
                    setEstimatedPrice(parseFloat(selectedRoom.RoomType.pricePerNight) * nights);
                }
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.guestContact) newErrors.guestContact = 'Guest contact is required';
        else if (!/^(97|98)\d{8}$|^01\d{7}$/.test(formData.guestContact)) newErrors.guestContact = 'Invalid contact number format (Expected format: 9812345678 or 01-1234567)';        if (!formData.roomId) newErrors.roomId = 'Please select a room';
        if (!formData.checkInDate) newErrors.checkInDate = 'Check-in date is required';
        if (!formData.checkOutDate) newErrors.checkOutDate = 'Check-out date is required';
        if (!formData.totalGuests || formData.totalGuests < 1) newErrors.totalGuests = 'At least 1 guest required';

        if (formData.checkInDate && formData.checkOutDate) {
            const checkIn = new Date(formData.checkInDate);
            const checkOut = new Date(formData.checkOutDate);
            if (checkOut <= checkIn) newErrors.checkOutDate = 'Check-out must be after check-in';

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (checkIn < today) newErrors.checkInDate = 'Check-in cannot be in the past';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        // Check if form is valid before proceeding
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        // Gather form data including guest information and contact number
        const reservationData = {
            guestName: formData.guestName,        // guest's name
            guestEmail: formData.guestEmail,      // guest's email
            guestContact: formData.guestContact,  // guest's contact number
            roomId: formData.roomId,
            specialRequest: formData.specialRequest,
            checkInDate: formData.checkInDate,
            checkOutDate: formData.checkOutDate,
            totalGuests: formData.totalGuests
        };

        setLoading(true);
        try {
            const response = await createReservation(reservationData);
            if (response.data.success) {
                toast.success('Reservation created successfully!');
                onSuccess?.(response.data.data);
                handleClose();
            } else {
                toast.error(response.data.message || 'Failed to create reservation');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            toast.error(error.response?.data?.message || 'Failed to create reservation');
        } finally {
            setLoading(false);
        }
    };


    const handleClose = () => {
        setFormData({ roomId: '', checkInDate: '', checkOutDate: '', totalGuests: 1, specialRequest: '' });
        setErrors({});
        setCalculatedNights(0);
        setEstimatedPrice(0);
        onClose();
    };

    if (!isOpen) return null;

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">Create New Reservation</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name *</label>
                            <input
                                type="text"
                                value={formData.guestName}
                                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg ${errors.guestName ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.guestName && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} />{errors.guestName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Email *</label>
                            <input
                                type="email"
                                value={formData.guestEmail}
                                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg ${errors.guestEmail ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.guestEmail && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} />{errors.guestEmail}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar size={16} className="inline mr-1" />Check-In Date *
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={formData.checkInDate}
                                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg ${errors.checkInDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.checkInDate && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} />{errors.checkInDate}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar size={16} className="inline mr-1" />Check-Out Date *
                            </label>
                            <input
                                type="date"
                                min={formData.checkInDate || today}
                                value={formData.checkOutDate}
                                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg ${errors.checkOutDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.checkOutDate && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} />{errors.checkOutDate}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Contact *</label>
                            <input
                                type="tel"  // Using 'tel' for contact numbers
                                pattern="^(97|98)\d{8}$|^01\d{7}$"  // Nepali phone number pattern (mobile & landline)
                                value={formData.guestContact}
                                onChange={(e) => setFormData({ ...formData, guestContact: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg ${errors.guestContact ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g. 9812345678 or 01-1234567"
                            />
                            {errors.guestContact && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />{errors.guestContact}
                                </p>
                            )}
                            </div>


                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Room *</label>
                        <select
                            value={formData.roomId}
                            onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg ${errors.roomId ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={!formData.checkInDate || !formData.checkOutDate}
                        >
                            <option value="">
                                {!formData.checkInDate || !formData.checkOutDate ? 'Select dates first' : availableRooms.length === 0 ? 'No rooms available' : 'Choose a room'}
                            </option>
                            {availableRooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Room {room.roomNumber} - {room.RoomType?.name} (${room.RoomType?.pricePerNight}/night)
                                </option>
                            ))}
                        </select>
                        {errors.roomId && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />{errors.roomId}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Users size={16} className="inline mr-1" />Number of Guests *
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.totalGuests}
                            onChange={(e) => setFormData({ ...formData, totalGuests: parseInt(e.target.value) || 1 })}
                            className={`w-full px-4 py-2 border rounded-lg ${errors.totalGuests ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText size={16} className="inline mr-1" />Special Requests (Optional)
                        </label>
                        <textarea
                            rows="3"
                            value={formData.specialRequest}
                            onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                            placeholder="Any special requirements..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {calculatedNights > 0 && estimatedPrice > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">Reservation Summary</h3>
                            <div className="space-y-1 text-sm text-blue-800">
                                <div className="flex justify-between">
                                    <span>Duration:</span>
                                    <span className="font-medium">{calculatedNights} night{calculatedNights > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-blue-200">
                                    <span className="font-semibold">Estimated Total:</span>
                                    <span className="font-bold text-lg">${estimatedPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button onClick={handleClose} className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Creating...' : 'Create Reservation'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component 2: Room Reservations View Modal
const RoomReservationsModal = ({ isOpen, onClose, roomId, roomNumber }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && roomId) {
            fetchRoomReservations();
        }
    }, [isOpen, roomId]);

    const fetchRoomReservations = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const baseURL = import.meta.env.VITE_API_BASE_URL;

            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(`${baseURL}/api/reservations/admin/reservations/room/${roomId}`, { headers });
            const data = await response.json();

            if (data.success) {
                setReservations(data.data || []);
            } else {
                setError('Failed to load room reservations');
            }
        } catch (err) {
            console.error('Error fetching room reservations:', err);
            setError('Failed to load reservations');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const configs = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
            checked_in: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Checked In' },
            checked_out: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Checked Out' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
        };
        const config = configs[status] || configs.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const getPaymentBadge = (status) => {
        const configs = {
            paid: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Paid' },
            unpaid: { bg: 'bg-red-100', text: 'text-red-800', label: 'Unpaid' },
            refunded: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Refunded' }
        };
        const config = configs[status] || configs.unpaid;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-lime-400 to-emerald-500 p-6">
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Bed size={28} />
                                Room {roomNumber} - Reservations
                            </h2>
                            <p className="text-sm text-white/90 mt-1">
                                All reservations for this room
                            </p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-lime-400 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading reservations...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X size={32} className="text-red-600" />
                            </div>
                            <p className="text-red-600 font-medium mb-4">{error}</p>
                            <button 
                                onClick={fetchRoomReservations}
                                className="px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : reservations.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <Bed size={64} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No reservations found</p>
                            <p className="text-sm">This room has no reservation history</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reservations.map((reservation) => (
                                <div 
                                    key={reservation.id} 
                                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
                                >
                                    {/* Guest Info Header */}
                                    <div className="flex items-start justify-between mb-4 pb-4 border-b">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {reservation.guestName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-xl text-gray-800">
                                                        {reservation.guestName}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Mail size={14} />
                                                            {reservation.guestEmail}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Phone size={14} />
                                                            {reservation.guestContact}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {getStatusBadge(reservation.status)}
                                            {getPaymentBadge(reservation.paymentStatus)}
                                        </div>
                                    </div>

                                    {/* Room Details */}
                                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                        <p className="font-semibold text-blue-900 mb-2">
                                            {reservation.Room?.RoomType?.name || 'Room Type N/A'}
                                        </p>
                                        <p className="text-sm text-blue-800">
                                            {reservation.Room?.RoomType?.description || 'No description'}
                                        </p>
                                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                                            <div>
                                                <p className="text-blue-600">Bed Type</p>
                                                <p className="font-medium text-blue-900">
                                                    {reservation.Room?.RoomType?.bedType || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-blue-600">Room Size</p>
                                                <p className="font-medium text-blue-900">
                                                    {reservation.Room?.RoomType?.roomSize || 'N/A'} m²
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-blue-600">View</p>
                                                <p className="font-medium text-blue-900 capitalize">
                                                    {reservation.Room?.RoomType?.viewType || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reservation Details */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                                <Calendar size={14} />
                                                Check In
                                            </div>
                                            <p className="font-semibold text-gray-800">
                                                {formatDate(reservation.checkInDate)}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                                <Calendar size={14} />
                                                Check Out
                                            </div>
                                            <p className="font-semibold text-gray-800">
                                                {formatDate(reservation.checkOutDate)}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                                <Bed size={14} />
                                                Nights
                                            </div>
                                            <p className="font-semibold text-gray-800">
                                                {reservation.nights}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                                <Users size={14} />
                                                Guests
                                            </div>
                                            <p className="font-semibold text-gray-800">
                                                {reservation.totalGuests}
                                            </p>
                                        </div>
                                        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                            <div className="flex items-center gap-2 text-emerald-600 text-xs mb-1">
                                                <DollarSign size={14} />
                                                Total Price
                                            </div>
                                            <p className="font-bold text-emerald-700 text-lg">
                                                NPR {parseFloat(reservation.totalPrice).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Added By Info */}
                                    <div className="bg-purple-50 rounded-lg p-3 mb-4">
                                        <div className="flex items-center gap-2 text-xs text-purple-600 mb-1">
                                            <User size={14} />
                                            Added By
                                        </div>
                                        <p className="font-medium text-purple-900">
                                            {reservation.addedBy} ({reservation.addedWith})
                                        </p>
                                    </div>

                                    {/* Special Request */}
                                    {reservation.specialRequest && reservation.specialRequest !== 'Nothing' && (
                                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                            <div className="flex items-start gap-2">
                                                <MessageSquare size={18} className="text-yellow-600 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-yellow-900 text-sm mb-1">
                                                        Special Request
                                                    </p>
                                                    <p className="text-yellow-800 text-sm">
                                                        {reservation.specialRequest}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Amenities */}
                                    {reservation.Room?.RoomType?.amenities && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="font-semibold text-sm text-gray-700 mb-2">Room Amenities</p>
                                            <div className="flex flex-wrap gap-2">
                                                {reservation.Room.RoomType.amenities.wifi && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">WiFi</span>
                                                )}
                                                {reservation.Room.RoomType.amenities.airConditioning && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">AC</span>
                                                )}
                                                {reservation.Room.RoomType.amenities.flatScreenTV && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">TV</span>
                                                )}
                                                {reservation.Room.RoomType.amenities.miniFridge && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Mini Fridge</span>
                                                )}
                                                {reservation.Room.RoomType.amenities.coffeeTeaMaker && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Coffee/Tea Maker</span>
                                                )}
                                                {reservation.Room.RoomType.amenities.ensuiteBathroom && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Ensuite Bathroom</span>
                                                )}
                                                {reservation.Room.RoomType.amenities.bathtub && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Bathtub</span>
                                                )}
                                                {reservation.Room.RoomType.amenities.hasBalcony && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Balcony</span>
                                                )}
                                                {reservation.Room.RoomType.amenities.hasWorkDesk && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Work Desk</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Timestamps */}
                                    <div className="mt-4 pt-4 border-t text-xs text-gray-500 flex justify-between">
                                        <span>Created: {formatDate(reservation.createdAt)}</span>
                                        <span>Updated: {formatDate(reservation.updatedAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomReservationsModal;

// Main Component: AdminReservationManagement  
// Add the following to your existing AdminReservationManagement component:
// 1. Import the two modals above
// 2. Add these state variables:
//    const [showCreateModal, setShowCreateModal] = useState(false);
//    const [showRoomReservationsModal, setShowRoomReservationsModal] = useState(false);
//    const [selectedRoomForView, setSelectedRoomForView] = useState(null);
//
// 3. Update the "New Reservation" button onClick to:
//    onClick={() => setShowCreateModal(true)}
//
// 4. Add a "View Room Reservations" button in the details panel:
//    <button
//      onClick={() => handleViewRoomReservations(selectedReservation)}
//      className="w-full flex items-center justify-center gap-2 border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50"
//    >
//      <Eye size={16} />
//      View Room Reservations
//    </button>
//
// 5. Add this handler function:
//    const handleViewRoomReservations = (reservation) => {
//      setSelectedRoomForView({
//        id: reservation.Room?.id,
//        number: reservation.Room?.roomNumber
//      });
//      setShowRoomReservationsModal(true);
//    };
//
// 6. Add the modals before the closing div:
//    <ReservationCreationModal
//      isOpen={showCreateModal}
//      onClose={() => setShowCreateModal(false)}
//      onSuccess={() => fetchReservations()}
//    />
//
//    <RoomReservationsModal
//      isOpen={showRoomReservationsModal}
//      onClose={() => {
//        setShowRoomReservationsModal(false);
//        setSelectedRoomForView(null);
//      }}
//      roomId={selectedRoomForView?.id}
//      roomNumber={selectedRoomForView?.number}
//    />

export { ReservationCreationModal, RoomReservationsModal };
// export default AdminReservationManagement;