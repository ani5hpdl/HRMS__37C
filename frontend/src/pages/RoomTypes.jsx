import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import NavBar from '../components/NavBar';
import { getRoomTypes, deleteRoomType } from '../services/api';
import RoomTypeModal from '../components/RoomTypeModel';
import { ROOM_TYPE_IMAGES } from '../components/ui/roomType';
import toast from 'react-hot-toast';

const RoomTypes = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const amenityKeysToShow = [
        'wifi', 'airConditioning', 'flatScreenTV', 'miniFridge', 'coffeeTeaMaker',
        'ensuiteBathroom', 'bathtub', 'hasBalcony', 'hasWorkDesk'
    ];

    const formatLabel = (key) =>
        key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    const fetchRoomTypes = async () => {
        try {
            setLoading(true);
            const res = await getRoomTypes();
            setRoomTypes(res.data?.data || []);
            toast.success('Room types loaded successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to load room types. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this room type?')) return;
        try {
            await deleteRoomType(id);
            toast.success('Room type deleted successfully!');
            fetchRoomTypes();
            setSelectedRoomType(null);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to delete room type.');
        }
    };

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 flex">
                {/* LIST */}
                <div className="flex-1 p-6 bg-gray-50">
                    <div className="flex justify-between mb-6">
                        <h1 className="text-2xl font-bold">Room Types</h1>
                        <button
                            onClick={() => { setSelectedRoomType(null); setShowModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-lime-400 rounded-lg font-semibold"
                        >
                            <Plus size={18} /> Add Room Type
                        </button>
                    </div>

                    <div className="space-y-4">
                        {roomTypes.map((roomType) => {
                            let image = ROOM_TYPE_IMAGES[roomType.name] || ROOM_TYPE_IMAGES.default;
                            return (
                                <div
                                    key={roomType.id}
                                    onClick={() => setSelectedRoomType(roomType)}
                                    className="flex items-center gap-4 p-3 bg-white rounded-lg border hover:shadow cursor-pointer transition-all"
                                >
                                    <img
                                        src={image}
                                        alt={roomType.name}
                                        className="w-20 h-16 object-cover rounded-md flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-800">{roomType.name}</h3>
                                        <p className="text-xs text-gray-500">{roomType.bedType} • {roomType.roomSize} m²</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-gray-800">${roomType.pricePerNight}</span>
                                        <span className="text-xs text-gray-500"> /night</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* DETAILS */}
                {/* DETAILS */}
                {selectedRoomType && (
                    <div className="w-96 bg-white border-l p-6">
                        <h2 className="text-xl font-bold mb-4">Room Type Details</h2>
                        <p className="text-gray-600 mb-4">{selectedRoomType.description}</p>

                        <img
                            src={ROOM_TYPE_IMAGES[selectedRoomType.name] || ROOM_TYPE_IMAGES.default}
                            alt={selectedRoomType.name}
                            className="w-20 h-16 object-cover rounded-md flex-shrink-0 mb-4"
                        />

                        <div className="space-y-2 text-sm">
                            <p><strong>Size:</strong> {selectedRoomType.roomSize} m²</p>
                            <p><strong>Bed:</strong> {selectedRoomType.bedType}</p>
                            <p><strong>View:</strong> {selectedRoomType.viewType}</p>
                            <p><strong>Price:</strong> ${selectedRoomType.pricePerNight}/night</p>
                        </div>

                        {selectedRoomType.amenities && (
                            <div className="mt-4 text-sm">
                                <h3 className="font-semibold text-xl mb-4">Amenities:</h3>
                                <ul>
                                    {amenityKeysToShow.map((key) => (
                                        <li key={key}>
                                            <strong>{formatLabel(key)}:</strong> {selectedRoomType.amenities[key] ? 'Yes' : 'No'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex-1 bg-lime-400 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(selectedRoomType.id)}
                                className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                )}


                {/* SINGLE MODAL FOR ADD / EDIT */}
                <RoomTypeModal
                    show={showModal}
                    roomType={selectedRoomType} // null for Add, object for Edit
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchRoomTypes}
                />
            </div>
        </div>);
}

export default RoomTypes;
