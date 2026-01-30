import { useEffect, useRef, useState } from "react";
import {
  getMyReservations,
  updateMyReservation,
  cancelMyReservation,
  getReservationsByRoom,
} from "../services/api";

/* Toast Notification Component */
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  return (
    <div className={`fixed top-4 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${styles[type]} shadow-lg animate-slide-in`}>
      {icons[type]}
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* Helper: readable date */
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

/* Status badge styles - Enhanced */
function StatusBadge({ status }) {
  const map = {
    confirmed: { 
      text: "Confirmed", 
      classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    cancelled: { 
      text: "Cancelled", 
      classes: "bg-red-50 text-red-700 border border-red-200",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    pending: { 
      text: "Pending", 
      classes: "bg-amber-50 text-amber-700 border border-amber-200",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  };
  const meta = map[status] || { text: status, classes: "bg-gray-50 text-gray-700 border border-gray-200", icon: null };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${meta.classes}`}>
      {meta.icon}
      {meta.text}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse" aria-hidden="true">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 h-40 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="h-6 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex flex-col justify-between items-end gap-3">
          <div className="h-8 w-28 bg-gray-200 rounded-full" />
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-gray-200 rounded-lg" />
            <div className="h-9 w-20 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

const normalizeBooking = (b) => ({
  id: b.id,
  hostelName: b.Room?.RoomType?.name ?? "Room",
  checkIn: b.checkInDate,
  checkOut: b.checkOutDate,
  nights: b.nights,
  guests: b.totalGuests,
  status: b.status,
  paymentStatus: b.paymentStatus,
  totalPrice: b.totalPrice,
  guestName: b.guestName,
  guestEmail: b.guestEmail,
  guestContact: b.guestContact,
  roomType: b.Room?.RoomType?.name,
  bedType: b.Room?.RoomType?.bedType,
  roomSize: b.Room?.RoomType?.roomSize,
  viewType: b.Room?.RoomType?.viewType,
  amenities: b.Room?.RoomType?.amenities,
  specialRequest: b.specialRequest,
  createdAt: b.createdAt,
  roomId: b.roomId, // Add roomId for availability checking
});

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const modalFirstInputRef = useRef();
  const [viewing, setViewing] = useState(null);
  const [toast, setToast] = useState(null);
  const [dateConflict, setDateConflict] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (editing || viewing) {
      setTimeout(() => modalFirstInputRef.current?.focus(), 0);
      const onKey = (e) => {
        if (e.key === "Escape") {
          setEditing(null);
          setViewing(null);
          setDateConflict(false);
        }
      };
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
  }, [editing, viewing]);

  // Check availability when editing dates
  useEffect(() => {
    if (editing && editing.checkIn && editing.checkOut && editing.roomId) {
      const timer = setTimeout(() => {
        checkDateAvailability(editing.roomId, editing.checkIn, editing.checkOut, editing.id);
      }, 500); // Debounce API calls
      
      return () => clearTimeout(timer);
    }
  }, [editing?.checkIn, editing?.checkOut]);

  const fetchBookings = async () => {
    try {
      const res = await getMyReservations();
      const raw = Array.isArray(res?.data?.data) ? res.data.data : [];
      setBookings(raw.map(normalizeBooking));
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load reservations", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Check for date conflicts when editing
  const checkDateAvailability = async (roomId, checkIn, checkOut, currentReservationId) => {
    if (!checkIn || !checkOut || !roomId) return;
    
    setCheckingAvailability(true);
    setDateConflict(false);
    
    try {
      const response = await getReservationsByRoom(roomId);
      const roomReservations = response?.data?.data || [];
      
      const newCheckIn = new Date(checkIn);
      const newCheckOut = new Date(checkOut);
      
      // Check for conflicts with other reservations
      const conflict = roomReservations.some(reservation => {
        if (reservation.id === currentReservationId) return false; // Skip current reservation
        if (reservation.status === 'cancelled') return false; // Skip cancelled reservations
        
        const resCheckIn = new Date(reservation.checkInDate);
        const resCheckOut = new Date(reservation.checkOutDate);
        
        // Check if dates overlap
        return newCheckIn < resCheckOut && newCheckOut > resCheckIn;
      });
      
      setDateConflict(conflict);
      
      if (conflict) {
        setToast({ message: "Room is already reserved for these dates", type: "warning" });
      }
    } catch (err) {
      console.error("Error checking availability:", err);
    } finally {
      setCheckingAvailability(false);
    }
  };

const handleUpdate = async () => {
  if (!editing) return;

  const checkInDate = new Date(editing.checkIn);
  const checkOutDate = new Date(editing.checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(checkInDate) || isNaN(checkOutDate)) {
    setToast({ message: "Invalid dates provided", type: "error" });
    return;
  }

  if (checkInDate < today) {
    setToast({ message: "Check-in date cannot be in the past", type: "error" });
    return;
  }

  if (checkOutDate <= checkInDate) {
    setToast({ message: "Check-out must be after check-in", type: "error" });
    return;
  }

  const guests = Number(editing.guests);
  if (isNaN(guests) || guests < 1) {
    setToast({ message: "Number of guests must be at least 1", type: "error" });
    return;
  }

  if (dateConflict) {
    setToast({ message: "Cannot update: Room is already reserved for selected dates", type: "error" });
    return;
  }

  setIsUpdating(true);

  try {
    const updateData = {
      checkInDate: editing.checkIn,
      checkOutDate: editing.checkOut,
      totalGuests: guests,
    };

    if (editing.specialRequest !== undefined) {
      updateData.specialRequest = editing.specialRequest;
    }

    await updateMyReservation(editing.id, updateData);
    await fetchBookings();

    setToast({ message: "Reservation updated successfully!", type: "success" });
    setEditing(null);
    setDateConflict(false);
  } catch (err) {
    console.error(err);
    const errorMessage = err.response?.data?.message || "Unable to update reservation. Please try again.";
    setToast({ message: errorMessage, type: "error" });
  } finally {
    setIsUpdating(false);
  }
};


  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation? This action cannot be undone.")) return;

    setCancellingId(id);
    try {
      const response = await cancelMyReservation(id);
      
      // Refresh from server to get updated status
      await fetchBookings();
      
      setToast({ message: "Reservation cancelled successfully", type: "success" });
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Unable to cancel reservation. Please try again.";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reservations</h1>
          <p className="text-gray-600">Manage your upcoming and past bookings</p>
        </div>

        {!bookings.length ? (
          /* Empty State */
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">No reservations yet</h2>
              <p className="text-gray-600 mb-8">Start your adventure by booking your first stay with us!</p>
              <a
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Your Perfect Stay
              </a>
            </div>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                role="article"
                aria-label={`Reservation at ${booking.hostelName}`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full lg:w-56 h-48 lg:h-auto rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                      {booking.imageUrl ? (
                        <img 
                          src={booking.imageUrl} 
                          alt={booking.hostelName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{booking.hostelName}</h3>
                          <p className="text-sm text-gray-500 font-mono">ID: {booking.id}</p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Check-in</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(booking.checkIn)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Check-out</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(booking.checkOut)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Guests</p>
                            <p className="text-sm font-semibold text-gray-900">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                            <p className="text-sm font-semibold text-gray-900">{booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Show Update and Cancel buttons for confirmed and pending bookings */}
                        {(booking.status === "confirmed" || booking.status === "pending") && (
                          <>
                            <button
                              onClick={() => setEditing({ ...booking })}
                              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-amber-500 text-amber-600 rounded-xl text-sm font-semibold hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 transition-all duration-200"
                              aria-label={`Update reservation at ${booking.hostelName}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Update
                            </button>

                            <button
                              onClick={() => handleCancel(booking.id)}
                              disabled={cancellingId === booking.id}
                              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                cancellingId === booking.id 
                                  ? "border-red-300 text-red-400 cursor-not-allowed" 
                                  : "border-red-500 text-red-600 hover:bg-red-50 focus:ring-red-300"
                              }`}
                              aria-label={`Cancel reservation at ${booking.hostelName}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                            </button>
                          </>
                        )}

                        {/* View Details button - always visible */}
                        <button
                          onClick={() => setViewing(booking)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>

                        {/* Message for cancelled bookings */}
                        {booking.status === "cancelled" && (
                          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-2 border-gray-200 text-gray-500 rounded-xl text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Booking Cancelled
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* UPDATE MODAL */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isUpdating && setEditing(null)} />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-lg z-50 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Reservation</h2>
                  <p className="text-sm text-gray-600">Modify your booking details</p>
                </div>
                <button
                  onClick={() => !isUpdating && setEditing(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  aria-label="Close dialog"
                >
                  <svg className="w-6 h-6" viewBox="0 0 20 20" fill="none">
                    <path d="M6 6l8 8M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
                  <input
                    ref={modalFirstInputRef}
                    type="date"
                    value={editing.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditing({ ...editing, checkIn: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    value={editing.checkOut}
                    min={editing.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditing({ ...editing, checkOut: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                  />
                </div>

                {/* Availability Indicator */}
                {checkingAvailability && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking availability...
                  </div>
                )}
                
                {dateConflict && !checkingAvailability && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Room is already reserved for these dates
                  </div>
                )}

                {!dateConflict && !checkingAvailability && editing.checkIn && editing.checkOut && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Room is available for selected dates
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Guests</label>
                  <input
  type="number"
  min="1"
  value={editing.guests || ""}
  onChange={(e) => {
    const val = e.target.value;
    setEditing({
      ...editing,
      guests: val === "" ? undefined : Math.max(1, parseInt(val, 10)),
    });
  }}
  className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
/>

                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests (Optional)</label>
                  <textarea
                    value={editing.specialRequest || ""}
                    onChange={(e) => setEditing({ ...editing, specialRequest: e.target.value })}
                    placeholder="Any special requests or requirements..."
                    rows="3"
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Let us know if you have any special needs</p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => {
                    setEditing(null);
                    setDateConflict(false);
                  }}
                  disabled={isUpdating}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={
                    isUpdating ||
                    checkingAvailability ||
                    dateConflict ||
                    !editing.checkIn ||
                    !editing.checkOut ||
                    new Date(editing.checkOut) <= new Date(editing.checkIn) ||
                    Number(editing.guests) < 1
                  }
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
                    isUpdating || checkingAvailability ? "bg-amber-400" : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isUpdating ? "Saving..." : checkingAvailability ? "Checking..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW DETAILS MODAL */}
        {viewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewing(null)} />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-3xl z-50 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Details</h2>
                  <p className="text-sm text-gray-600">{viewing.hostelName}</p>
                </div>
                <button
                  onClick={() => setViewing(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  aria-label="Close dialog"
                >
                  <svg className="w-6 h-6" viewBox="0 0 20 20" fill="none">
                    <path d="M6 6l8 8M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Room Info */}
                <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Room Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Room Type</p>
                      <p className="font-semibold text-gray-900">{viewing.roomType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Bed Type</p>
                      <p className="font-semibold text-gray-900">{viewing.bedType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Room Size</p>
                      <p className="font-semibold text-gray-900">{viewing.roomSize} m²</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">View</p>
                      <p className="font-semibold text-gray-900">{viewing.viewType}</p>
                    </div>
                  </div>
                </section>

                {/* Stay Details */}
                <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Stay Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Check-in</p>
                      <p className="font-semibold text-gray-900">{formatDate(viewing.checkIn)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Check-out</p>
                      <p className="font-semibold text-gray-900">{formatDate(viewing.checkOut)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Duration</p>
                      <p className="font-semibold text-gray-900">{viewing.nights} {viewing.nights === 1 ? 'Night' : 'Nights'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Guests</p>
                      <p className="font-semibold text-gray-900">{viewing.guests} {viewing.guests === 1 ? 'Guest' : 'Guests'}</p>
                    </div>
                  </div>
                </section>

                {/* Payment */}
                <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                      <p className="font-semibold text-gray-900">{viewing.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">₹{viewing.totalPrice}</p>
                    </div>
                  </div>
                </section>

                {/* Guest Info */}
                <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Guest Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Name</p>
                      <p className="font-semibold text-gray-900">{viewing.guestName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{viewing.guestEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Contact</p>
                      <p className="font-semibold text-gray-900">{viewing.guestContact}</p>
                    </div>
                  </div>
                </section>

                {/* Amenities */}
                {viewing.amenities && Object.values(viewing.amenities).some(v => v === true) && (
                  <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(viewing.amenities)
                        .filter(([_, v]) => v === true)
                        .map(([k]) => (
                          <div key={k} className="flex items-center gap-2 text-sm text-gray-700">
                            <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {k.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {/* Special Request */}
                {viewing.specialRequest && (
                  <section className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Special Request
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{viewing.specialRequest}</p>
                  </section>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setViewing(null)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;

// Add this to your global CSS or Tailwind config
// @keyframes slide-in {
//   from {
//     transform: translateX(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// }
// .animate-slide-in {
//   animation: slide-in 0.3s ease-out;
// }