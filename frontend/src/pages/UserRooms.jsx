import room1 from "../assets/images/room1.jpg";
import room2 from "../assets/images/room2.jpg";
import room3 from "../assets/images/room3.jpg";
import heroImg from "../assets/images/hotel-hero.jpg";
import BookNowButton from "../components/BookNowButton.jsx";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { getRooms } from "../services/api.js";
import { motion } from "framer-motion";
import { FaBed, FaBath, FaWifi, FaTv, FaStar, FaChevronLeft, FaChevronRight, FaSearch, FaSortAmountDown } from "react-icons/fa";

const UserRooms = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("recommended"); // recommended | price-asc | price-desc
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const roomImages = [room1, room2, room3];

  const amenityIcons = {
    Bed: <FaBed className="inline mr-1 text-amber-500" />,
    Bath: <FaBath className="inline mr-1 text-amber-500" />,
    WiFi: <FaWifi className="inline mr-1 text-amber-500" />,
    TV: <FaTv className="inline mr-1 text-amber-500" />,
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await getRooms();
      if (response.data?.success) {
        setAllRooms(response.data.data || []);
        toast.success("Rooms loaded");
      } else {
        setAllRooms([]);
        toast.error("No rooms found");
      }
    } catch (error) {
      setAllRooms([]);
      toast.error(error?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filtering + sorting in a memo for performance
  useEffect(() => {
    let list = [...allRooms];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.RoomType?.name?.toLowerCase().includes(q) || r.RoomType?.description?.toLowerCase().includes(q));
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        list = list.filter((r) => Number(r.RoomType?.pricePerNight ?? 0) <= max);
      }
    }

    if (sort === "price-asc") {
      list.sort((a, b) => Number(a.RoomType?.pricePerNight ?? 0) - Number(b.RoomType?.pricePerNight ?? 0));
    } else if (sort === "price-desc") {
      list.sort((a, b) => Number(b.RoomType?.pricePerNight ?? 0) - Number(a.RoomType?.pricePerNight ?? 0));
    } // recommended leaves API order

    setFiltered(list);
  }, [allRooms, query, maxPrice, sort]);

  const formatPrice = (val) => {
    if (val == null) return "-";
    return Number(val).toLocaleString("en-NP");
  };

  const openDetails = (room) => {
    setSelectedRoom(room);
    setModalImageIndex(0);
    // small delay to focus modal if needed
  };

  const closeDetails = () => {
    setSelectedRoom(null);
  };

  const carouselImagesForRoom = (room) => {
    // If API supplies images, use them. Otherwise cycle placeholder images.
    if (room?.images && room.images.length) return room.images;
    // create deterministic pseudo-list from id
    const idx = allRooms.findIndex((r) => r.id === room.id);
    return [
      roomImages[idx % roomImages.length],
      roomImages[(idx + 1) % roomImages.length],
      roomImages[(idx + 2) % roomImages.length],
    ];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header
        className="relative h-96 md:h-[520px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-white"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Discover Exceptional Stays
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-100/90">
              Curated rooms with modern amenities, personalized service, and stunning views.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }}>
                <BookNowButton className="bg-amber-400 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-amber-500" />
              </motion.div>

              <a
                href="#rooms-grid"
                className="inline-flex items-center gap-2 text-white/90 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
              >
                View Rooms
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Filters */}
      <section className="container mx-auto mt-6 px-6 -mt-10">
<div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
  <div className="flex items-center gap-3 flex-1">
    <div className="relative w-full md:max-w-md">
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        aria-label="Search rooms"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or description"
        className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
      />
    </div>

    <div className="hidden md:block border-l border-gray-300 h-8 mx-3" />

    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Max Price</label>
      <input
        aria-label="Max price"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="e.g., 8000"
        className="w-28 px-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
      />
    </div>
  </div>

  <div className="flex items-center gap-3">
    <label className="text-sm font-medium text-gray-700 mr-2">Sort:</label>
    <div className="relative">
      <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <select
        aria-label="Sort rooms"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
      >
        <option value="recommended">Recommended</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  </div>
</div>

      </section>

      {/* Rooms Grid */}
      <main id="rooms-grid" className="container mx-auto px-6 py-12">
        {loading ? (
          // simple skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-4 shadow">
                <div className="h-40 bg-gray-200 rounded-md mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800">No rooms found</h3>
            <p className="mt-2 text-gray-600">Try clearing filters or try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((room, idx) => {
              const roomType = room.RoomType || {};
              const image = roomImages[idx % roomImages.length];
              const amenities = roomType.RoomAmenity || {};

              return (
                <motion.article
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.06 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <img src={image} alt={roomType.name} className="w-full h-48 object-cover" />
                    <div className="absolute top-4 left-4 bg-amber-400 text-white px-3 py-1 rounded-lg font-semibold shadow">
                      {formatPrice(roomType.pricePerNight)} NPR
                    </div>
                    <div className="absolute top-4 right-4 bg-white/80 text-gray-800 px-2 py-1 rounded-lg flex items-center gap-1">
                      <FaStar className="text-amber-400" /> <span className="text-sm">4.8</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900">{roomType.name}</h3>
                    <p className="mt-2 text-gray-600 line-clamp-3">{roomType.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {Object.entries(amenities)
                        .filter(([k, v]) => v === true)
                        .slice(0, 4)
                        .map(([k]) => (
                          <span
                            key={k}
                            className="bg-amber-50 text-amber-700 text-sm px-3 py-1 rounded-full flex items-center"
                          >
                            {amenityIcons[k] || null}
                            <span className="ml-1">{k.replace(/([A-Z])/g, " $1")}</span>
                          </span>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <button
                          onClick={() => openDetails(room)}
                          className="text-amber-600 font-semibold hover:underline"
                          aria-label={`View details for ${roomType.name}`}
                        >
                          View details
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.03 }}>
                          <BookNowButton />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedRoom && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDetails}
            aria-hidden="true"
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Left: carousel */}
              <div className="md:w-1/2 relative bg-gray-100">
                <img
                  src={carouselImagesForRoom(selectedRoom)[modalImageIndex]}
                  alt={selectedRoom.RoomType?.name}
                  className="w-full h-80 md:h-full object-cover"
                />

                <button
                  onClick={() =>
                    setModalImageIndex((i) =>
                      i === 0 ? carouselImagesForRoom(selectedRoom).length - 1 : i - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() =>
                    setModalImageIndex((i) => (i + 1) % carouselImagesForRoom(selectedRoom).length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Right: details */}
              <div className="md:w-1/2 p-6 flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedRoom.RoomType?.name}
                    </h2>
                    <p className="mt-1 text-amber-600 font-semibold">
                      {formatPrice(selectedRoom.RoomType?.pricePerNight)} NPR / night
                    </p>
                  </div>

                  <button
                    onClick={closeDetails}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close details"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 flex-1 overflow-auto">
                  <p className="text-gray-700">{selectedRoom.RoomType?.description}</p>

                  <h4 className="mt-4 text-sm font-semibold text-gray-800">Amenities</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(selectedRoom.RoomType?.RoomAmenity || {})
                      .filter(([k, v]) => v === true)
                      .map(([k]) => (
                        <span key={k} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                          {amenityIcons[k] || null}
                          {k.replace(/([A-Z])/g, " $1")}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <BookNowButton />
                  <button
                    onClick={closeDetails}
                    className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserRooms;