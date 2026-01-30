import heroImg from "../assets/images/hotel-hero.jpg";
import iconBed from "../assets/images/bed.jpg";
import iconPool from "../assets/images/pool.jpg";
import iconSpa from "../assets/images/spa.jpg";
import iconGym from "../assets/images/gym.jpg";
import iconWifi from "../assets/images/gallery1.jpg";
import iconBar from "../assets/images/bar.jpg";
import iconService from "../assets/images/services.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const amenitiesList = [
  {
    id: "luxury-rooms",
    icon: iconBed,
    title: "Luxury Rooms",
    description:
      "Elegant, comfortable rooms designed for your ultimate comfort with premium linens and curated amenities.",
    highlights: ["King-sized beds", "City / sea view", "Daily housekeeping"],
  },
  {
    id: "infinity-pool",
    icon: iconPool,
    title: "Infinity Pool",
    description:
      "Relax and enjoy breathtaking views from our rooftop infinity pool with dedicated cabanas and towel service.",
    highlights: ["Rooftop view", "Heated in winter", "Poolside service"],
  },
  {
    id: "spa-wellness",
    icon: iconSpa,
    title: "Spa & Wellness",
    description:
      "Rejuvenate with bespoke treatments, massage therapies, and wellness programs led by professional therapists.",
    highlights: ["Signature massages", "Aromatherapy", "Couples' packages"],
  },
  {
    id: "gym-sauna",
    icon: iconGym,
    title: "Gym & Sauna",
    description:
      "State-of-the-art fitness center and sauna, open 24/7 with personal trainers and curated classes.",
    highlights: ["Cardio & strength", "Personal trainers", "Infrared sauna"],
  },
  {
    id: "highspeed-wifi",
    icon: iconWifi,
    title: "High-Speed WiFi",
    description: "Complimentary high-speed internet throughout the resort to keep you connected.",
    highlights: ["Fiber backbone", "In-room & public areas", "Business-grade stability"],
  },
  {
    id: "mini-bar",
    icon: iconBar,
    title: "Mini Bar & Lounge",
    description:
      "Enjoy a curated selection of drinks and snacks, handcrafted cocktails, and an intimate lounge experience.",
    highlights: ["Curated drinks", "Happy hour", "Private bookings"],
  },
  {
    id: "room-service",
    icon: iconService,
    title: "Room Service",
    description:
      "24/7 dedicated room service to cater to your needs anytime, from late-night snacks to gourmet dining.",
    highlights: ["24/7 availability", "Full menu", "Contactless delivery"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, type: "spring", stiffness: 120 } }),
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18 } },
};

const modalContent = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22 } },
};

const Amenities = () => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section
        className="relative h-96 md:h-[480px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,6,23,0.28), rgba(6,6,23,0.48)), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Exceptional Amenities for a Memorable Stay
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-100/90">
              From rejuvenating spa treatments to rooftop views — everything crafted for your well-being.
            </p>
            <div className="mt-6">
              <a
                href="#amenities-grid"
                className="inline-block bg-amber-400 hover:bg-amber-500 text-white font-semibold px-5 py-3 rounded-lg shadow"
                aria-label="Skip to amenities"
              >
                Explore Amenities
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro / Phases */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Designed Around You</h2>
          <p className="text-gray-600">
            We combine thoughtful design with high-touch service. Click any amenity to learn more —
            each card includes highlights and practical info to help you plan.
          </p>
        </div>
      </section>

      {/* Amenities Grid */}
      <section id="amenities-grid" className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenitiesList.map((amenity, i) => (
            <motion.article
              key={amenity.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-2xl transform hover:-translate-y-1 transition"
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={cardVariants}
              onClick={() => setSelected(amenity)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(amenity);
              }}
              aria-label={`Open details for ${amenity.title}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 shadow-inner">
                  <img
                    src={amenity.icon}
                    alt={`${amenity.title} icon`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{amenity.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{amenity.description}</p>
                </div>
              </div>

              <div className="mt-4 flex-1">
                <ul className="mt-2 space-y-2">
                  {amenity.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="text-sm text-gray-600 flex items-center gap-3">
                      <span className="inline-block w-2 h-2 bg-amber-400 rounded-full" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-amber-600 font-semibold">Learn more</span>
                <motion.span
                  whileHover={{ x: 6 }}
                  className="text-amber-400 font-bold select-none"
                  aria-hidden
                >
                  →
                </motion.span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={modalBackdrop}
            aria-modal="true"
            role="dialog"
            aria-label={`${selected.title} details`}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelected(null)}
              aria-hidden="true"
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
              variants={modalContent}
            >
              <div className="md:flex">
                {/* Image / visual */}
                <div className="md:w-1/2 bg-gray-50">
                  <img
                    src={selected.icon}
                    alt={selected.title}
                    className="w-full h-64 object-cover md:h-full"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="md:w-1/2 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{selected.title}</h3>
                      <p className="mt-2 text-gray-600">{selected.description}</p>
                    </div>

                    <button
                      onClick={() => setSelected(null)}
                      aria-label="Close amenity details"
                      className="text-gray-500 hover:text-gray-700 ml-4"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-800">Highlights</h4>
                    <ul className="mt-3 grid grid-cols-1 gap-2">
                      {selected.highlights.map((h) => (
                        <li
                          key={h}
                          className="text-sm text-gray-700 px-3 py-2 bg-gray-50 rounded-md flex items-center gap-3"
                        >
                          <span className="inline-block w-2 h-2 bg-amber-400 rounded-full" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <a
                      href="#book"
                      className="inline-block bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-md font-semibold"
                    >
                      Book a Room
                    </a>
                    <button
                      onClick={() => {
                        // optionally trigger contact or more actions
                        setSelected(null);
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Amenities;