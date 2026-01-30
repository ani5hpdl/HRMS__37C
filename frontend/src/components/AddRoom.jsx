import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createRoom, getRoomTypes } from '../services/api'; // Import from your API service

const AddRoomModal = ({ showAddRoomModal, setShowAddRoomModal, onRoomAdded }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomTypeId: '',
    maxGuests: '',
    totalRooms: '1'
  });

  // Fetch room types when modal opens
  useEffect(() => {
    if (showAddRoomModal) {
      fetchRoomTypes();
    }
  }, [showAddRoomModal]);

  const fetchRoomTypes = async () => {
    try {
      const response = await getRoomTypes();
      // Handle different possible response structures
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
    setNewRoom({
      ...newRoom,
      roomTypeId: roomTypeId
    });
  };

  const handleAddRoom = async () => {
    // Validation
    if (!newRoom.roomTypeId) {
      alert('Please select a room type');
      return;
    }
    if (!newRoom.maxGuests || newRoom.maxGuests < 1) {
      alert('Please enter valid maximum guests');
      return;
    }
    if (!newRoom.totalRooms || newRoom.totalRooms < 1) {
      alert('Please enter valid total rooms');
      return;
    }

    try {
      setLoading(true);
      
      // Create rooms (if totalRooms > 1, create multiple)
      const roomsToCreate = parseInt(newRoom.totalRooms);
      const createdRooms = [];
      
      for (let i = 0; i < roomsToCreate; i++) {
        const response = await createRoom({
          roomTypeId: newRoom.roomTypeId,
          maxGuests: parseInt(newRoom.maxGuests)
        });
        createdRooms.push(response.data);
      }

      alert(`Successfully created ${roomsToCreate} room(s)`);
      
      // Reset form
      setNewRoom({
        roomTypeId: '',
        maxGuests: '',
        totalRooms: '1'
      });
      setSelectedRoomType(null);
      
      // Close modal and refresh rooms list
      setShowAddRoomModal(false);
      if (onRoomAdded) onRoomAdded();
      
    } catch (error) {
      console.error('Error creating room:', error);
      alert(error.response?.data?.message || 'Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showAddRoomModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Add New Room</h2>
          <button 
            onClick={() => setShowAddRoomModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Room Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room Type *
            </label>
            <select
              value={newRoom.roomTypeId}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Guests *
              </label>
              <input
                type="number"
                min="1"
                value={newRoom.maxGuests}
                onChange={(e) => setNewRoom({...newRoom, maxGuests: e.target.value})}
                placeholder="e.g., 2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Rooms to Create *
              </label>
              <input
                type="number"
                min="1"
                value={newRoom.totalRooms}
                onChange={(e) => setNewRoom({...newRoom, totalRooms: e.target.value})}
                placeholder="e.g., 5"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                This will create {newRoom.totalRooms || 0} identical room(s)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button
            onClick={() => setShowAddRoomModal(false)}
            className="px-5 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm text-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAddRoom}
            disabled={loading}
            className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold transition-colors text-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : `Add ${newRoom.totalRooms || 1} Room(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;