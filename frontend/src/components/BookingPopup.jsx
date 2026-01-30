import React, { useState, useEffect } from "react";

const BOARD_TYPE_MULTIPLIER = {
  "Room Only": 1,
  "Bed & Breakfast": 1.2,
  "Full Board": 1.5,
};

const BookingPopup = ({ isOpen, onClose, roomName, roomPrice, roomImage }) => {
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    boardType: "Room Only",
    notes: "",
  });
  const [totalPrice, setTotalPrice] = useState(roomPrice);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculatePrice = () => {
    if (!formData.checkIn || !formData.checkOut) return roomPrice;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const nights = (end - start) / (1000 * 60 * 60 * 24);
    if (nights <= 0) return roomPrice;
    const multiplier = BOARD_TYPE_MULTIPLIER[formData.boardType] || 1;
    return Math.round(roomPrice * nights * multiplier * formData.guests);
  };

  useEffect(() => {
    setTotalPrice(calculatePrice());
  }, [formData.checkIn, formData.checkOut, formData.boardType, formData.guests]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.checkIn || !formData.checkOut) {
      alert("Please fill all required fields!");
      return;
    }
    if (!validateEmail(formData.email)) {
      alert("Invalid email address!");
      return;
    }
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      alert("Check-out must be after check-in!");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      alert(
        `Booking confirmed for ${roomName}!\nTotal Price: ${totalPrice} NPR\nConfirmation email sent.`
      );
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        boardType: "Room Only",
        notes: "",
      });
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-3xl shadow-2xl w-[700px] overflow-hidden border border-yellow-400">
        {/* Room Image */}
        {roomImage && (
          <div
            className="h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${roomImage})` }}
          >
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
              <h2 className="text-3xl font-bold">{roomName}</h2>
              <p className="text-lg text-yellow-400">{roomPrice} NPR/night</p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-yellow-400 text-3xl font-bold z-10"
        >
          ✕
        </button>

        {!success ? (
          <div className="p-8 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  className="p-3 rounded-lg bg-gray-800 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email *"
                  className="p-3 rounded-lg bg-gray-800 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              {/* Phone & Board Type */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="p-3 rounded-lg bg-gray-800 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <select
                  name="boardType"
                  value={formData.boardType}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-800 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option>Room Only</option>
                  <option>Bed & Breakfast</option>
                  <option>Full Board</option>
                </select>
              </div>

              {/* Check-in & Check-out */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-800 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  min={formData.checkIn || undefined}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-800 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              {/* Guests & Notes */}
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="p-3 rounded-lg bg-gray-800 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Number of Guests"
                />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special Requests / Notes"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                ></textarea>
              </div>

              {/* Total & Submit */}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-yellow-400 font-semibold text-lg">
                  Total: {totalPrice} NPR
                </p>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg text-black font-bold hover:scale-105 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-12 text-center bg-gray-800">
            <h3 className="text-4xl font-bold text-green-400 mb-4">
              Booking Confirmed ✓
            </h3>
            <p className="text-gray-200 text-lg">
              A confirmation email will be sent shortly. Total price: {totalPrice} NPR.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPopup;
