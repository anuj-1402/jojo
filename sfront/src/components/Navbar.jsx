import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Moon, Sun, LogOut, LogIn, User } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { userAPI } from "../services/api";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "All Sites", path: "/sites" }, // <-- Added this line
    { name: "Bookmarked", path: "/bookmarked" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    try {
      await userAPI.logout();
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
            JS
          </div>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            JobScraper
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center text-gray-600 dark:text-gray-300">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative font-medium hover:text-purple-600 dark:hover:text-purple-400 transition ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400 after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-purple-500 rounded-full"
                    : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="toggle dark mode"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-110 transition"
          >
            {dark ? <Moon size={18} className="text-yellow-300" /> : <Sun size={18} className="text-orange-400" />}
          </button>

          {/* User Status */}
          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <User size={16} />
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2"
              >
                <LogIn size={16} />
                Login
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <nav className="flex flex-col items-start p-4 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full py-2 px-2 rounded-md font-medium transition ${
                    isActive
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-800/40 dark:text-purple-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full py-2 px-2 rounded-md font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full py-2 px-2 rounded-md font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center gap-2"
              >
                <LogIn size={16} />
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
