
import React, { useEffect, useState, useMemo } from 'react';
import { Home, Calendar, MessageSquare, Package, DollarSign, Star, Users, Menu, Search, ChevronDown, Bed, User, Wifi, Tv, Coffee, Wind, Lock, Droplets, Bath, Sun, Clock, Cookie, X, Plus } from 'lucide-react';
import NavBar from '../components/NavBar';
import { getRooms } from '../services/api';
import AddRoomModal from '../components/AddRoom';
import EditRoomModal from '../components/EditRoom'; // Adjust path as needed
import { ROOM_TYPE_IMAGES } from '../components/ui/roomType';

const HotelManagementSystem = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeTab, setActiveTab] = useState('rooms');
  const [sortBy, setSortBy] = useState('popular');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getRooms();

      const roomsData = response?.data?.data || [];

      const transformedRooms = roomsData.map(room => {
        const roomType = room.RoomType || {};
        const image =
          ROOM_TYPE_IMAGES[roomType.name] || ROOM_TYPE_IMAGES.default;

        return {
          id: room.id,
          name: roomType.name || "Unknown",
          size: Number(roomType.roomSize) || 30,
          bedType: roomType.bedType || "Queen Bed",
          guests: Number(room.maxGuests) || 2,
          price: Number(roomType.pricePerNight) || 0,
          status: room.isActive ? "Available" : "Occupied",
          availability: { occupied: 0, total: 1 },
          description:
            roomType.description ||
            `Comfortable ${roomType.name || "room"} with modern amenities.`,
          image,
          gallery: [image, image, image, image],
          features: [
            "Spacious layout with modern design",
            "Work desk with ergonomic chair",
            "Premium bedding and linens"
          ],
          amenities: [
            "Complimentary bottled water",
            "Luxury toiletries",
            "Hairdryer",
            "24-hour room service"
          ]
        };
      });

      setRooms(transformedRooms);
    } catch (err) {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    let data = [...rooms];

    // 🔍 Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(room =>
        room.name.toLowerCase().includes(q) ||
        room.bedType.toLowerCase().includes(q) ||
        room.description.toLowerCase().includes(q)
      );
    }

    // 🎯 Filter
    if (filterType !== "all") {
      data = data.filter(room =>
        filterType === "available"
          ? room.status === "Available"
          : room.status === "Occupied"
      );
    }

    // ↕️ Sort
    switch (sortBy) {
      case "price-low":
        data.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        data.sort((a, b) => b.price - a.price);
        break;
      case "size":
        data.sort((a, b) => b.size - a.size);
        break;
      default:
        break;
    }

    return data;
  }, [rooms, searchQuery, filterType, sortBy]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading rooms...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchRooms}
              className="px-4 py-2 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          {/* Room List */}
          <div className="flex-1 p-6 bg-gray-50">

            {/* Search and Filters */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border px-4 rounded-lg"
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="size">Size</option>
              </select>

              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="border px-4 rounded-lg"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>

              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowModal(true)}
              >
                <Plus size={18} />
                Add Rooms
              </button>
            </div>

            {/* Room Cards */}
            <div className="space-y-4">
              {filteredRooms.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                  No rooms found
                </div>
              ) : (
                filteredRooms.map(room => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className="bg-white p-4 rounded-xl flex gap-4 cursor-pointer hover:shadow"
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-32 h-24 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold">{room.name}</h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${room.status === "Available"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {room.status}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 flex gap-4 mt-1">
                        <span><Home size={12} /> {room.size} m²</span>
                        <span><Bed size={12} /> {room.bedType}</span>
                        <span><User size={12} /> {room.guests}</span>
                      </div>

                      <div className="mt-3 font-semibold">
                        ${room.price} / night
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Room Detail Sidebar */}
          {selectedRoom && (
            <div className="w-96 bg-white border-l border-gray-200 overflow-auto shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Room Detail</h2>
                  <button
                    onClick={() => {
                      setRoomToEdit(selectedRoom); // Pass the current room object
                      setShowEditModal(true);
                    }}
                    className="px-4 py-2 bg-lime-400 hover:bg-lime-500 rounded-lg font-semibold transition-colors text-sm text-gray-800"
                  >
                    Edit
                  </button>
                </div>

                <EditRoomModal
                  showEditRoomModal={showEditModal}
                  setShowEditRoomModal={setShowEditModal}
                  roomToEdit={selectedRoom}
                  onRoomUpdated={() => {
                    console.log('Room updated!');
                    // Refresh your rooms list here
                  }}
                />

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{selectedRoom.name} Room</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedRoom.status === 'Available'
                        ? 'bg-teal-50 text-teal-700'
                        : 'bg-yellow-50 text-yellow-700'
                      }`}>
                      {selectedRoom.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Occupied: <span className="font-semibold">{selectedRoom.availability.occupied}/{selectedRoom.availability.total} Rooms</span></p>
                </div>

                <div className="mb-6">
                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    className="w-full h-56 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowImageGallery(true)}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {selectedRoom.gallery.slice(1, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setShowImageGallery(true)}
                      />
                    ))}
                    <div
                      className="relative cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setShowImageGallery(true)}
                    >
                      <img src={selectedRoom.gallery[3]} className="w-full h-24 object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-lime-400 bg-opacity-90 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-gray-800 text-sm">View All</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Home size={14} />
                      </div>
                      <div className="font-semibold text-gray-800">{selectedRoom.size} m²</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Bed size={14} />
                      </div>
                      <div className="font-semibold text-gray-800">{selectedRoom.bedType}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <User size={14} />
                      </div>
                      <div className="font-semibold text-gray-800">{selectedRoom.guests} guests</div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">{selectedRoom.description}</p>

                <div className="mb-6">
                  <h4 className="font-bold mb-3 text-gray-800">Features</h4>
                  <div className="space-y-2">
                    {selectedRoom.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-5 h-5 rounded bg-teal-50 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold mb-3 text-gray-800">Facilities</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Wifi size={16} className="text-gray-500" />
                      <span>High-speed Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Lock size={16} className="text-gray-500" />
                      <span>In-room safe</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Tv size={16} className="text-gray-500" />
                      <span>Flat-screen TV</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Wind size={16} className="text-gray-500" />
                      <span>Air conditioning</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Package size={16} className="text-gray-500" />
                      <span>Mini-fridge</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Coffee size={16} className="text-gray-500" />
                      <span>Coffee/tea maker</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3 text-gray-800">Amenities</h4>
                  <div className="space-y-2">
                    {selectedRoom.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-5 h-5 rounded bg-teal-50 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddRoomModal
              showAddRoomModal={showModal}
              setShowAddRoomModal={setShowModal}
              onRoomAdded={() => console.log('Room added!')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagementSystem;