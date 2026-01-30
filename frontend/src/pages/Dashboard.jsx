import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Home, Users, DollarSign, TrendingUp, TrendingDown, Bell, Search, ChevronRight, Star, Clock, CheckCircle, XCircle, AlertCircle, Bed, CreditCard, Mail, Phone, Menu, MoreVertical, Package, MessageSquare, ClipboardList } from 'lucide-react';

const ModernHotelDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Last 6 Months');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for data from API
  const [reservations, setReservations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: { value: 0, change: 0, trend: 'up' },
    totalReservations: { value: 0, change: 0, trend: 'up' },
    occupancyRate: { value: 0, change: 0, trend: 'up' },
    avgRoomRate: { value: 0, change: 0, trend: 'up' }
  });

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Reservation', icon: Calendar },
    { name: 'Rooms', icon: Home },
    { name: 'Messages', icon: MessageSquare, badge: 3 },
    { name: 'Housekeeping', icon: Users },
    { name: 'Inventory', icon: Package },
    { name: 'Calendar', icon: Calendar },
    { name: 'Financials', icon: DollarSign },
    { name: 'Reviews', icon: Star },
    { name: 'Concierge', icon: ClipboardList }
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const baseURL = import.meta.env.VITE_API_BASE_URL;

        const headers = {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch all data in parallel
        const [reservationsRes, roomTypesRes, roomsRes] = await Promise.all([
          fetch(`${baseURL}/api/reservations/getAllReservations`, { headers }),
          fetch(`${baseURL}/api/room-types/getAllRoomTypes`, { headers }),
          fetch(`${baseURL}/api/rooms/getAllRooms`, { headers })
        ]);

        const reservationsData = await reservationsRes.json();
        const roomTypesData = await roomTypesRes.json();
        const roomsData = await roomsRes.json();

        setReservations(reservationsData.data || []);
        setRoomTypes(roomTypesData.data || []);
        setRooms(roomsData.data || []);

        // Calculate stats
        calculateStats(reservationsData.data || [], roomsData.data || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (reservationsData, roomsData) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Filter reservations by month
    const thisMonthReservations = reservationsData.filter(r =>
      new Date(r.createdAt) >= thisMonth
    );
    const lastMonthReservations = reservationsData.filter(r =>
      new Date(r.createdAt) >= lastMonth && new Date(r.createdAt) < thisMonth
    );

    // Calculate revenue
    const thisMonthRevenue = thisMonthReservations
      .filter(r => r.paymentStatus === 'paid')
      .reduce((sum, r) => sum + parseFloat(r.totalPrice || 0), 0);

    const lastMonthRevenue = lastMonthReservations
      .filter(r => r.paymentStatus === 'paid')
      .reduce((sum, r) => sum + parseFloat(r.totalPrice || 0), 0);

    const revenueChange = lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    // Calculate occupancy
    const activeRooms = roomsData.filter(r => r.isActive);
    const occupiedRooms = reservationsData.filter(r =>
      r.status === 'checked_in' || r.status === 'confirmed'
    ).length;
    const occupancyRate = activeRooms.length > 0
      ? (occupiedRooms / activeRooms.length) * 100
      : 0;

    // Calculate average room rate
    const paidReservations = thisMonthReservations.filter(r => r.totalPrice && r.nights);
    const avgRate = paidReservations.length > 0
      ? paidReservations.reduce((sum, r) => sum + (parseFloat(r.totalPrice) / r.nights), 0) / paidReservations.length
      : 0;

    const reservationChange = lastMonthReservations.length > 0
      ? ((thisMonthReservations.length - lastMonthReservations.length) / lastMonthReservations.length) * 100
      : 0;

    setStats({
      totalRevenue: { value: thisMonthRevenue, change: revenueChange, trend: revenueChange >= 0 ? 'up' : 'down' },
      totalReservations: { value: thisMonthReservations.length, change: reservationChange, trend: reservationChange >= 0 ? 'up' : 'down' },
      occupancyRate: { value: occupancyRate, change: 5.1, trend: 'up' },
      avgRoomRate: { value: avgRate, change: 3.8, trend: 'up' }
    });
  };

  // Process room type data with availability
  const processedRoomTypes = roomTypes.map(type => {
    const typeRooms = rooms.filter(r => r.roomTypeId === type.id && r.isActive);
    const occupiedCount = reservations.filter(res =>
      (res.status === 'checked_in' || res.status === 'confirmed') &&
      typeRooms.some(room => room.id === res.roomId)
    ).length;

    return {
      name: type.name,
      available: typeRooms.length - occupiedCount,
      total: typeRooms.length,
      price: parseFloat(type.pricePerNight || 0),
      occupied: occupiedCount
    };
  });

  // Calculate payment method distribution
  const paymentMethodCounts = reservations
    .filter(r => r.paymentStatus === 'paid')
    .reduce((acc, res) => {
      const method = res.paymentMethod || 'cash';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

  const totalPaid = Object.values(paymentMethodCounts).reduce((a, b) => a + b, 0);
  const paymentMethods = Object.entries(paymentMethodCounts).map(([method, count]) => ({
    method: method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' '),
    count,
    percentage: totalPaid > 0 ? (count / totalPaid) * 100 : 0,
    color: method === 'cash' ? 'bg-emerald-200' :
      method === 'card' ? 'bg-emerald-300' :
        method === 'esewa' ? 'bg-lime-200' :
          method === 'khalti' ? 'bg-lime-300' : 'bg-yellow-200'
  }));

  // Generate revenue data for last 6 months
  const generateRevenueData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthRevenue = reservations
        .filter(r => {
          const createdDate = new Date(r.createdAt);
          return createdDate >= monthStart && createdDate <= monthEnd && r.paymentStatus === 'paid';
        })
        .reduce((sum, r) => sum + parseFloat(r.totalPrice || 0), 0);

      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        value: monthRevenue
      });
    }
    return data;
  };

  const revenueData = generateRevenueData();

  // Generate recent activities from reservations
  const generateActivities = () => {
    const sorted = [...reservations]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    return sorted.map(res => {
      const time = new Date(res.createdAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });

      if (res.status === 'checked_in') {
        return {
          time,
          title: 'Guest Check-In',
          desc: `${res.guestName} checked in`,
          icon: 'checkin',
          color: 'bg-emerald-100'
        };
      } else if (res.paymentStatus === 'paid') {
        return {
          time,
          title: 'Payment Received',
          desc: `NPR ${parseFloat(res.totalPrice).toLocaleString()} received from ${res.guestName}`,
          icon: 'payment',
          color: 'bg-lime-100'
        };
      } else {
        return {
          time,
          title: 'New Reservation',
          desc: `${res.guestName} booked for ${res.nights} nights`,
          icon: 'calendar',
          color: 'bg-yellow-100'
        };
      }
    });
  };

  const activities = generateActivities();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800',
      checked_in: 'bg-emerald-100 text-emerald-800',
      checked_out: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'bg-emerald-100 text-emerald-800',
      unpaid: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.unpaid;
  };

  const filteredReservations = reservations.filter(reservation => {
    const room = rooms.find(r => r.id === reservation.roomId);
    const roomType = room ? roomTypes.find(rt => rt.id === room.roomTypeId) : null;

    const matchesSearch = reservation.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (roomType?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Stats Cards */}
        <div className="p-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-sm text-gray-600">Total Revenue</div>
                <DollarSign size={20} className="text-emerald-600" />
              </div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(stats.totalRevenue.value)}</div>
              <div className="flex items-center gap-2 text-sm">
                {stats.totalRevenue.trend === 'up' ? (
                  <TrendingUp size={16} className="text-emerald-600" />
                ) : (
                  <TrendingDown size={16} className="text-red-600" />
                )}
                <span className={`${stats.totalRevenue.trend === 'up' ? 'text-emerald-600' : 'text-red-600'} font-medium`}>
                  {Math.abs(stats.totalRevenue.change).toFixed(1)}%
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-sm text-gray-600">Reservations</div>
                <Calendar size={20} className="text-emerald-600" />
              </div>
              <div className="text-3xl font-bold mb-2">{stats.totalReservations.value}</div>
              <div className="flex items-center gap-2 text-sm">
                {stats.totalReservations.trend === 'up' ? (
                  <TrendingUp size={16} className="text-emerald-600" />
                ) : (
                  <TrendingDown size={16} className="text-red-600" />
                )}
                <span className={`${stats.totalReservations.trend === 'up' ? 'text-emerald-600' : 'text-red-600'} font-medium`}>
                  {Math.abs(stats.totalReservations.change).toFixed(1)}%
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-sm text-gray-600">Occupancy Rate</div>
                <Home size={20} className="text-emerald-600" />
              </div>
              <div className="text-3xl font-bold mb-2">{stats.occupancyRate.value.toFixed(1)}%</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-emerald-600" />
                <span className="text-emerald-600 font-medium">{stats.occupancyRate.change}%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-sm text-gray-600">Avg. Room Rate</div>
                <Bed size={20} className="text-emerald-600" />
              </div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(stats.avgRoomRate.value)}</div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-emerald-600" />
                <span className="text-emerald-600 font-medium">{stats.avgRoomRate.change}%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Room Availability */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Room Types</h3>
                <button className="hover:bg-gray-100 p-2 rounded transition-colors">
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-4">
                {processedRoomTypes.map((room, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{room.name}</div>
                      <div className="text-xs text-gray-500">{room.available} / {room.total}</div>
                    </div>
                    <div className="text-xs text-emerald-600 mb-2">{formatCurrency(room.price)}/night</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${room.total > 0 ? (room.occupied / room.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Revenue</h3>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 bg-lime-100 rounded-lg text-sm font-medium border-none outline-none cursor-pointer hover:bg-lime-200 transition-colors"
                >
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="relative h-64">
                <svg className="w-full h-full" viewBox="0 0 600 256">
                  {[0, 100000, 200000, 300000].map((val, i) => (
                    <g key={i}>
                      <line x1="40" y1={256 - (val / 300000) * 220 - 20} x2="600" y2={256 - (val / 300000) * 220 - 20} stroke="#f0f0f0" strokeWidth="1" />
                      <text x="5" y={256 - (val / 300000) * 220 - 15} fontSize="10" fill="#999">{val / 1000}k</text>
                    </g>
                  ))}

                  {revenueData.length > 1 && (
                    <>
                      <path
                        d={`M 60 ${256 - (revenueData[0].value / 300000) * 220 - 20} ${revenueData.map((d, i) => `L ${60 + (i / (revenueData.length - 1)) * 520} ${256 - (d.value / 300000) * 220 - 20}`).join(' ')}`}
                        fill="none"
                        stroke="#84cc16"
                        strokeWidth="3"
                      />

                      <path
                        d={`M 60 ${256 - (revenueData[0].value / 300000) * 220 - 20} ${revenueData.map((d, i) => `L ${60 + (i / (revenueData.length - 1)) * 520} ${256 - (d.value / 300000) * 220 - 20}`).join(' ')} L 580 236 L 60 236 Z`}
                        fill="url(#gradient)"
                        opacity="0.3"
                      />
                    </>
                  )}

                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#84cc16" />
                      <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {revenueData.length > 0 && revenueData[revenueData.length - 1].value > 0 && (
                    <>
                      <circle
                        cx={60 + ((revenueData.length - 1) / (revenueData.length - 1)) * 520}
                        cy={256 - (revenueData[revenueData.length - 1].value / 300000) * 220 - 20}
                        r="6"
                        fill="#84cc16"
                        className="cursor-pointer"
                      />
                      <rect
                        x={60 + ((revenueData.length - 1) / (revenueData.length - 1)) * 520 - 35}
                        y={256 - (revenueData[revenueData.length - 1].value / 300000) * 220 - 50}
                        width="70"
                        height="25"
                        fill="#84cc16"
                        rx="4"
                      />
                      <text
                        x={60 + ((revenueData.length - 1) / (revenueData.length - 1)) * 520}
                        y={256 - (revenueData[revenueData.length - 1].value / 300000) * 220 - 32}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#fff"
                      >
                        {formatCurrency(revenueData[revenueData.length - 1].value)}
                      </text>
                    </>
                  )}

                  {revenueData.map((d, i) => (
                    <text key={i} x={60 + (i / (revenueData.length - 1)) * 520} y="252" textAnchor="middle" fontSize="11" fill="#666">
                      {d.month.split(' ')[0]}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Payment Methods</h3>
                <button className="hover:bg-gray-100 p-2 rounded transition-colors">
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {paymentMethods.reduce((acc, platform, i) => {
                    const prevPercentage = acc.total;
                    const strokeDasharray = `${platform.percentage} ${100 - platform.percentage}`;
                    const strokeDashoffset = -prevPercentage;
                    acc.total += platform.percentage;

                    const strokeColor = platform.color.includes('emerald-200') ? '#a7f3d0' :
                      platform.color.includes('emerald-300') ? '#6ee7b7' :
                        platform.color.includes('lime-200') ? '#d9f99d' :
                          platform.color.includes('lime-300') ? '#bef264' : '#fef08a';

                    acc.circles.push(
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="15.915"
                        fill="transparent"
                        stroke={strokeColor}
                        strokeWidth="20"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    );
                    return acc;
                  }, { total: 0, circles: [] }).circles}
                </svg>
              </div>
              <div className="space-y-2">
                {paymentMethods.length > 0 ? paymentMethods.map((platform, i) => (
                  <div key={i} className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                      <span className="text-gray-600">{platform.method}</span>
                    </div>
                    <span className="font-semibold">{platform.percentage.toFixed(1)}%</span>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-4">No payment data available</p>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Recent Activities</h3>
                <button className="hover:bg-gray-100 p-2 rounded transition-colors">
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((activity, i) => (
                  <div key={i} className="flex gap-4 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {activity.icon === 'calendar' && <Calendar size={20} className="text-yellow-700" />}
                      {activity.icon === 'checkin' && <span className="text-emerald-700 font-bold">→</span>}
                      {activity.icon === 'payment' && <DollarSign size={20} className="text-lime-700" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold">{activity.title}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                      <div className="text-sm text-gray-600">{activity.desc}</div>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-4">No recent activities</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking List */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Recent Reservations</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search guest, status, etc"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-yellow-100 rounded-lg text-sm font-medium border-none outline-none cursor-pointer hover:bg-yellow-200 transition-colors"
                >
                  <option>All Status</option>
                  <option>checked_in</option>
                  <option>checked_out</option>
                  <option>confirmed</option>
                  <option>pending</option>
                  <option>cancelled</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Booking ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Guest Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Room Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Check-In</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Payment</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((booking) => {
                      const room = rooms.find(r => r.id === booking.roomId);
                      const roomType = room ? roomTypes.find(rt => rt.id === room.roomTypeId) : null;

                      return (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                          <td className="py-4 px-4 text-sm font-mono text-gray-600">{booking.id.substring(0, 8)}</td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-sm">{booking.guestName}</div>
                            <div className="text-xs text-gray-500">{booking.guestEmail}</div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{booking.guestContact}</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {roomType?.name || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm">{booking.nights} nights</td>
                          <td className="py-4 px-4 text-sm">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-semibold">{formatCurrency(booking.totalPrice)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-gray-500">
                        No reservations found matching your search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHotelDashboard;