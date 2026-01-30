import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MoreVertical, Bell, Settings, X, Save, Trash2 } from 'lucide-react';
import NavBar from '../components/NavBar';

const LodgifyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingEvent, setEditingEvent] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    category: 'Meeting',
    description: ''
  });

  const categories = [
    { name: 'Training', color: 'bg-blue-200', textColor: 'text-blue-700', borderColor: 'border-blue-300' },
    { name: 'Meeting', color: 'bg-teal-200', textColor: 'text-teal-700', borderColor: 'border-teal-300' },
    { name: 'Guest Service', color: 'bg-green-200', textColor: 'text-green-700', borderColor: 'border-green-300' },
    { name: 'Maintenance', color: 'bg-yellow-200', textColor: 'text-yellow-700', borderColor: 'border-yellow-300' },
    { name: 'Event', color: 'bg-pink-200', textColor: 'text-pink-700', borderColor: 'border-pink-300' }
  ];

  // Load events from storage on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const result = await window.storage.list('event:');
      if (result && result.keys) {
        const loadedEvents = await Promise.all(
          result.keys.map(async (key) => {
            const eventData = await window.storage.get(key);
            return eventData ? JSON.parse(eventData.value) : null;
          })
        );
        setEvents(loadedEvents.filter(e => e !== null));
      }
    } catch (error) {
      console.log('No events found, starting fresh');
    }
  };

  const saveEvent = async (event) => {
    try {
      const eventKey = `event:${event.id}`;
      await window.storage.set(eventKey, JSON.stringify(event));
      await loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await window.storage.delete(`event:${eventId}`);
      await loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.startTime) {
      alert('Please fill in all required fields');
      return;
    }

    const event = {
      id: editingEvent?.id || Date.now().toString(),
      ...newEvent,
      createdAt: editingEvent?.createdAt || new Date().toISOString()
    };

    await saveEvent(event);

    setShowAddModal(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      category: 'Meeting',
      description: ''
    });
  };

  const openAddModal = (date = null) => {
    if (date) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      setNewEvent(prev => ({ ...prev, date: dateStr }));
    }
    setShowAddModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setShowAddModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
      setShowAddModal(false);
      setEditingEvent(null);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      const matchesDate = event.date === dateStr;
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesDate && matchesCategory;
    });
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : 'bg-gray-200';
  };

  const getCategoryBorder = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.borderColor : 'border-gray-300';
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
  };

  const renderCalendarDays = () => {
    const days = [];
    const prevMonthDays = startingDayOfWeek;
    const prevMonth = new Date(year, month, 0);
    const prevMonthLastDay = prevMonth.getDate();

    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="min-h-28 border border-gray-200 bg-gray-50 p-2">
          <div className="text-sm text-gray-400">{prevMonthLastDay - i}</div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const today = isToday(day);

      days.push(
        <div
          key={day}
          className={`min-h-28 border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer ${today ? 'bg-blue-50' : 'bg-white'}`}
          onClick={() => openAddModal(day)}
        >
          <div className={`text-sm font-semibold mb-1 ${today ? 'bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-20">
            {dayEvents.map((event, idx) => (
              <div
                key={idx}
                className={`${getCategoryColor(event.category)} border ${getCategoryBorder(event.category)} rounded p-1.5 text-xs hover:shadow-md transition-shadow`}
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(event);
                }}
              >
                <div className="font-semibold text-gray-700">
                  {event.startTime} {event.endTime && `- ${event.endTime}`}
                </div>
                <div className="font-medium text-gray-800 mt-0.5 truncate">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <div key={`next-${day}`} className="min-h-28 border border-gray-200 bg-gray-50 p-2">
          <div className="text-sm text-gray-400">{day}</div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Calendar Controls */}
        <div className="bg-white p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold text-lg min-w-[180px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-1 rounded text-sm transition-colors ${viewMode === 'day' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-1 rounded text-sm transition-colors ${viewMode === 'week' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-1 rounded text-sm transition-colors ${viewMode === 'month' ? 'bg-lime-400 font-semibold' : 'hover:bg-gray-200'}`}
              >
                Month
              </button>
            </div>
            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-lime-400"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Category</option>
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={() => openAddModal()}
              className="bg-lime-400 text-sm font-semibold px-4 py-2 rounded hover:bg-lime-500 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule</span>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-7 gap-0 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0">
                {renderCalendarDays()}
              </div>
            </div>
          </div>

          {/* Category Sidebar */}
          <div className="w-64 bg-white border-l p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Category</h3>
              <MoreVertical className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
            </div>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-3">Upcoming Events</h3>
              <div className="space-y-2 text-sm">
                {events
                  .filter(e => new Date(e.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map((event, idx) => (
                    <div key={idx} className={`p-2 ${getCategoryColor(event.category)} rounded border ${getCategoryBorder(event.category)}`}>
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{event.date} at {event.startTime}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEvent(null);
                  setNewEvent({ title: '', date: '', startTime: '', endTime: '', category: 'Meeting', description: '' });
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-lime-400"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Date *</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Start Time *</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-lime-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-lime-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Category *</label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-lime-400"
                >
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-lime-400"
                  rows="3"
                  placeholder="Add event description"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border-t">
              {editingEvent && (
                <button
                  onClick={() => handleDeleteEvent(editingEvent.id)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
              <div className={`flex space-x-2 ${!editingEvent ? 'ml-auto' : ''}`}>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEvent(null);
                    setNewEvent({ title: '', date: '', startTime: '', endTime: '', category: 'Meeting', description: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 bg-lime-400 rounded hover:bg-lime-500 font-semibold flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingEvent ? 'Update' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LodgifyCalendar;