import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateRoom, getRoomTypes } from '../services/api';

const EditRoomModal = ({ showEditRoomModal, setShowEditRoomModal, roomToEdit, onRoomUpdated }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editRoom, setEditRoom] = useState({
    roomTypeId: '',
    maxGuests: ''
  });

  // Fetch room types when modal opens
  useEffect(() => {
    if (showEditRoomModal) {
      fetchRoomTypes();
    }
  }, [showEditRoomModal]);

  // Pre-fill form when roomToEdit changes
  useEffect(() => {
    if (roomToEdit) {
      setEditRoom({
        roomTypeId: roomToEdit.roomTypeId || roomToEdit.RoomType?.id || '',
        maxGuests: roomToEdit.maxGuests || ''
      });
      
      // Set selected room type for preview
      if (roomToEdit.RoomType) {
        setSelectedRoomType(roomToEdit.RoomType);
      }
    }
  }, [roomToEdit]);

  // Update selected room type when roomTypeId changes
  useEffect(() => {
    if (editRoom.roomTypeId && roomTypes.length > 0) {
      const roomType = roomTypes.find(rt => rt.id === editRoom.roomTypeId);
      setSelectedRoomType(roomType);
    }
  }, [editRoom.roomTypeId, roomTypes]);

  const fetchRoomTypes = async () => {
    try {
      const response = await getRoomTypes();
      const data = response.data?.data || response.data || response;
      setRoomTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching room types:', error);
      alert('Failed to load room types. Please try again.');
    }
  };

  const handleRoomTypeChange = (e) => {
    const roomTypeId = e.target.value;
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    
    setSelectedRoomType(roomType);
    setEditRoom({
      ...editRoom,
      roomTypeId: roomTypeId
    });
  };

  const handleUpdateRoom = async () => {
    // Validation
    if (!editRoom.roomTypeId) {
      alert('Please select a room type');
      return;
    }
    if (!editRoom.maxGuests || editRoom.maxGuests < 1) {
      alert('Please enter valid maximum guests');
      return;
    }

    try {
      setLoading(true);
      
      const response = await updateRoom(roomToEdit.id, {
        roomTypeId: editRoom.roomTypeId,
        maxGuests: parseInt(editRoom.maxGuests)
      });

      alert('Room updated successfully');
      
      // Reset form
      setEditRoom({
        roomTypeId: '',
        maxGuests: ''
      });
      setSelectedRoomType(null);
      
      // Close modal and refresh rooms list
      setShowEditRoomModal(false);
      if (onRoomUpdated) onRoomUpdated();
      
    } catch (error) {
      console.error('Error updating room:', error);
      alert(error.response?.data?.message || 'Failed to update room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEditRoom({
      roomTypeId: '',
      maxGuests: ''
    });
    setSelectedRoomType(null);
    setShowEditRoomModal(false);
  };

  if (!showEditRoomModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Edit Room</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Room ID Display */}
          {roomToEdit && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-sm font-semibold text-blue-800">
                Room ID: {roomToEdit.id}
              </span>
            </div>
          )}

          {/* Room Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room Type *
            </label>
            <select
              value={editRoom.roomTypeId}
              onChange={handleRoomTypeChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm"
              disabled={loading}
            >
              <option value="">Select a room type</option>
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name} - ${roomType.pricePerNight}/night
                </option>
              ))}
            </select>
          </div>

          {/* Show Room Type Details if selected */}
          {selectedRoomType && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-800">Room Type Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Size:</span>
                  <span className="ml-2 font-medium">{selectedRoomType.roomSize}m²</span>
                </div>
                <div>
                  <span className="text-gray-600">Bed Type:</span>
                  <span className="ml-2 font-medium">{selectedRoomType.bedType}</span>
                </div>
                <div>
                  <span className="text-gray-600">View:</span>
                  <span className="ml-2 font-medium capitalize">{selectedRoomType.viewType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price/Night:</span>
                  <span className="ml-2 font-medium">${selectedRoomType.pricePerNight}</span>
                </div>
              </div>
              {selectedRoomType.description && (
                <div className="mt-2">
                  <span className="text-gray-600 text-sm">Description:</span>
                  <p className="text-sm text-gray-700 mt-1">{selectedRoomType.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Max Guests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Guests *
            </label>
            <input
              type="number"
              min="1"
              value={editRoom.maxGuests}
              onChange={(e) => setEditRoom({...editRoom, maxGuests: e.target.value})}
              placeholder="e.g., 2"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm"
              disabled={loading}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm text-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateRoom}
            disabled={loading}
            className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold transition-colors text-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomModal;