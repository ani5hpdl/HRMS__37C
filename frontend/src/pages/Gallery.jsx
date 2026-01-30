import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gallery1 from "../assets/images/gallery1.jpg";
import gallery2 from "../assets/images/gallery2.jpg";
import gallery3 from "../assets/images/gallery3.jpg";
import gallery4 from "../assets/images/bar.jpg";
import gallery5 from "../assets/images/gallery5.jpg";
import gallery6 from "../assets/images/gym.jpg";
import heroImg from "../assets/images/hotel-hero.jpg";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const media = [
  { src: gallery1, title: "Lobby & Lounge", category: "Interiors" },
  { src: gallery2, title: "Poolside Sunset", category: "Outdoors" },
  { src: gallery3, title: "Deluxe Room", category: "Rooms" },
  { src: gallery4, title: "Bar & Cocktails", category: "Dining" },
  { src: gallery5, title: "Terrace View", category: "Outdoors" },
  { src: gallery6, title: "Fitness Center", category: "Wellness" },
];

const categories = ["All", ...Array.from(new Set(media.map((m) => m.category)))];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const modalPanel = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const Gallery = () => {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState(media);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (filter === "All") {
      setItems(media);
    } else {
      setItems(media.filter((m) => m.category === filter));
    }
  }, [filter]);

  // Open lightbox
  const openAt = (index) => {
    setSelectedIndex(index);
    // lock scroll
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setSelectedIndex(-1);
    document.body.style.overflow = "";
  }, []);

  const showPrev = useCallback(() => {
    setSelectedIndex((s) => (s > 0 ? s - 1 : items.length - 1));
  }, [items.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((s) => (s < items.length - 1 ? s + 1 : 0));
  }, [items.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (selectedIndex === -1) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, closeLightbox, showPrev, showNext]);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <header
        className="relative h-80 md:h-[480px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,6,23,0.28), rgba(6,6,23,0.5)), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Our Gallery</h1>
            <p className="mt-3 text-lg md:text-xl text-gray-100/90">
              Explore curated images of our rooms, amenities, and scenic spots — get a feel for your stay.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#gallery-grid" className="inline-block bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg shadow font-semibold">
                View Photos
              </a>
              <a href="#book" className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg">
                Book a Stay
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Filters */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-semibold">Explore Photos</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === c
                    ? "bg-amber-400 text-white shadow"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                aria-pressed={filter === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid (masonry-like using CSS columns) */}
      <main id="gallery-grid" className="container mx-auto px-6 pb-20">
        <div
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          style={{ columnGap: "1rem" }}
        >
          {items.map((item, idx) => (
            <motion.figure
              key={`${item.src}-${idx}`}
              className="break-inside-avoid relative rounded-lg overflow-hidden cursor-pointer bg-white shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
              onClick={() => openAt(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openAt(idx);
              }}
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full rounded-lg object-cover transform transition duration-300 hover:scale-105"
                style={{ display: "block", width: "100%" }}
              />

              <motion.figcaption
                initial="hidden"
                whileHover="visible"
                variants={overlayVariants}
                className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/40 to-transparent text-white"
              >
                <div className="backdrop-blur-sm bg-black/20 rounded px-3 py-1 inline-block text-sm font-semibold">
                  {item.category}
                </div>
                <div className="mt-2 text-lg font-semibold drop-shadow">{item.title}</div>
              </motion.figcaption>
            </motion.figure>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex > -1 && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={modalBackdrop}
            aria-modal="true"
            role="dialog"
            aria-label={items[selectedIndex]?.title || "Image viewer"}
          >
            <div className="absolute inset-0 bg-black/60" onClick={closeLightbox} />

            <motion.div
              className="relative max-w-5xl w-full bg-white rounded-lg overflow-hidden shadow-2xl"
              variants={modalPanel}
            >
              {/* Image area */}
              <div className="relative bg-gray-900">
                <img
                  src={items[selectedIndex].src}
                  alt={items[selectedIndex].title}
                  className="w-full max-h-[75vh] object-contain bg-black"
                />

                {/* close */}
                <button
                  onClick={closeLightbox}
                  aria-label="Close"
                  className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full"
                >
                  <FaTimes />
                </button>

                {/* prev / next */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Caption and thumbnails */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{items[selectedIndex].title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{items[selectedIndex].category}</p>
                  </div>

                  <div className="text-sm text-gray-600">{selectedIndex + 1}/{items.length}</div>
                </div>

                {/* Thumbnails */}
                <div className="mt-4 flex items-center gap-2 overflow-x-auto">
                  {items.map((it, i) => (
                    <button
                      key={it.src + i}
                      onClick={() => setSelectedIndex(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded overflow-hidden border ${i === selectedIndex ? "ring-2 ring-amber-300" : "border-gray-200"}`}
                      aria-label={`View ${it.title}`}
                    >
                      <img src={it.src} alt={it.title} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={closeLightbox} className="px-4 py-2 rounded-md border hover:bg-gray-50">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;