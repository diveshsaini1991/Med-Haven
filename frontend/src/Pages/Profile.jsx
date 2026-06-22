import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../main';
import { FaPencilAlt, FaSignOutAlt, FaLock } from 'react-icons/fa';
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const resetPasswordForm = () => {
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword === oldPassword) {
      toast.error('New password must be different from the old password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      await axios.post(
        `${VITE_BACKEND_URL}/api/v1/user/patient/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      toast.success('Password changed successfully.');
      resetPasswordForm();
      setShowPasswordModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

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
    <div className="flex min-h-screen flex-col items-center pt-24 text-teal-900 dark:text-teal-50 sm:pt-32">
      {/* Responsive Placeholder Avatar */}
      <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg shadow-teal-500/30 sm:mb-6 sm:h-28 sm:w-28">
        <svg
          className="h-14 w-14 text-white/90 sm:h-16 sm:w-16"
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

      <hr className="mb-5 w-9/12 max-w-md border-teal-200/70 dark:border-ink-600 sm:mb-8" />

      {/* Personal Info Card: Responsive, scrollable on mobile */}
      <div
        ref={cardRef}
        className="surface-card relative mx-2 flex w-full max-w-md flex-col rounded-3xl p-4 pt-12 sm:p-6 md:max-w-lg sm:mx-0"
        style={{ minHeight: '375px' }}
      >
        {/* Pencil Icon edit button */}
        <div className="absolute right-4 top-4 sm:right-3 sm:top-3">
          <button
            className="cursor-pointer text-teal-500 transition-colors duration-200 hover:text-teal-600 dark:text-teal-300 dark:hover:text-teal-200"
            title="Edit (disabled)"
          >
            <FaPencilAlt size={20} />
          </button>
        </div>
        <h3 className="mb-4 text-center text-base font-bold tracking-wide text-teal-900 dark:text-teal-50 sm:mb-5 sm:text-lg">
          Personal information
        </h3>
        <ul className="flex-1 space-y-2 text-sm text-teal-800 dark:text-teal-100 sm:space-y-3 sm:text-base">
          <li>
            <span className="font-semibold text-teal-900 dark:text-teal-50">
              Full Name:
            </span>{' '}
            {user?.firstName} {user?.lastName}
          </li>
          <li>
            <span className="font-semibold text-teal-900 dark:text-teal-50">
              Date of Birth:
            </span>{' '}
            {user?.dob ? user.dob.split('T')[0] : ''}
          </li>
          <li>
            <span className="font-semibold text-teal-900 dark:text-teal-50">
              Gender:
            </span>{' '}
            {user?.gender}
          </li>
          <li>
            <span className="font-semibold text-teal-900 dark:text-teal-50">
              Email:
            </span>{' '}
            {maskEmail(user?.email)}
          </li>
          <li>
            <span className="font-semibold text-teal-900 dark:text-teal-50">
              Phone Number:
            </span>{' '}
            {'+91 ' + maskPhone(user?.phone)}
          </li>
        </ul>
        {/* Change Password Button, left bottom */}
        <div className="absolute bottom-4 left-4">
          <button
            className="flex cursor-pointer items-center gap-2 px-2 py-2 font-semibold text-teal-600 transition hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200"
            onClick={() => {
              resetPasswordForm();
              setShowPasswordModal(true);
            }}
          >
            <FaLock size={16} />
            Change Password
          </button>
        </div>
        {/* Logout Button, right bottom */}
        <div className="absolute bottom-4 right-4">
          <button
            className="flex cursor-pointer items-center gap-2 px-2 py-2 font-semibold text-rose-500 transition hover:text-rose-600"
            onClick={() => setShowLogoutModal(true)}
          >
            <FaSignOutAlt size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-teal-950/40 backdrop-blur-sm transition-all duration-300 dark:bg-black/50"
            onClick={() => !passwordLoading && setShowPasswordModal(false)}
          ></div>
          <div className="surface-card relative z-60 w-[360px] max-w-sm rounded-3xl px-6 py-8">
            <FaLock className="mx-auto mb-3 text-3xl text-teal-500 dark:text-teal-300" />
            <p className="mb-5 text-center text-lg font-bold text-teal-900 dark:text-teal-50">
              Change Password
            </p>
            <form onSubmit={submitPasswordChange} className="flex flex-col gap-4">
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                className="field"
                autoComplete="current-password"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="field"
                autoComplete="new-password"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="field"
                autoComplete="new-password"
              />
              <div className="mt-2 flex justify-center gap-4">
                <button
                  type="button"
                  className="rounded-xl border-2 border-teal-200 px-4 py-2 font-semibold text-teal-700 transition hover:border-teal-400 dark:border-ink-600 dark:text-teal-100"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-500 px-4 py-2 font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600 disabled:opacity-50"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Saving...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred background */}
          <div
            className="absolute inset-0 bg-teal-950/40 backdrop-blur-sm transition-all duration-300 dark:bg-black/50"
            onClick={() => setShowLogoutModal(false)}
          ></div>
          <div className="surface-card relative z-60 w-[320px] max-w-xs rounded-3xl px-6 py-8 text-center">
            <FaSignOutAlt className="mx-auto mb-3 text-3xl text-rose-500" />
            <p className="mb-4 text-lg font-bold text-teal-900 dark:text-teal-50">
              Are you sure you want to logout?
            </p>
            <div className="mt-2 flex justify-center gap-4">
              <button
                className="rounded-xl border-2 border-teal-200 px-4 py-2 font-semibold text-teal-700 transition hover:border-teal-400 dark:border-ink-600 dark:text-teal-100"
                onClick={() => setShowLogoutModal(false)}
                disabled={loading}
              >
                No
              </button>
              <button
                className="rounded-xl bg-rose-500 px-4 py-2 font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:-translate-y-0.5 hover:bg-rose-600"
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
