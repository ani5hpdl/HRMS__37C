import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Calendar as CalendarIcon, Users } from 'lucide-react';

// REPLACE THESE WITH YOUR ACTUAL API IMPORTS
import { createReservation, getRooms, getRoomTypes } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RoomSelector = () => {
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const datePickerRef = useRef(null);
  const [detailsCompleted, setDetailsCompleted] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [filters, setFilters] = useState({
    roomType: 'All',
    viewType: 'All',
    priceRange: 'All'
  });

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [views, setViews] = useState([]);

  const navigate = useNavigate();

  // Helper function to extract features from room amenities
  // const getFeaturesList = (roomType) => {
  //   const features = [];
  //   const amenity = roomType.RoomAmenity;

  //   if (amenity) {
  //     if (amenity.wifi) features.push('High-speed Wi-Fi included');
  //     if (amenity.airConditioning) features.push('Climate-controlled air conditioning');
  //     if (amenity.flatScreenTV) features.push('Flat-screen TV with premium channels');
  //     if (amenity.miniFridge) features.push('Mini refrigerator stocked daily');
  //     if (amenity.coffeeTeaMaker) features.push('Nespresso machine & premium tea selection');
  //     if (amenity.ensuiteBathroom) features.push('Luxury ensuite bathroom with premium toiletries');
  //   }

  //   if (roomType.viewType) features.push(`${roomType.viewType} view`);

  //   return features.length > 0 ? features : ['Comfortable accommodation with modern amenities'];
  // };

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getRooms();

        if (response.data.success) {
          // Transform API data to match component structure
          const transformedRooms = response.data.data.map((room) => ({
  id: room.id,
  name: room.RoomType.name,
  size: room.RoomType.roomSize,
  bedType: room.RoomType.bedType,
  adults: room.maxGuests,
  price: parseFloat(room.RoomType.pricePerNight),
  viewType: room.RoomType.viewType,
  amenities: room.RoomType.amenities, // ✅ KEEP THIS
  image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
  bestSeller: room.id === 1
}));

          setRooms(transformedRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Failed to load rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const res = await getRoomTypes();

        if (res.data.success) {
          setRoomTypes(res.data.data);

          // Extract unique view types
          const uniqueViews = [
            ...new Set(res.data.data.map(rt => rt.viewType).filter(Boolean))
          ];
          setViews(uniqueViews);
        }
      } catch (err) {
        console.error("Failed to load filter data", err);
      }
    };

    fetchFilterData();
  }, []);

  const getAmenitiesList = (amenities) => {
  if (!amenities) return [];

  const AMENITY_LABELS = {
    wifi: "Free Wi-Fi",
    airConditioning: "Air Conditioning",
    flatScreenTV: "Flat Screen TV",
    miniFridge: "Mini Fridge",
    coffeeTeaMaker: "Coffee / Tea Maker",
    ensuiteBathroom: "Ensuite Bathroom",
    bathtub: "Bathtub",
    hasBalcony: "Balcony",
    hasWorkDesk: "Work Desk",
  };

  return Object.entries(amenities)
    .filter(([_, value]) => value === true)
    .map(([key]) => AMENITY_LABELS[key]);
};


  const filteredRooms = rooms.filter(room => {
    // Room Type
    if (filters.roomType !== 'All' && room.name !== filters.roomType) {
      return false;
    }

    // View Type
    if (filters.viewType !== 'All' && room.viewType !== filters.viewType) {
      return false;
    }

    // Price Range
    if (filters.priceRange !== 'All') {
      const price = room.price;
      if (filters.priceRange === '0-150' && price >= 150) return false;
      if (filters.priceRange === '150-300' && (price < 150 || price > 300)) return false;
      if (filters.priceRange === '300+' && price <= 300) return false;
    }

    return true;
  });

  const [reservation, setReservation] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0
  });

  // Calculate current step and completion
  const datesCompleted = reservation.checkIn && reservation.checkOut;
  const roomCompleted = selectedSuite !== null;

  const getCurrentStep = () => {
    if (bookingConfirmed) return 4;
    if (detailsCompleted) return 3;
    if (roomCompleted) return 3;
    if (datesCompleted) return 2;
    return 1;
  };

  const currentStep = getCurrentStep();

  const getCompletionPercentage = () => {
    let percentage = 0;
    if (datesCompleted) percentage = 25;
    if (roomCompleted) percentage = 50;
    if (detailsCompleted) percentage = 75;
    if (bookingConfirmed) percentage = 100;
    return percentage;
  };

  const steps = [
    { number: 1, label: 'Dates', completed: datesCompleted },
    { number: 2, label: 'Room', completed: roomCompleted, active: currentStep === 2 },
    { number: 3, label: 'Details', completed: detailsCompleted, active: currentStep === 3 },
    { number: 4, label: 'Confirm', completed: bookingConfirmed, active: currentStep === 4 }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const CalendarComponent = ({ month, year, onDateSelect, selectedStart, selectedEnd }) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    // Empty spaces for first day
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="w-full h-10"></div>
      );
    }

    // Day buttons
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const isPast = date < today;
      const isSelected = dateStr === selectedStart || dateStr === selectedEnd;
      const isInRange = selectedStart && selectedEnd && dateStr > selectedStart && dateStr < selectedEnd;
      const isDisabled = isPast || (selectingCheckOut && selectedStart && dateStr <= selectedStart);

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && onDateSelect(dateStr)}
          disabled={isDisabled}
          className={`w-full h-10 flex items-center justify-center rounded hover:bg-blue-100 transition
            ${isSelected ? 'bg-blue-500 text-white font-bold' : ''}
            ${isInRange ? 'bg-blue-100' : ''}
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    return (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-4 text-center">{monthNames[month]} {year}</h3>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="w-full h-10 flex items-center justify-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const handleDateSelect = (dateStr) => {
    if (!selectingCheckOut) {
      setReservation(prev => ({ ...prev, checkIn: dateStr, checkOut: '' }));
      setSelectingCheckOut(true);
    } else {
      setReservation(prev => ({ ...prev, checkOut: dateStr }));
      setSelectingCheckOut(false);
      setShowDatePicker(false);
    }
  };

  const handleSelectRoom = (roomId) => {
    setSelectedSuite(roomId);
  };

  const calculateTotal = () => {
    if (!selectedSuite || !reservation.checkIn || !reservation.checkOut) return 0;
    const room = rooms.find(r => r.id === selectedSuite);
    if (!room) return 0;

    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    return room.price * nights;
  };

  const calculateNights = () => {
    if (!reservation.checkIn || !reservation.checkOut) return 0;
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const currentDate = new Date();
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);

  const handleSaveDetails = async () => {
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Prepare reservation data
      const reservationData = {
        guestName: `${guestDetails.firstName} ${guestDetails.lastName}`,
        guestEmail: guestDetails.email,
        guestContact: guestDetails.phone,
        roomId: selectedSuite,
        checkInDate: reservation.checkIn,
        checkOutDate: reservation.checkOut,
        totalGuests: reservation.adults + reservation.children,
        specialRequest: guestDetails.specialRequests || null
      };

      setReservationData(reservationData);

      // Make API call to create reservation
      // const response = await createReservation(reservationData);

      // if (response.data.success) {
        setDetailsCompleted(true);
        setShowDetailsForm(false);
      //   alert(`✅ ${response.data.message}\nReservation ID: ${response.data.data.id}`);
      // }
    } catch (error) {
      console.error('Reservation error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create reservation. Please try again.';
      alert(`❌ Error: ${errorMessage}`);
    }
  };

const handleBookingSubmit = async () => {
    try {
        const data = await createReservation(reservationData);
        console.log(data);

        if (data.data.success) {
            // Navigate to payment page
            navigate(`/payment?reservationId=${data.data.data.id}&amount=${data.data.data.totalPrice}`);
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Booking failed: ' + error.message);
    }
};

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}

        {/* Progress Steps */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${step.completed ? 'bg-green-500 text-white' :
                      step.active ? 'bg-blue-500 text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                      {step.completed ? '✓' : step.number}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${step.active ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 ${step.completed ? 'bg-blue-500' : 'bg-gray-200'
                      }`} style={{ marginTop: '-24px' }} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentStep === 1 && 'Step 1: Select your dates'}
                {currentStep === 2 && 'Step 2: Select your sanctuary'}
                {currentStep === 3 && 'Step 3: Enter your details'}
                {currentStep === 4 && 'Step 4: Confirm your booking'}
              </h2>
              <div className="mt-2 max-w-xl mx-auto bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{getCompletionPercentage()}% Complete</p>
            </div>
          </div>
        </div>

        {/* Date & Guest Selection Bar */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex gap-4 items-center justify-center flex-wrap">
              {/* Date Picker */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => {
                    setShowDatePicker(!showDatePicker);
                    setSelectingCheckOut(false);
                  }}
                  className="flex items-center w-100 gap-3 bg-blue-50 border-2 border-blue-200 rounded-lg px-6 py-3 hover:bg-blue-100 transition"
                >
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500 font-medium">Check-in → Check-out</div>
                    <div className="font-semibold text-gray-800">
                      {reservation.checkIn ? formatDate(reservation.checkIn) : 'Select dates'}
                      {reservation.checkOut && ` → ${formatDate(reservation.checkOut)}`}
                    </div>
                  </div>
                </button>

                {/* Calendar Popup */}
                {showDatePicker && (
                  <div className="absolute top-full mt-2 left-0 bg-white shadow-2xl rounded-lg border border-gray-200 z-50">
                    <div className="p-4 border-b bg-blue-50">
                      <p className="text-sm font-semibold text-gray-700">
                        {!selectingCheckOut ? '📅 Select check-in date' : '📅 Select check-out date'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 divide-x">
                      <CalendarComponent
                        month={currentDate.getMonth()}
                        year={currentDate.getFullYear()}
                        onDateSelect={handleDateSelect}
                        selectedStart={reservation.checkIn}
                        selectedEnd={reservation.checkOut}
                      />
                      <CalendarComponent
                        month={nextMonth.getMonth()}
                        year={nextMonth.getFullYear()}
                        onDateSelect={handleDateSelect}
                        selectedStart={reservation.checkIn}
                        selectedEnd={reservation.checkOut}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Guests Selector */}
              <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-lg px-6 py-3">
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Guests</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReservation(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                        className="w-7 h-7 rounded-full bg-white border border-gray-300 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="font-semibold text-gray-800 w-12 text-center">{reservation.adults} Adults</span>
                      <button
                        onClick={() => setReservation(prev => ({ ...prev, adults: prev.adults + 1 }))}
                        className="w-7 h-7 rounded-full bg-white border border-gray-300 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReservation(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                        className="w-7 h-7 rounded-full bg-white border border-gray-300 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="font-semibold text-gray-800 w-12 text-center">{reservation.children} Kids</span>
                      <button
                        onClick={() => setReservation(prev => ({ ...prev, children: prev.children + 1 }))}
                        className="w-7 h-7 rounded-full bg-white border border-gray-300 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Left Column - Rooms List */}
            <div className="flex-1">
              {/* Filters */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <select
                  value={filters.roomType}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, roomType: e.target.value }))
                  }
                  className="bg-white border border-gray-300 px-6 py-2 rounded-lg"
                >
                  <option value="All">All Rooms</option>
                  {roomTypes.map(rt => (
                    <option key={rt.id} value={rt.name}>
                      {rt.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.viewType}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, viewType: e.target.value }))
                  }
                  className="bg-white border border-gray-300 px-6 py-2 rounded-lg"
                >
                  <option value="All">All Views</option>
                  {views.map(view => (
                    <option key={view} value={view}>
                      {view}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, priceRange: e.target.value }))
                  }
                  className="bg-white border border-gray-300 px-6 py-2 rounded-lg"
                >
                  <option value="All">All Prices</option>
                  <option value="0-150">Under $150</option>
                  <option value="150-300">$150 – $300</option>
                  <option value="300+">$300+</option>
                </select>
              </div>

              {/* Room Cards */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading available rooms...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredRooms.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No rooms match your filters. Try adjusting your search.</p>
                  </div>
                ) : (
                  filteredRooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                      <div className="flex flex-col md:flex-row">
                        {/* Room Image */}
                        <div className="md:w-1/3 relative">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-64 md:h-full object-cover"
                          />
                          {room.bestSeller && (
                            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              BEST SELLER
                            </div>
                          )}
                        </div>

                        {/* Room Details */}
                        <div className="md:w-2/3 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{room.name}</h3>

                            {/* Room Info */}
                            <div className="flex gap-4 mb-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                📐 {room.size} sq ft
                              </span>
                              <span className="flex items-center gap-1">
                                🛏️ {room.bedType}
                              </span>
                              <span className="flex items-center gap-1">
                                👥 {room.adults} Adults
                              </span>
                            </div>

                            {/* Features */}
<ul className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
  {getAmenitiesList(room.amenities).length === 0 ? (
    <li className="col-span-2 text-gray-500 italic">
      No amenities listed
    </li>
  ) : (
    getAmenitiesList(room.amenities).map((amenity, idx) => (
      <li
  key={idx}
  className="flex items-center gap-2 text-sm text-gray-600"
>
  <span className="text-blue-500">•</span>
  <span>{amenity}</span>
</li>

    ))
  )}
</ul>



                          </div>

                          {/* Price and Button */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <span className="text-3xl font-bold text-blue-600">${room.price}</span>
                              <span className="text-gray-500 ml-2">/night</span>
                            </div>
                            <button
                              onClick={() => handleSelectRoom(room.id)}
                              className={`px-6 py-3 rounded-lg font-semibold transition ${selectedSuite === room.id
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                              {selectedSuite === room.id ? 'Selected ✓' : 'Select Room'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column - Reservation Summary */}
            <div className="w-96">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Reservation</h3>

                {/* Date Info */}
                <div className="mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <span>📅</span>
                    <div className="flex-1">
                      <div className="font-semibold">Check-in - Check-out</div>
                      {reservation.checkIn && reservation.checkOut ? (
                        <div className="text-sm text-gray-600">
                          {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                          <span className="ml-2 text-blue-600 font-semibold">({calculateNights()} nights)</span>
                        </div>
                      ) : (
                        <div className="text-sm text-amber-600">Please select dates</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Guests Info */}
                <div className="mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>👥</span>
                    <div>
                      <div className="font-semibold">GUESTS</div>
                      <div className="text-sm text-gray-600">
                        {reservation.adults} Adults, {reservation.children} Children
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selection Status */}
                <div className="mb-6">
                  {!selectedSuite ? (
                    <p className="text-gray-500 text-center italic">No room selected yet</p>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-700 font-semibold">
                        {rooms.find(r => r.id === selectedSuite)?.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="space-y-2 mb-6">
                  {selectedSuite && calculateNights() > 0 && (
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>${rooms.find(r => r.id === selectedSuite)?.price} × {calculateNights()} nights</span>
                      <span>${(rooms.find(r => r.id === selectedSuite)?.price * calculateNights()).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Lodging Cost</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-gray-800 pt-2 border-t">
                    <span>Total Price</span>
                    <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Includes tax</p>
                </div>

                {/* Confirm Button */}
                <button
                  disabled={!selectedSuite || !reservation.checkIn || !reservation.checkOut}
                  onClick={() => {
                    if (!detailsCompleted) {
                      setShowDetailsForm(true);
                    } else if (detailsCompleted && !bookingConfirmed) {
                      setBookingConfirmed(true);
                      handleBookingSubmit();
                      alert('🎉 Your booking has been confirmed!');
                    }
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition ${selectedSuite && reservation.checkIn && reservation.checkOut
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {!detailsCompleted ? 'Enter Your Details' : bookingConfirmed ? 'Booking Confirmed ✓' : 'Confirm Booking'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Free cancellation until 48h before check-in
                </p>

                {/* Help */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-blue-600">
                    <span>💬</span>
                    <div>
                      <p className="font-semibold text-sm">Need help booking?</p>
                      <p className="text-sm">Call +1 (800) 456-7890</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-bold">
                🏨
              </div>
              <span className="font-bold text-gray-800">Luxury Grand Hotel</span>
            </div>
            <p className="text-sm text-gray-500">© 2025 Luxury Grand Hotel. All rights reserved.</p>
          </div>
        </footer>

        {/* Guest Details Modal */}
        {showDetailsForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">Guest Information</h2>
                <p className="text-blue-100 mt-1">Please provide your details to complete the booking</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Booking Summary */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>Room:</strong> {rooms.find(r => r.id === selectedSuite)?.name}</p>
                    <p><strong>Dates:</strong> {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)} ({calculateNights()} nights)</p>
                    <p><strong>Guests:</strong> {reservation.adults} Adults, {reservation.children} Children</p>
                    <p><strong className="text-blue-600 text-lg">Total: ${calculateTotal().toFixed(2)}</strong></p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={guestDetails.firstName}
                      onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="John"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={guestDetails.lastName}
                      onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={guestDetails.specialRequests}
                    onChange={(e) => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows="4"
                    placeholder="Any special requests or dietary requirements..."
                  ></textarea>
                </div>

                {/* Terms */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 accent-blue-500" required />
                    <span className="text-sm text-gray-700">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3 justify-end border-t">
                <button
                  onClick={() => setShowDetailsForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                  Go Back
                </button>
                <button
                  onClick={()=>{handleSaveDetails()}}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Save & Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RoomSelector;