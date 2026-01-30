import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createRoomType, updateRoomType, createAmenity, updateAmenity } from '../services/api';
import { ROOM_TYPE_NAMES, BED_TYPES, VIEW_TYPES, ROOM_SIZES, PRICES, DESCRIPTIONS } from './ui/roomType';

const AMENITIES_LIST = [
  'wifi','airConditioning','flatScreenTV','miniFridge','coffeeTeaMaker',
  'ensuiteBathroom','bathtub','hasBalcony','hasWorkDesk'
];

const RoomTypeModal = ({ show, onClose, onSuccess, roomType }) => {
  const isEdit = !!roomType;

  const [form, setForm] = useState({
    name: '', description: '', roomSize: '', bedType: '', viewType: '', pricePerNight: ''
  });
  const [amenities, setAmenities] = useState({});

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: roomType.name || '',
        description: roomType.description || '',
        roomSize: roomType.roomSize || '',
        bedType: roomType.bedType || '',
        viewType: roomType.viewType || '',
        pricePerNight: roomType.pricePerNight || ''
      });
      setAmenities(roomType.amenities || {});
    } else {
      setForm({ name:'', description:'', roomSize:'', bedType:'', viewType:'', pricePerNight:'' });
      setAmenities({});
    }
  }, [roomType, isEdit]);

  if (!show) return null;

  const handleAmenityChange = (key, value) => setAmenities({ ...amenities, [key]: value });

  const submit = async () => {
    try {
      let roomTypeResponse;
      if (isEdit) {
        roomTypeResponse = await updateRoomType(roomType.id, form);
        toast.success('Room type updated successfully!');
      } else {
        roomTypeResponse = await createRoomType(form);
        toast.success('Room type created successfully!');
      }

      const roomTypeId = isEdit ? roomType.id : roomTypeResponse.data.data.id;

      if (isEdit) await updateAmenity(roomTypeId, amenities);
      else await createAmenity({ roomTypeId, ...amenities });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit Room Type' : 'Add Room Type'}</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Room Type Form */}
        {[
          {label:'Room Type', value:'name', options:ROOM_TYPE_NAMES, type:'select'},
          {label:'Description', value:'description', options:Object.values(DESCRIPTIONS), type:'select'},
          {label:'Room Size', value:'roomSize', options:ROOM_SIZES, type:'select'},
          {label:'Bed Type', value:'bedType', options:BED_TYPES, type:'select'},
          {label:'View Type', value:'viewType', options:VIEW_TYPES, type:'select'},
          {label:'Price / Night', value:'pricePerNight', options:PRICES, type:'select'}
        ].map(field => (
          <div key={field.value} className="mb-4">
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <select
              value={form[field.value]}
              onChange={(e) => setForm({ ...form, [field.value]: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select {field.label}</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}

        {/* Amenities */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Amenities</h3>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES_LIST.map(a => (
              <label key={a} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!amenities[a]}
                  onChange={(e) => handleAmenityChange(a, e.target.checked)}
                  className="w-4 h-4"
                />
                {a.replace(/([A-Z])/g, ' $1')}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          className="w-full bg-lime-400 py-2 rounded-lg font-semibold hover:bg-lime-500 transition"
        >
          {isEdit ? 'Update Room Type' : 'Create Room Type'}
        </button>
      </div>
    </div>
  );
};

export default RoomTypeModal;
