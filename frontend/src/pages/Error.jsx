import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Polished NotFoundPage
 *
 * Improvements over the original:
 * - SPA-friendly navigation using react-router's Link / useNavigate
 * - Accessible controls and ARIA attributes
 * - Optional quick search to help users find rooms/reservations
 * - Helpful action cards with clear affordances
 * - Respect reduced-motion preference
 * - Cleaner mobile-first layout and tasteful animations
 *
 * You can wire the search handler to your actual search route (/search?q=...) or API.
 */

const SuggestionCard = ({ icon, title, desc, to }) => (
  <Link to={to} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center text-center">
    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </Link>
);

export default function NotFoundPage() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const handleGoBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const container = prefersReduced
    ? {}
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.36 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
      <main className="max-w-4xl w-full">
        <motion.section className="text-center" {...container} aria-labelledby="notfound-title">
          {/* Large 404 display */}
          <div className="relative mb-8">
            <h1 id="notfound-title" className="text-[160px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-500 to-teal-500 leading-none select-none">
              404
            </h1>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center animate-bounce">
                <MapPin size={56} className="text-emerald-500" aria-hidden />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Oops — Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-1">Looks like you took a wrong turn. Let's help you find your way back.</p>
            <p className="text-sm text-gray-500">You can search, go to the dashboard, or explore other areas of the site.</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGoBack}
              className="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-shadow shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Go back
            </button>

            <Link
              to="/"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-lime-400 to-emerald-500 text-white rounded-xl font-semibold hover:from-lime-500 hover:to-emerald-600 transition-shadow shadow-sm"
              aria-label="Go to dashboard"
            >
              <Home size={18} className="group-hover:scale-105 transition-transform" />
              Back to dashboard
            </Link>
          </div>

          {/* Quick search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8" role="search" aria-label="Search site">
            <label htmlFor="q" className="sr-only">Search</label>
            <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm border border-gray-200">
              <input
                id="q"
                name="q"
                type="search"
                placeholder="Search rooms, reservations, or offers"
                className="flex-1 px-4 py-3 rounded-full outline-none text-sm"
                aria-label="Search rooms, reservations, or offers"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
                aria-label="Search"
              >
                <Search size={16} /> Search
              </button>
            </div>
          </form>

          {/* Suggestion cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <SuggestionCard
              icon={<Home size={20} className="text-lime-600" />}
              title="Dashboard"
              desc="View your bookings, rewards, and account"
              to="/profile"
            />
            <SuggestionCard
              icon={<Search size={20} className="text-emerald-600" />}
              title="Search"
              desc="Find rooms, rates, and availability"
              to="/rooms"
            />
            <SuggestionCard
              icon={<MapPin size={20} className="text-teal-600" />}
              title="Rooms"
              desc="Explore room types and amenities"
              to="/gallery"
            />
          </div>

          {/* Diagnostic code for support */}
          <div className="mt-8 text-xs text-gray-400 font-mono text-center">
            ERROR_CODE: PAGE_NOT_FOUND_404
          </div>
        </motion.section>
      </main>

      {/* Background blobs (purely decorative) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <span className="absolute top-16 left-8 w-60 h-60 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" aria-hidden />
        <span className="absolute top-44 right-8 w-60 h-60 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" aria-hidden />
        <span className="absolute bottom-20 left-1/3 w-60 h-60 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" aria-hidden />
      </div>
    </div>
  );
}