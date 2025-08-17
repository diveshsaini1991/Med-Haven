import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();
  const navbarRef = useRef();

  const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Book Appointment", to: "/appointment" },
    { label: "My Appointments", to: "/myappointments", requiresAuth: true },
    { label: "Text", to: "/chat", requiresAuth: true },
    { label: "About Us", to: "/about" }
  ];

  // Optionally, remove the filter if all authenticated routes
  const visibleLinks = NAV_LINKS.filter(
    link => !link.requiresAuth || isAuthenticated
  );

  useGSAP(
    () => {
      gsap.from(navbarRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out"
      });
    },
    { scope: navbarRef }
  );

  const handleLogout = async () => {
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await axios.get(
        `${VITE_BACKEND_URL}/api/v1/user/patient/logout`,
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

  // Always auto-close mobile drawer on route change
  useEffect(() => {
    setShow(false);
  }, [location]);

  // Hide navbar on /chat route
  if (location.pathname === "/chat") return null;

  return (
    <nav
      ref={navbarRef}
      className="backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-blue-50 dark:border-gray-800 fixed w-full z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-bold text-blue-700 text-xl tracking-tight hidden sm:block">
              MedHaven
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium px-3 py-2 rounded-md transition text-base ${
                  location.pathname === link.to
                    ? "text-blue-700 underline underline-offset-4"
                    : "text-gray-700 dark:text-gray-200 hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition font-semibold shadow"
              >
                LOGOUT
              </button>
            ) : (
              <button
                onClick={goToLogin}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition font-semibold shadow"
              >
                LOGIN
              </button>
            )}
          </div>
          {/* Hamburger */}
          <button
            className="md:hidden text-blue-700 dark:text-blue-300 text-3xl rounded-md focus:outline-none transition"
            onClick={() => setShow((prev) => !prev)}
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>
      {/* Mobile Drawer */}
      {show && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t shadow-lg px-6 py-6 space-y-5">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setShow(false)}
              className={`block font-semibold text-lg px-2 py-2 rounded ${
                location.pathname === link.to
                  ? "text-blue-700 underline underline-offset-4"
                  : "text-gray-700 dark:text-gray-200 hover:text-blue-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setShow(false);
              }}
              className="w-full px-5 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition font-semibold shadow"
            >
              LOGOUT
            </button>
          ) : (
            <button
              onClick={() => {
                goToLogin();
                setShow(false);
              }}
              className="w-full px-5 py-2 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition font-semibold shadow"
            >
              LOGIN
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
