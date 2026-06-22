import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../main';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ThemeToggle from './ui/ThemeToggle';

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();
  const navbarRef = useRef();

  const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Book Appointment', to: '/appointment' },
    { label: 'My Appointments', to: '/myappointments', requiresAuth: true },
    { label: 'Text', to: '/chat', requiresAuth: true },
    { label: 'About Us', to: '/about' },
  ];

  // Filter links according to auth status
  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.requiresAuth || isAuthenticated
  );

  useGSAP(
    () => {
      gsap.from(navbarRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
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
      toast.error(err.response?.data?.message || 'Logout failed');
    }
  };

  const goToLogin = () => {
    navigateTo('/login');
  };

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setShow(false);
  }, [location]);

  // Hide navbar on /chat route
  if (location.pathname === '/chat') return null;

  const linkClass = (to) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      location.pathname === to
        ? 'bg-teal-100 text-teal-700 dark:bg-ink-700 dark:text-teal-200'
        : 'text-teal-700 hover:bg-teal-50 dark:text-teal-100 dark:hover:bg-ink-700'
    }`;

  return (
    <nav
      ref={navbarRef}
      className="fixed z-50 w-full border-b border-teal-100/80 bg-white/75 backdrop-blur dark:border-ink-700 dark:bg-ink-900/75"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/30">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M11 2h2v9h9v2h-9v9h-2v-9H2v-2h9z" />
              </svg>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-teal-900 dark:text-teal-50">
              Med<span className="text-teal-500">Haven</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {visibleLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center justify-center">
                <FaUserCircle className="text-3xl text-teal-600 transition hover:text-teal-500 dark:text-teal-300" />
              </Link>
            ) : (
              <button
                onClick={goToLogin}
                className="rounded-xl bg-teal-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-600"
              >
                Login
              </button>
            )}
          </div>

          {/* Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="rounded-lg p-2 text-3xl text-teal-600 transition dark:text-teal-300"
              onClick={() => setShow((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <GiHamburgerMenu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {show && (
        <div className="space-y-4 border-t border-teal-100 bg-white px-6 py-6 dark:border-ink-700 dark:bg-ink-900 md:hidden">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setShow(false)}
              className={`block rounded-lg px-2 py-2 text-lg font-semibold ${
                location.pathname === link.to
                  ? 'bg-teal-100 text-teal-700 dark:bg-ink-700 dark:text-teal-200'
                  : 'text-teal-700 hover:bg-teal-50 dark:text-teal-100 dark:hover:bg-ink-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link
              to="/profile"
              onClick={() => setShow(false)}
              className="flex w-full items-center justify-center py-2"
            >
              <FaUserCircle className="text-3xl text-teal-600 transition hover:text-teal-500 dark:text-teal-300" />
            </Link>
          ) : (
            <button
              onClick={() => {
                goToLogin();
                setShow(false);
              }}
              className="w-full rounded-xl bg-teal-500 px-5 py-2 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-600"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
