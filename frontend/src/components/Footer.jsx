import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/Luxe-logo.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Top Accent Line */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-6">
            <img
              src={logo}
              alt="Luxe Stay"
              className="w-48 object-contain"
            />
            <p className="text-gray-300 text-sm leading-relaxed">
              Luxe Stay offers a premium 5-star hospitality experience in Kathmandu,
              combining comfort, elegance, and breathtaking views.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-yellow-400">Rooms</Link></li>
              <li><Link to="/gallery" className="hover:text-yellow-400">Gallery</Link></li>
              <li><Link to="/amenities" className="hover:text-yellow-400">Amenities</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
            </ul>
          </div>

          {/* Booking */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">
              Reservations
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/rooms-booking" className="hover:text-yellow-400">
                  Book a Room
                </Link>
              </li>
              <li>
                <span className="text-gray-300">Phone: +977 9802322755</span>
              </li>
              <li>
                <span className="text-gray-300">Email: info@luxestay.com</span>
              </li>
              <li>
                <span className="text-gray-300">
                  Kathmandu, Nepal
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">
              Stay Updated
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to receive offers, updates, and special packages.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Luxe Stay. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
