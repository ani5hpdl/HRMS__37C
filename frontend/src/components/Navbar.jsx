import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  Calendar,
  Menu,
  X,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import logo from "../assets/images/Luxe-logo.png";
import BookNowButton from "../components/BookNowButton.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { getMyProfile } from "../services/api.js";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Rooms", to: "/rooms" },
  { label: "Gallery", to: "/gallery" },
  { label: "Amenities", to: "/amenities" },
  { label: "Contact", to: "/contact" },
];

const NAVBAR_THEME_KEY = "navbarThemeUntil"; // localStorage key

const readStoredNavbarTheme = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(NAVBAR_THEME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.theme || !parsed?.expires) return null;
    const expires = new Date(parsed.expires);
    if (isNaN(expires.getTime())) return null;
    if (expires > new Date()) {
      return parsed.theme; // still valid
    } else {
      // expired
      localStorage.removeItem(NAVBAR_THEME_KEY);
      return null;
    }
  } catch {
    return null;
  }
};

const saveNavbarThemeForToday = (theme) => {
  if (typeof window === "undefined") return;
  try {
    const payload = { theme, expires: getEndOfTodayISO() };
    localStorage.setItem(NAVBAR_THEME_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors (private mode)
  }
};

const Navbar = () => {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // navbarTheme is scoped to the navbar and persists only until EOD
  const [navbarTheme, setNavbarTheme] = useState(() => {
    const stored = readStoredNavbarTheme();
    if (stored === "dark" || stored === "light") return stored;
    // default: use system preference if available, otherwise light
    try {
      if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
    } catch {}
    return "light";
  });

  const profileRef = useRef(null);
  const mobileRef = useRef(null);
  const searchInputRef = useRef(null);

  // Replace with AuthContext if available

  const [user,setUser] = useState([]);
  const userMe = async() => {
    const response = await getMyProfile();
    console.log(response.data.data);
    if(response.data.success){
       setUser(response.data.data);
    }
  }

  useEffect(()=>{
    userMe();
  },[])

  // Hide navbar on scroll (keeps the prior behavior)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY;
          if (current > lastScrollY && current > 100) {
            setShowNavbar(false);
          } else {
            setShowNavbar(true);
          }
          setLastScrollY(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close menus on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target) && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowProfileMenu(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Toggle theme for navbar (applies immediately and persists until EOD)
  const toggleNavbarThemeForToday = () => {
    const next = navbarTheme === "light" ? "dark" : "light";
    setNavbarTheme(next);
    saveNavbarThemeForToday(next);
  };

  // Used to highlight active link
  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  // compute navbar classes based on navbarTheme
  const navBase =
    "fixed top-0 w-full z-50 transition-transform duration-300 backdrop-blur border-b";
  const navThemeClass =
    navbarTheme === "dark"
      ? "bg-slate-900/95 border-slate-800 text-gray-100"
      : "bg-white/90 border-gray-200 text-gray-800";

  return (
    <>
      <nav
        className={`${navBase} ${navThemeClass} ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="Luxe Stay" className="w-[160px] h-[48px] object-contain" />
              </Link>

              {/* Desktop nav links */}
              <div className="hidden md:flex md:items-center md:space-x-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative text-sm font-medium px-1 py-2 transition-colors ${isActive(link.to) ? "text-amber-500" : "hover:text-amber-500"
                      }`}
                    aria-current={isActive(link.to) ? "page" : undefined}
                  >
                    <span className={navbarTheme === "dark" ? "text-gray-100" : "text-gray-800"}>
                      {link.label}
                    </span>
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-amber-500 transition-all ${isActive(link.to) ? "w-full" : "w-0"
                        }`}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-3">
              {/* Search icon (mobile toggles drawer) */}
              <button
                onClick={() => {
                  setMobileOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 260);
                }}
                className={`p-2 rounded-md hover:bg-opacity-10 transition md:hidden ${navbarTheme === "dark" ? "text-gray-100 hover:bg-white/5" : "text-gray-700 hover:bg-black/5"}`}
                aria-label="Open menu and search"
                title="Open menu"
              >
                <Search size={18} />
              </button>

              {/* Desktop search (optional inline) */}
              <div className={`hidden md:flex items-center rounded-full px-3 py-1 ${navbarTheme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
                <Search size={16} className={navbarTheme === "dark" ? "text-gray-300" : "text-gray-500"} />
                <input
                  type="search"
                  placeholder="Search rooms, amenities..."
                  className={`ml-2 bg-transparent outline-none text-sm placeholder-gray-500 ${navbarTheme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  aria-label="Search site"
                />
              </div>

              {/* Navbar-scoped theme toggle */}
              <button
                onClick={toggleNavbarThemeForToday}
                className={`hidden md:inline-flex p-2 rounded-md transition ${navbarTheme === "dark" ? "text-gray-200 hover:bg-white/5" : "text-gray-700 hover:bg-black/5"}`}
                aria-label="Toggle navbar theme for today"
                title="Toggle navbar theme for today"
              >
                {navbarTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Book Now CTA */}
              <div className="hidden sm:inline-flex">
                <BookNowButton />
              </div>

              {/* Auth / profile */}
              {user?.isActive ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu((s) => !s)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full transition ${navbarTheme === "dark" ? "hover:bg-white/5" : "hover:bg-black/5"}`}
                    aria-haspopup="menu"
                    aria-expanded={showProfileMenu}
                    aria-controls="profile-menu"
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-semibold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className={`hidden sm:block text-sm font-medium ${navbarTheme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
                      {user?.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        id="profile-menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.12 }}
                        className={`${navbarTheme === "dark" ? "bg-slate-900 border-slate-800 text-gray-100" : "bg-white border-gray-100 text-gray-900"
                          } absolute right-0 mt-2 w-56 rounded-xl shadow-lg border overflow-hidden`}
                        role="menu"
                        aria-label="User menu"
                      >
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>

                        <ul className="py-2">
                          <li>
                            <Link
                              to="/my-bookings"
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 hover:text-black"
                            >
                              <Calendar size={16} /> My Bookings
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 hover:text-black"
                            >
                              <Settings size={16} /> Profile Settings
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                localStorage.removeItem("user");
                                window.location.reload();
                              }}
                              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <LogOut size={16} /> Logout
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login" className={`text-sm font-medium hover:text-amber-500 ${navbarTheme === "dark" ? "text-gray-100" : "text-gray-700"}`}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className={`md:hidden p-2 rounded-md transition ${navbarTheme === "dark" ? "text-gray-100 hover:bg-white/5" : "text-gray-700 hover:bg-black/5"}`}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* spacer to push page below fixed nav */}
      <div className="h-16" />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            id="mobile-menu"
            ref={mobileRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className={`${navbarTheme === "dark" ? "bg-slate-900 text-gray-100 border-slate-800" : "bg-white text-gray-800 border-gray-100"
              } fixed inset-y-0 right-0 z-50 w-full max-w-sm shadow-xl border-l`}
            aria-modal="true"
            role="dialog"
          >
            <div className="px-4 py-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Luxe Stay" className="w-36 object-contain" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toggleNavbarThemeForToday();
                  }}
                  className="p-2 rounded-md hover:bg-opacity-10"
                  aria-label="Toggle navbar theme for today"
                >
                  {navbarTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md" aria-label="Close menu">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-4 py-4">
              <div className={`flex items-center gap-2 rounded-full px-3 py-2 ${navbarTheme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
                <Search size={16} className={navbarTheme === "dark" ? "text-gray-300" : "text-gray-500"} />
                <input
                  ref={searchInputRef}
                  className={`bg-transparent outline-none w-full text-sm placeholder-gray-500 ${navbarTheme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                  placeholder="Search rooms, amenities..."
                  aria-label="Search"
                />
              </div>

              <nav className="mt-6 space-y-1" aria-label="Mobile primary">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.to) ? "text-amber-500 bg-amber-50" : navbarTheme === "dark" ? "text-gray-100 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    aria-current={isActive(link.to) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6">
                <BookNowButton className="w-full" />
              </div>

              <div className="mt-6 border-t pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-semibold">
                        {user.firstName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{user.firstName} {user.lastName}</div>
                        <div className="text-xs">{user.email}</div>
                      </div>
                    </div>

                    <div className="grid gap-2 mt-3">
                      <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md hover:bg-gray-50">
                        <Calendar size={16} className="inline mr-2" /> My Bookings
                      </Link>
                      <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md hover:bg-gray-50">
                        <Settings size={16} className="inline mr-2" /> Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem("user");
                          window.location.reload();
                        }}
                        className="w-full text-left px-3 py-2 text-red-600 rounded-md hover:bg-red-50"
                      >
                        <LogOut size={16} className="inline mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md bg-amber-500 text-white text-center font-semibold">
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;