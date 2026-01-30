import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import BookNowButton from "../components/BookNowButton.jsx";
import ViewAllRoomsButton from "../components/ViewAllRoomsButton.jsx";
import ViewFullGalleryButton from "../components/ViewFullGalleryButton.jsx";
import ViewAllAmenitiesButton from "../components/ViewAllAmenitiesButton.jsx";

import heroImg from "../assets/images/hotel-hero.jpg";
import room1 from "../assets/images/room1.jpg";
import room2 from "../assets/images/room2.jpg";
import room3 from "../assets/images/room3.jpg";
import gallery1 from "../assets/images/gallery1.jpg";
import gallery2 from "../assets/images/gallery2.jpg";
import gallery3 from "../assets/images/gallery3.jpg";
import iconBed from "../assets/images/bed.jpg";
import iconPool from "../assets/images/pool.jpg";
import iconSpa from "../assets/images/spa.jpg";
import iconGym from "../assets/images/gym.jpg";
import { FaChevronRight, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { getRooms } from "../services/api.js";

const FEATURES = [
  {
    title: "Prime Location",
    desc: "Minutes from cultural landmarks with breathtaking Himalayan vistas.",
  },
  {
    title: "5-Star Service",
    desc: "Personalized hospitality delivered by a professional team.",
  },
  {
    title: "Wellness First",
    desc: "Spa, yoga, sauna & curated wellness programs.",
  },
  {
    title: "Refined Comfort",
    desc: "Elegant design, premium bedding and thoughtful amenities.",
  },
];

const TESTIMONIALS = [
  { name: "Anish Poudel", quote: "A beautiful hotel with breathtaking views and impeccable service." },
  { name: "Sandeep M", quote: "A peaceful retreat — everything from rooms to spa was flawless." },
  { name: "Ishan G", quote: "Exceptional hospitality, luxury at its finest!" },
];

const roomPlaceholders = [room1, room2, room3];

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-extrabold text-amber-500">{value}</div>
    <div className="mt-2 text-gray-600">{label}</div>
  </div>
);

const Heading = ({ eyebrow, title, subtitle }) => (
  <header className="text-center max-w-3xl mx-auto">
    {eyebrow && <div className="text-amber-500 font-semibold uppercase tracking-wide text-sm">{eyebrow}</div>}
    <h2 className="mt-3 text-3xl md:text-4xl font-bold">{title}</h2>
    {subtitle && <p className="mt-3 text-gray-600">{subtitle}</p>}
  </header>
);

export default function Home() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);

  // Fetch rooms from API (keeps previous behavior)
  useEffect(() => {
    let mounted = true;
    const fetchRooms = async () => {
      setRoomsLoading(true);
      setRoomsError(null);
      try {
        const res = await getRooms();
        const data = res?.data?.success ? res.data.data || [] : [];
        if (mounted) setRooms(data);
      } catch (err) {
        if (mounted) setRoomsError(err?.message || "Failed to load rooms");
      } finally {
        if (mounted) setRoomsLoading(false);
      }
    };
    fetchRooms();
    return () => {
      mounted = false;
    };
  }, []);

  // Parallax background movement (subtle)
  useEffect(() => {
    const heroEl = heroRef.current;
    const bgEl = bgRef.current;
    if (!heroEl || !bgEl) return;
    let rafId = null;

    const handle = () => {
      if (!heroEl || !bgEl) return;
      const rect = heroEl.getBoundingClientRect();
      const offset = rect.top * 0.25; // subtle multiplier
      bgEl.style.transform = `translateY(${offset}px) scale(1.06)`;
      rafId = null;
    };

    const onScroll = () => {
      if (prefersReduced) return; // respect reduced motion
      if (rafId == null) rafId = requestAnimationFrame(handle);
    };

    // initial
    if (!prefersReduced) handle();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [prefersReduced]);

  const formatPrice = (val) => {
    if (val == null) return "-";
    return Number(val).toLocaleString("en-NP");
  };

  // Motion variants (reduced-motion aware)
  const cardMotion = prefersReduced
    ? { initial: {}, whileInView: {} }
    : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 } };

  return (
    <div className="bg-white text-gray-900">
      {/* HERO */}
      <header id="hero" ref={heroRef} className="relative h-[84vh] min-h-[560px] flex items-center overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${heroImg})`,
            transform: "translateY(0px) scale(1.06)",
            transition: prefersReduced ? "none" : "transform 0.12s linear",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/55" aria-hidden />

        <div className="container mx-auto px-6 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              {...cardMotion}
              transition={{ duration: 0.7 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Welcome to <span className="text-amber-400">Luxe Stay</span>
              </h1>
              <p className="mt-4 md:mt-6 text-lg md:text-xl text-white/90 leading-relaxed">
                A refined 5-star luxury experience in Kathmandu — exceptional design, warm hospitality,
                and unforgettable mountain views.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
                <BookNowButton className="shadow-lg" />
                <Link to="#rooms" className="inline-flex items-center gap-3 text-white/90 hover:text-white">
                  <span className="px-4 py-2 rounded-lg bg-white/10">Explore Rooms</span>
                  <FaChevronRight className="text-white/80" />
                </Link>
              </div>

              <div className="mt-8 bg-white/10 rounded-xl p-3 inline-flex gap-3 items-center w-full sm:w-auto">
                <input
                  className="bg-transparent placeholder-white/70 outline-none text-white px-2 py-2 w-full sm:w-64"
                  placeholder="Quick search — rooms, dates, amenities"
                  aria-label="Quick search"
                />
                <button className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold">Search</button>
              </div>
            </motion.div>

            <motion.aside
              {...cardMotion}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-3xl p-6 shadow-2xl"
              aria-hidden
            >
              <div className="flex items-center gap-4">
                <img src={room1} alt="Deluxe room preview" className="w-24 h-20 object-cover rounded-lg shadow-sm" loading="lazy" />
                <div>
                  <div className="text-sm font-semibold">Featured Offer</div>
                  <div className="text-gray-700 mt-1">Stay 3 nights, pay for 2 — limited time</div>
                </div>
              </div>

              <hr className="my-4" />

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div>
                  <div className="text-xs text-gray-500">Check-in</div>
                  <div className="font-semibold">From 2:00 PM</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Check-out</div>
                  <div className="font-semibold">Until 11:00 AM</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Free WiFi</div>
                  <div className="font-semibold">High-speed</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Parking</div>
                  <div className="font-semibold">Available</div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <ViewAllRoomsButton />
              </div>
            </motion.aside>
          </div>
        </div>
      </header>

      {/* OUR STORY */}
      <section id="story" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <Heading
            eyebrow="Our Story"
            title="Crafted with Passion Since 1994"
            subtitle="Inspired by Himalayan vistas and warm hospitality, Luxe Stay blends contemporary design with traditional warmth — a sanctuary for discerning travelers."
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <Heading eyebrow="Why Choose Us" title="A Standard of Excellence" subtitle="From attentive service to restorative wellness — every detail is considered." />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.article
                key={f.title}
                {...cardMotion}
                whileHover={!prefersReduced ? { y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" } : {}}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="text-amber-500 font-semibold mb-2">{f.title}</div>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ROOMS (API-backed) */}
      <section id="rooms" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <Heading eyebrow="Rooms & Suites" title="Designed for Absolute Comfort" subtitle="Thoughtfully appointed rooms with premium linens, elegant finishes, and impeccable service." />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {roomsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-lg animate-pulse bg-gray-100 p-6">
                  <div className="h-44 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : rooms.length === 0 ? (
              <div className="col-span-full bg-gray-50 rounded-2xl p-8 shadow text-gray-600">No rooms available at the moment.</div>
            ) : (
              rooms.slice(0, 6).map((room, i) => {
                const rt = room?.RoomType || {};
                const image = rt?.images?.[0] || roomPlaceholders[i % roomPlaceholders.length];
                return (
                  <motion.article
                    key={room.id || i}
                    {...cardMotion}
                    whileHover={!prefersReduced ? { scale: 1.02 } : {}}
                    transition={{ duration: 0.22 }}
                    className="rounded-2xl overflow-hidden shadow-lg group bg-white flex flex-col"
                    aria-labelledby={`room-${room.id || i}-title`}
                  >
                    <div className="relative">
                      <img src={image} alt={rt.name || `Room ${i + 1}`} className="w-full h-56 object-cover" loading="lazy" />
                      <div className="absolute top-4 left-4 bg-amber-500 text-white rounded-full px-3 py-1 font-semibold shadow">
                        {rt.pricePerNight ? `${formatPrice(rt.pricePerNight)} NPR` : "On request"}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 id={`room-${room.id || i}-title`} className="text-lg font-semibold text-gray-900">{rt.name || "Room"}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{rt.description}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaStar className="text-amber-400" />
                          <span className="font-semibold">{room.rating || "4.8"}</span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-500">{room.maxGuests ? `${room.maxGuests} guests` : "2 guests"}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link to={`/rooms/${room.id}`} className="text-amber-600 font-semibold">View</Link>
                          <BookNowButton className="px-3 py-1" />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <ViewAllRoomsButton />
          </div>

          {roomsError && <p className="mt-4 text-center text-sm text-red-600">{roomsError}</p>}
        </div>
      </section>

      {/* AMENITIES */}
      <section id="amenities" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <Heading eyebrow="Amenities" title="World-Class Facilities" subtitle="Relax, rejuvenate, and re-center — our amenities are crafted for comfort and convenience." />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { img: iconBed, title: "Luxury Rooms", desc: "Calming interiors, premium bedding, and thoughtful touches." },
              { img: iconPool, title: "Infinity Pool", desc: "Rooftop pool with panoramic city and mountain views." },
              { img: iconSpa, title: "Spa & Wellness", desc: "Holistic treatments and bespoke therapies." },
              { img: iconGym, title: "Gym & Sauna", desc: "Well-equipped fitness center and relaxing sauna." },
            ].map((a, i) => (
              <motion.div
                key={a.title}
                {...cardMotion}
                whileHover={!prefersReduced ? { y: -6 } : {}}
                transition={{ duration: 0.22 }}
                className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center"
              >
                <img src={a.img} alt={a.title} className="w-20 h-20 object-cover rounded-lg shadow-sm" loading="lazy" />
                <h4 className="mt-4 text-lg font-semibold">{a.title}</h4>
                <p className="mt-2 text-gray-600 text-sm">{a.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <ViewAllAmenitiesButton />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat value="30+" label="Luxury Rooms" />
            <Stat value="10k+" label="Happy Guests" />
            <Stat value="4.9★" label="Guest Rating" />
            <Stat value="25+" label="Years of Excellence" />
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <Heading eyebrow="Gallery" title="Moments of Luxury" subtitle="A curated selection of photos showcasing our property, design, and experiences." />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[gallery1, gallery2, gallery3].map((src, i) => (
              <motion.figure
                key={i}
                {...cardMotion}
                whileHover={!prefersReduced ? { scale: 1.03 } : {}}
                transition={{ duration: 0.18 }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-64 object-cover" loading="lazy" />
              </motion.figure>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <ViewFullGalleryButton />
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Heading eyebrow="Prime Location" title="Discover Kathmandu with Ease" subtitle="Centrally located and close to cultural landmarks, shopping, and mountain viewpoints." />
            <ul className="mt-4 space-y-3 text-gray-700">
              <li>✓ 10 minutes from city center</li>
              <li>✓ 20 minutes from the airport</li>
              <li>✓ Easy access to UNESCO heritage sites</li>
            </ul>

            <div className="mt-6 inline-flex items-center gap-3 text-amber-600">
              <FaMapMarkerAlt />
              <span className="font-medium">Lakhuri Bhanjyang, Kathmandu, Nepal</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1548013146-72479768bada" alt="Kathmandu" className="w-full h-80 object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <Heading eyebrow="Testimonials" title="What Our Guests Say" subtitle="Real feedback from guests who experienced Luxe Stay." />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.blockquote
                key={t.name}
                {...cardMotion}
                whileHover={!prefersReduced ? { y: -4 } : {}}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl p-6 shadow"
              >
                <p className="text-gray-600 italic">“{t.quote}”</p>
                <footer className="mt-4 font-semibold text-gray-800">{t.name}</footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-500 text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h3 className="text-3xl md:text-4xl font-extrabold">Ready to Experience True Luxury?</h3>
          <p className="mt-4 text-lg">Book your stay today and immerse yourself in elegance, comfort, and tranquility.</p>
          <div className="mt-8">
            <BookNowButton />
          </div>
        </div>
      </section>
    </div>
  );
}