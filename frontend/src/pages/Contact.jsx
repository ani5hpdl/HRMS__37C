import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import heroImg from "../assets/images/hotel-hero.jpg";


const initialForm = { name: "", email: "", message: "" };

const Contact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const statusRef = useRef(null);

  const contactInfo = {
    phone: "+977 9802322755",
    email: "info@luxestay.com",
    address: "Lakhuri Bhanjyang, Kathmandu, Nepal",
    hours: "Mon - Sun: 8:00 AM - 10:00 PM",
  };

  const validate = (data) => {
    const e = {};
    if (!data.name || data.name.trim().length < 2) e.name = "Please enter your name.";
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Please enter a valid email address.";
    if (!data.message || data.message.trim().length < 10)
      e.message = "Please enter a message (at least 10 characters).";
    return e;
  };

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    // clear field error on change
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(formData);
    if (Object.keys(validation).length) {
      setErrors(validation);
      // focus polite status for screen readers
      statusRef.current?.focus();
      return;
    }

    try {
      setSubmitting(true);
      // Simulate API call - replace with actual API request
      await new Promise((res) => setTimeout(res, 1200));
      toast.success("Message sent — we'll get back to you shortly!");
      setFormData(initialForm);
      setErrors({});
      statusRef.current?.focus();
    } catch (err) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <header
        className="relative h-80 md:h-[420px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,6,23,0.25), rgba(6,6,23,0.55)), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold">Contact Us</h1>
            <p className="mt-3 text-lg md:text-xl text-gray-100/90">
              Have a question or need help with a booking? Our team is here to assist you.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg shadow font-semibold"
              >
                <FaPhoneAlt /> Call Us
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
              >
                <FaEnvelope /> Email
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Form */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Send us a message</h2>
            <p className="text-gray-600 mb-6">
              Fill out the form and our reservations team will respond within 24 hours.
            </p>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl shadow-md"
              aria-describedby="form-status"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium mb-1">Name</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                      errors.name ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-amber-200"
                    }`}
                    placeholder="Your full name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "error-name" : undefined}
                    required
                  />
                  {errors.name && (
                    <span id="error-name" className="text-red-600 text-sm mt-1">
                      {errors.name}
                    </span>
                  )}
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium mb-1">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`px-4 py-2 rounded border focus:outline-none focus:ring-2 ${
                      errors.email ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-amber-200"
                    }`}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "error-email" : undefined}
                    required
                  />
                  {errors.email && (
                    <span id="error-email" className="text-red-600 text-sm mt-1">
                      {errors.email}
                    </span>
                  )}
                </label>
              </div>

              <label className="flex flex-col mt-4">
                <span className="text-sm font-medium mb-1">Message</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className={`px-4 py-3 rounded border focus:outline-none focus:ring-2 ${
                    errors.message ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-amber-200"
                  }`}
                  placeholder="Tell us about your inquiry..."
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "error-message" : undefined}
                  required
                />
                {errors.message && (
                  <span id="error-message" className="text-red-600 text-sm mt-1">
                    {errors.message}
                  </span>
                )}
              </label>

              <div className="mt-6 flex items-center gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 bg-black text-white px-5 py-2 rounded-md font-semibold hover:bg-gray-900 disabled:opacity-60"
                  disabled={submitting}
                >
                  <FaPaperPlane />
                  {submitting ? "Sending..." : "Send Message"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialForm);
                    setErrors({});
                    toast("Form cleared");
                  }}
                  className="px-4 py-2 rounded-md border hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>

              {/* polite live region for screen readers */}
              <div
                id="form-status"
                tabIndex={-1}
                ref={statusRef}
                aria-live="polite"
                className="sr-only"
              />
            </form>
          </section>

          {/* Right: Info & Map */}
          <aside>
            <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
              <h3 className="text-xl font-semibold">Contact Information</h3>

              <ul className="space-y-3">
                <li>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-amber-600"
                  >
                    <FaPhoneAlt className="text-amber-400" />
                    <div>
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-sm">{contactInfo.phone}</div>
                    </div>
                  </a>
                </li>

                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-amber-600"
                  >
                    <FaEnvelope className="text-amber-400" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm">{contactInfo.email}</div>
                    </div>
                  </a>
                </li>

                <li className="flex items-start gap-3 text-gray-700">
                  <FaMapMarkerAlt className="mt-1 text-amber-400" />
                  <div>
                    <div className="text-sm font-medium">Address</div>
                    <div className="text-sm">{contactInfo.address}</div>
                  </div>
                </li>

                <li className="flex items-center gap-3 text-gray-700">
                  <FaClock className="text-amber-400" />
                  <div>
                    <div className="text-sm font-medium">Hours</div>
                    <div className="text-sm">{contactInfo.hours}</div>
                  </div>
                </li>
              </ul>

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Find us</h4>
                <div className="w-full h-48 rounded overflow-hidden border">
                  {/* Simple Google Maps embed using query — replace with your embedding or iframe API key if required */}
                  <iframe
                    title="Lakhuri Bhanjyang, Kathmandu"
                    className="w-full h-full border-0"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&output=embed`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p>
                For group bookings or events, please include dates and an approximate headcount in your message so we can respond faster.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Contact;