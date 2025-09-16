import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../main';
import { FaPencilAlt, FaSignOutAlt } from 'react-icons/fa';
import gsap from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const maskEmail = (email) => {
  if (!email || !email.includes('@')) return '';
  const [name, domain] = email.split('@');
  if (name.length <= 4) {
    const hide = Math.floor(name.length / 2);
    return `${name.slice(0, hide)}${'*'.repeat(name.length - hide)}@${domain}`;
  }
  const visible = Math.min(7, name.length - 2);
  const maskedLen = name.length - visible - 1;
  return `${name.slice(0, visible)}${'*'.repeat(maskedLen)}${name.slice(-1)}@${domain}`;
};
const maskPhone = (phone) => {
  if (!phone || phone.length < 4) return '';
  return `${phone.slice(0, phone.length - 4)}****`;
};

const Profile = () => {
  const { user, setIsAuthenticated, setUser } = useContext(Context);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );
  }, []);

  const doLogout = async () => {
    setLoading(true);
    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      await axios.get(`${VITE_BACKEND_URL}/api/v1/user/patient/logout`, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      setUser({});
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 pt-20 sm:pt-30 text-white transition-colors duration-500">
      {/* Responsive Placeholder Avatar */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-700 flex justify-center items-center mb-4 sm:mb-6 shadow-md">
        <svg
          className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <hr className="w-9/12 max-w-md border-gray-600 mb-5 sm:mb-8" />

      {/* Personal Info Card: Responsive, scrollable on mobile */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md md:max-w-lg bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 pt-12 border border-gray-700 mx-2 sm:mx-0 flex flex-col"
        style={{ minHeight: '375px' }}
      >
        {/* Pencil Icon edit button */}
        <div className="absolute top-4 right-4 sm:top-3 sm:right-3">
          <button
            className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors duration-200"
            title="Edit (disabled)"
          >
            <FaPencilAlt size={20} />
          </button>
        </div>
        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-center tracking-wide">
          Personal information
        </h3>
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base flex-1">
          <li>
            <span className="font-semibold">Full Name:</span> {user?.firstName}{' '}
            {user?.lastName}
          </li>
          <li>
            <span className="font-semibold">Date of Birth:</span>{' '}
            {user?.dob ? user.dob.split('T')[0] : ''}
          </li>
          <li>
            <span className="font-semibold">Gender:</span> {user?.gender}
          </li>
          <li>
            <span className="font-semibold">Email:</span>{' '}
            {maskEmail(user?.email)}
          </li>
          <li>
            <span className="font-semibold">Phone Number:</span>{' '}
            {'+91 ' + maskPhone(user?.phone)}
          </li>
        </ul>
        {/* Logout Button, right bottom */}
        <div className="absolute right-4 bottom-4">
          <button
            className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer font-semibold py-2 px-2 transition"
            onClick={() => setShowLogoutModal(true)}
          >
            <FaSignOutAlt size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Blurred background */}
          <div
            className="absolute inset-0 bg-opacity-40 backdrop-blur-sm transition-all duration-300"
            onClick={() => setShowLogoutModal(false)}
          ></div>
          <div className="relative bg-gray-800 rounded-2xl shadow-2xl px-6 py-8 w-[320px] max-w-xs text-center z-60 border border-gray-700">
            <FaSignOutAlt className="mx-auto text-3xl text-red-500 mb-3" />
            <p className="text-lg font-bold mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <button
                className="px-4 py-2 rounded text-blue-500 border border-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition"
                onClick={() => setShowLogoutModal(false)}
                disabled={loading}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded text-red-500 border border-red-500 font-semibold hover:bg-red-500 hover:text-white transition"
                onClick={doLogout}
                disabled={loading}
              >
                Yes, logout!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
