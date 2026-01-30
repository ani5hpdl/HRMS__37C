import React, { useState, useMemo } from 'react';
import { Star, TrendingUp, Search, Filter, ChevronDown, Download, MessageSquare, Calendar, Package, Users, BarChart3, Settings, Bell, Menu, X } from 'lucide-react';
import NavBar from '../components/NavBar';

const ReviewDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [sortBy, setSortBy] = useState('Newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');

  // Sample review data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Ayhen Manukag',
      avatar: '👨',
      date: 'June 29, 2024',
      rating: 5,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      country: 'United States of America',
      helpful: 12
    },
    {
      id: 2,
      name: 'Sun Macune',
      avatar: '👩',
      date: 'June 11, 2024',
      rating: 4,
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.',
      country: 'United Kingdom',
      helpful: 8
    },
    {
      id: 3,
      name: 'Dannie Wong',
      avatar: '👨',
      date: 'July 10, 2024',
      rating: 5,
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
      country: 'China',
      helpful: 15
    },
    {
      id: 4,
      name: 'Isla de Lorento',
      avatar: '👩',
      date: 'June 3, 2024',
      rating: 3,
      text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
      country: 'Netherlands',
      helpful: 5
    }
  ]);

  // Chart data for review statistics
  const chartData = [
    { week: '1 Feb', positive: 95, negative: 15, neutral: 45 },
    { week: '8 Feb', positive: 110, negative: 8, neutral: 30 },
    { week: '15 Feb', positive: 85, negative: 12, neutral: 50 },
    { week: '22 Feb', positive: 120, negative: 5, neutral: 25 },
    { week: '1 Mar', positive: 75, negative: 18, neutral: 55 },
    { week: '8 Mar', positive: 105, negative: 10, neutral: 35 },
    { week: '15 Mar', positive: 130, negative: 6, neutral: 20 }
  ];

  // Country distribution
  const countryData = [
    { name: 'United States of America', percentage: 22, color: 'bg-yellow-300' },
    { name: 'China', percentage: 20, color: 'bg-yellow-200' },
    { name: 'United Kingdom', percentage: 19, color: 'bg-green-200' },
    { name: 'Netherlands', percentage: 13, color: 'bg-green-300' },
    { name: 'Australia', percentage: 11, color: 'bg-yellow-100' },
    { name: 'Saudi Arabia', percentage: 9, color: 'bg-gray-300' },
    { name: 'UK Empress Park', percentage: 6, color: 'bg-gray-400' }
  ];

  // Rating categories
  const ratings = [
    { label: 'Facilities', score: 4.5 },
    { label: 'Cleanliness', score: 4.4 },
    { label: 'Services', score: 4.5 },
    { label: 'Location', score: 4.4 },
    { label: 'Food and Dining', score: 4.3 }
  ];

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCountry !== 'All') {
      filtered = filtered.filter(r => r.country === selectedCountry);
    }

    if (selectedRating !== 'All') {
      filtered = filtered.filter(r => r.rating === parseInt(selectedRating));
    }

    if (sortBy === 'Newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'Oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'Highest Rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Lowest Rating') {
      filtered.sort((a, b) => a.rating - b.rating);
    }

    return filtered;
  }, [reviews, searchTerm, selectedCountry, selectedRating, sortBy]);

  const maxHeight = Math.max(...chartData.map(d => Math.max(d.positive, d.negative, d.neutral)));

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Name,Date,Rating,Country,Review\n"
      + filteredReviews.map(r => `"${r.name}","${r.date}",${r.rating},"${r.country}","${r.text}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reviews_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div>
                <p className="text-sm font-semibold">Jayden Dorwart</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Top Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Review Statistics Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Review Statistics</h3>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium cursor-pointer"
                >
                  <option>Last 7 Days</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              <div className="flex items-end justify-between h-48 gap-2">
                {chartData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col gap-1 items-center justify-end flex-1">
                      <div
                        className="w-full bg-green-300 rounded-t"
                        style={{ height: `${(data.positive / maxHeight) * 100}%` }}
                      ></div>
                      <div
                        className="w-full bg-yellow-300 rounded-t"
                        style={{ height: `${(data.neutral / maxHeight) * 100}%` }}
                      ></div>
                      <div
                        className="w-full bg-red-300 rounded-t"
                        style={{ height: `${(data.negative / maxHeight) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{data.week}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-300 rounded"></div>
                  <span className="text-sm text-gray-600">Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                  <span className="text-sm text-gray-600">Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-300 rounded"></div>
                  <span className="text-sm text-gray-600">Negative</span>
                </div>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Overall Rating</h3>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                  This Week
                </span>
              </div>

              <div className="flex items-center gap-8 mb-8">
                <div className="flex-1">
                  <div className="text-6xl font-bold text-gray-800 mb-2">4.6</div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={20} fill={i <= 4.6 ? "#FCD34D" : "none"} className="text-yellow-400" />
                    ))}
                  </div>
                  <div className="inline-block px-4 py-2 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-800 font-semibold">Impressive</span>
                    <p className="text-xs text-yellow-700 mt-1">Top 10% of properties</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="relative h-32 w-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#86EFAC"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(4.6 / 5) * 352} 352`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TrendingUp className="text-green-500" size={32} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {ratings.map((rating, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{rating.label}</span>
                      <span className="text-sm font-semibold">{rating.score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(rating.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews by Country */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Reviews by Country</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <ChevronDown size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* World Map Visualization */}
              <div className="relative">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect fill='%23f3f4f6' width='800' height='400'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='24' fill='%239ca3af' text-anchor='middle'%3EWorld Map%3C/text%3E%3C/svg%3E"
                  alt="World Map"
                  className="w-full h-64 object-contain"
                />
                <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow">
                  <div className="text-3xl font-bold">17,850</div>
                  <div className="text-sm text-gray-500">Total Reviews</div>
                </div>
              </div>

              {/* Country List */}
              <div className="space-y-3">
                {countryData.map((country, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{country.name}</span>
                        <span className="text-sm font-semibold">{country.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${country.color} h-2 rounded-full`}
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Download size={16} />
                  Export
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium cursor-pointer"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Highest Rating</option>
                  <option>Lowest Rating</option>
                </select>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="All">All Countries</option>
                {countryData.map((c, i) => (
                  <option key={i} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const ReviewCard = ({ review }) => {
  const [helpful, setHelpful] = useState(review.helpful);
  const [marked, setMarked] = useState(false);

  const handleHelpful = () => {
    if (!marked) {
      setHelpful(helpful + 1);
      setMarked(true);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
          {review.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">{review.name}</h4>
            <span className="text-xs text-gray-500">{review.date}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                size={14}
                fill={i <= review.rating ? "#FCD34D" : "none"}
                className="text-yellow-400"
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{review.text}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{review.country}</span>
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-1 ${marked ? 'text-blue-600' : 'hover:text-blue-600'}`}
        >
          👍 Helpful ({helpful})
        </button>
      </div>
    </div>
  );
};

export default ReviewDashboard;