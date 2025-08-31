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
      className="bg-white dark:bg-gray-900 border-t border-blue-100 dark:border-gray-800  pt-32 pb-4"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-700 dark:text-gray-200 mb-8">
          <div className="footer-section flex flex-col items-start">
            <img
              src="/logo.png"
              alt="MedHaven Logo"
              className="h-12 object-contain mb-3 rounded-lg shadow-sm "
            />
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
              MedHaven
            </span>
            <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Modern Hospital Management
            </span>
          </div>

          <div className="footer-section">
            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-4 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/appointment"
                  className="hover:text-blue-600 transition"
                >
                  Appointment
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-4 text-lg">
              Hours
            </h4>
            <ul className="space-y-2">
              {hours.map((element) => (
                <li key={element.id} className="flex justify-between text-sm">
                  <span>{element.day}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {element.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-4 text-lg">
              Contact
            </h4>
            <div className="flex items-center gap-3 mb-3">
              <FaPhone className="text-blue-500" />
              <span className="text-sm">+91 75899-77592</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <MdEmail className="text-blue-500" />
              <span className="text-sm">divesh.contact@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <FaLocationArrow className="text-blue-500" />
              <span className="text-sm">Rajpura, Punjab, India</span>
            </div>
          </div>
        </div>

        <hr className="border-blue-100 dark:border-gray-800 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            © {new Date().getFullYear()} MedHaven. All rights reserved.
          </span>
          <span>
            Crafted with <span className="text-blue-500">❤️</span> by Divesh
            Saini
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
