import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLocationArrow, FaPhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const hours = [
  { id: 1, day: 'Monday', time: '9:00 AM - 11:00 PM' },
  { id: 2, day: 'Tuesday', time: '12:00 PM - 12:00 AM' },
  { id: 3, day: 'Wednesday', time: '10:00 AM - 10:00 PM' },
  { id: 4, day: 'Thursday', time: '9:00 AM - 9:00 PM' },
  { id: 5, day: 'Friday', time: '3:00 PM - 9:00 PM' },
  { id: 6, day: 'Saturday', time: '9:00 AM - 3:00 PM' },
];

const Footer = () => {
  const footerRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-section', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none ',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.18,
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="border-t border-teal-100 bg-white/70 pb-4 pt-32 backdrop-blur dark:border-ink-700 dark:bg-ink-900/70"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 text-teal-800 dark:text-teal-100 sm:grid-cols-2 lg:grid-cols-4">
          <div className="footer-section flex flex-col items-start">
            <span className="mb-3 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M11 2h2v9h9v2h-9v9h-2v-9H2v-2h9z" />
                </svg>
              </span>
              <span className="text-xl font-extrabold tracking-tight text-teal-900 dark:text-teal-50">
                Med<span className="text-teal-500">Haven</span>
              </span>
            </span>
            <span className="mt-2 text-sm text-teal-700/70 dark:text-teal-200/70">
              Compassionate care, close to you.
            </span>
          </div>

          <div className="footer-section">
            <h4 className="mb-4 text-lg font-semibold text-teal-700 dark:text-teal-300">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="transition hover:text-teal-500">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/appointment"
                  className="transition hover:text-teal-500"
                >
                  Appointment
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-teal-500">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="mb-4 text-lg font-semibold text-teal-700 dark:text-teal-300">
              Hours
            </h4>
            <ul className="space-y-2">
              {hours.map((element) => (
                <li key={element.id} className="flex justify-between text-sm">
                  <span>{element.day}</span>
                  <span className="text-teal-700/60 dark:text-teal-200/60">
                    {element.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="mb-4 text-lg font-semibold text-teal-700 dark:text-teal-300">
              Contact
            </h4>
            <div className="mb-3 flex items-center gap-3">
              <FaPhone className="text-teal-500" />
              <span className="text-sm">+91 75899-77592</span>
            </div>
            <div className="mb-3 flex items-center gap-3">
              <MdEmail className="text-teal-500" />
              <span className="text-sm">divesh.contact@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <FaLocationArrow className="text-teal-500" />
              <span className="text-sm">Rajpura, Punjab, India</span>
            </div>
          </div>
        </div>

        <hr className="mb-6 border-teal-100 dark:border-ink-700" />
        <div className="flex flex-col items-center justify-between text-sm text-teal-700/60 dark:text-teal-200/60 md:flex-row">
          <span>
            © {new Date().getFullYear()} MedHaven. All rights reserved.
          </span>
          <span>
            Crafted with <span className="text-rose-400">❤</span> by Divesh
            Saini
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
