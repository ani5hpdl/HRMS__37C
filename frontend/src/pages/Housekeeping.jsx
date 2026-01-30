import React, { useState } from 'react';
import { Calendar, Users, Bed, DollarSign, Mail, Menu, Bell, Settings, Search, ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import NavBar from '../components/NavBar';

const HousekeepingDashboard = () => {
  const [rooms, setRooms] = useState([
    { id: 1, number: '101', type: 'Standard', status: 'Cleaning in Progress', priority: 'High', floor: '1st', reservation: 'Checked-In', notes: 'Guest still in room, extra towels and pillows.' },
    { id: 2, number: '102', type: 'Standard', status: 'Ready', priority: 'Low', floor: '1st', reservation: 'Reserved', notes: 'Ensure room is stocked with amenities.' },
    { id: 3, number: '103', type: 'Suite', status: 'Needs Cleaning', priority: 'High', floor: '2nd', reservation: 'Checked-Out', notes: 'Deep clean due to extended stay.' },
    { id: 4, number: '201', type: 'Standard', status: 'Cleaning in Progress', priority: 'Medium', floor: '2nd', reservation: 'Checked-In', notes: 'Guest requested fresh linens.' },
    { id: 5, number: '202', type: 'Standard', status: 'Needs Cleaning', priority: 'Medium', floor: '2nd', reservation: 'Checked-Out', notes: 'Ensure bathroom amenities are replenished.' },
    { id: 6, number: '203', type: 'Deluxe', status: 'Ready', priority: 'Low', floor: '3rd', reservation: 'Reserved', notes: 'Check minibar supplies and restock if necessary.' },
    { id: 7, number: '204', type: 'Suite', status: 'Needs Inspection', priority: 'Medium', floor: '3rd', reservation: 'Checked-Out', notes: 'Verify that all electronics are functioning.' },
    { id: 8, number: '302', type: 'Deluxe', status: 'Cleaning in Progress', priority: 'High', floor: '3rd', reservation: 'Checked-In', notes: 'Guest requested a crib for the carpet.' },
    { id: 9, number: '303', type: 'Suite', status: 'Ready', priority: 'Low', floor: '3rd', reservation: 'Reserved', notes: 'Ensure all towels are replaced.' },
    { id: 10, number: '304', type: 'Standard', status: 'Needs Cleaning', priority: 'Medium', floor: '3rd', reservation: 'Checked-Out', notes: 'Check for any maintenance issues.' },
    { id: 11, number: '305', type: 'Deluxe', status: 'Cleaning in Progress', priority: 'Medium', floor: '3rd', reservation: 'Checked-In', notes: 'Verify that the mini-fridge is filled with refreshments.' },
    { id: 12, number: '401', type: 'Suite', status: 'Ready', priority: 'Low', floor: '4th', reservation: 'Reserved', notes: 'Confirm all outlets & the station in fully stocked.' },
    { id: 13, number: '402', type: 'Standard', status: 'Needs Inspection', priority: 'Medium', floor: '4th', reservation: 'Checked-Out', notes: 'Replenesih the room\'s amenities.' }
  ]);

  const [filters, setFilters] = useState({
    roomType: 'All Rooms',
    status: 'All Status',
    priority: 'All Priority'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const itemsPerPage = 10;

  const statusColors = {
    'Ready': 'bg-lime-100 text-lime-800',
    'Needs Cleaning': 'bg-red-100 text-red-800',
    'Cleaning in Progress': 'bg-blue-100 text-blue-800',
    'Needs Inspection': 'bg-orange-100 text-orange-800'
  };

  const priorityColors = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  const reservationColors = {
    'Checked-In': 'bg-blue-50 text-blue-700',
    'Checked-Out': 'bg-gray-100 text-gray-700',
    'Reserved': 'bg-purple-50 text-purple-700'
  };

  const handleStatusChange = (roomId, newStatus) => {
    setRooms(rooms.map(room =>
      room.id === roomId ? { ...room, status: newStatus } : room
    ));
  };

  const handlePriorityChange = (roomId, newPriority) => {
    setRooms(rooms.map(room =>
      room.id === roomId ? { ...room, priority: newPriority } : room
    ));
  };

  const handleSelectRoom = (roomId) => {
    setSelectedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRooms.length === filteredRooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(filteredRooms.map(room => room.id));
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoomType = filters.roomType === 'All Rooms' || room.type === filters.roomType;
    const matchesStatus = filters.status === 'All Status' || room.status === filters.status;
    const matchesPriority = filters.priority === 'All Priority' || room.priority === filters.priority;

    return matchesSearch && matchesRoomType && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  const StatusDropdown = ({ room }) => (
    <select
      value={room.status}
      onChange={(e) => handleStatusChange(room.id, e.target.value)}
      className={`${statusColors[room.status]} px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer`}
    >
      <option value="Ready">Ready</option>
      <option value="Needs Cleaning">Needs Cleaning</option>
      <option value="Cleaning in Progress">Cleaning in Progress</option>
      <option value="Needs Inspection">Needs Inspection</option>
    </select>
  );

  const PriorityDropdown = ({ room }) => (
    <select
      value={room.priority}
      onChange={(e) => handlePriorityChange(room.id, e.target.value)}
      className={`${priorityColors[room.priority]} px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer`}
    >
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Filters and Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search room, floor, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>

            <select
              value={filters.roomType}
              onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-lime-100 text-gray-900 font-medium cursor-pointer focus:outline-none"
            >
              <option value="All Rooms">All Rooms</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-lime-100 text-gray-900 font-medium cursor-pointer focus:outline-none"
            >
              <option value="All Status">All Status</option>
              <option value="Ready">Ready</option>
              <option value="Needs Cleaning">Needs Cleaning</option>
              <option value="Cleaning in Progress">Cleaning in Progress</option>
              <option value="Needs Inspection">Needs Inspection</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-lime-100 text-gray-900 font-medium cursor-pointer focus:outline-none"
            >
              <option value="All Priority">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRooms.length === filteredRooms.length && filteredRooms.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Room Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Room Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Housekeeping Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Floor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Reservation Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRooms.includes(room.id)}
                          onChange={() => handleSelectRoom(room.id)}
                          className="rounded border-gray-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        Room {room.number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {room.type}
                      </td>
                      <td className="px-4 py-3">
                        <StatusDropdown room={room} />
                      </td>
                      <td className="px-4 py-3">
                        <PriorityDropdown room={room} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {room.floor}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${reservationColors[room.reservation]} px-3 py-1 rounded-full text-xs font-medium`}>
                          {room.reservation}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {room.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRooms.length)} of {filteredRooms.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1
                        ? 'bg-lime-400 text-gray-900 font-medium'
                        : 'hover:bg-gray-200 text-gray-700'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          <p>Copyright © 2025 Lodgify</p>
        </div>
      </div>
    </div>
  );
};

export default HousekeepingDashboard;