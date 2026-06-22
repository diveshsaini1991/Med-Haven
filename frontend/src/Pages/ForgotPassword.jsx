import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigateTo = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    document.title = 'MedHaven - Forgot Password';
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray('.forgot-animate'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, formRef);
    return () => ctx.revert();
  }, [step]);

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const requestOtp = async (e) => {
    e?.preventDefault();
    if (!email) {
      toast.error('Please enter your registered email.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/user/patient/forgot-password`,
        { email },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      toast.success(data.message);
      setStep(2);
      setResendCooldown(30);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    await requestOtp();
  };

  const continueToReset = (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP sent to your email.');
      return;
    }
    setStep(3);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/user/patient/reset-password`,
        { email, otp, newPassword },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      toast.success(data.message);
      navigateTo('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      // Invalid/expired OTP — send the user back to the OTP step.
      if (error.response?.data?.message?.toLowerCase().includes('otp')) {
        setStep(2);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 px-4">
      <div
        ref={formRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-8"
      >
        <h2 className="forgot-animate text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-4">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={requestOtp} className="space-y-5">
            <p className="forgot-animate text-center text-gray-600 dark:text-gray-300 mb-2">
              Enter your registered email and we'll send you a one-time
              password to reset it.
            </p>
            <input
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="forgot-animate w-full px-4 py-3 border-2 border-white text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="forgot-animate w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition border-2 border-white disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={continueToReset} className="space-y-5">
            <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
              Enter the OTP sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-gray-800 border-2 border-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-500 dark:placeholder-gray-300"
            />
            <div className="flex justify-between gap-3">
              <button
                type="submit"
                className="w-[48%] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                className={`w-[48%] px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition ${
                  resendCooldown > 0
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword} className="space-y-5">
            <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
              Set a new password for <strong>{email}</strong>
            </p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-gray-800 border-2 border-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-500 dark:placeholder-gray-300"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-gray-800 border-2 border-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-500 dark:placeholder-gray-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition border-2 border-white disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="flex items-center justify-center text-sm gap-2 mt-6">
          <span className="text-gray-700 dark:text-gray-200">
            Remembered your password?
          </span>
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
