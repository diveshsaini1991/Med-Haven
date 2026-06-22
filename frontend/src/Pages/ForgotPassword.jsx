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
    <section className="grid-bg flex min-h-screen items-center justify-center px-4 py-24">
      <div
        ref={formRef}
        className="surface-card w-full max-w-md rounded-3xl p-8"
      >
        <h2 className="forgot-animate mb-4 text-center text-3xl font-extrabold tracking-tight text-teal-900 dark:text-teal-50">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={requestOtp} className="space-y-5">
            <p className="forgot-animate mb-2 text-center text-teal-700/80 dark:text-teal-100/70">
              Enter your registered email and we'll send you a one-time
              password to reset it.
            </p>
            <input
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="forgot-animate field"
            />
            <button
              type="submit"
              disabled={loading}
              className="forgot-animate w-full rounded-2xl bg-teal-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={continueToReset} className="space-y-5">
            <p className="mb-2 text-center text-teal-700/80 dark:text-teal-100/70">
              Enter the OTP sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="field"
            />
            <div className="flex justify-between gap-3">
              <button
                type="submit"
                className="w-[48%] rounded-2xl bg-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                className={`w-[48%] rounded-2xl px-6 py-3 font-bold transition hover:-translate-y-0.5 ${
                  resendCooldown > 0
                    ? 'cursor-not-allowed border-2 border-teal-100 text-teal-400 dark:border-ink-600 dark:text-teal-200/50'
                    : 'border-2 border-teal-200 text-teal-700 hover:border-teal-400 dark:border-ink-600 dark:text-teal-100'
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
            <p className="mb-2 text-center text-teal-700/80 dark:text-teal-100/70">
              Set a new password for <strong>{email}</strong>
            </p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="field"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="field"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-teal-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <span className="text-teal-700/80 dark:text-teal-100/70">
            Remembered your password?
          </span>
          <Link
            to="/login"
            className="font-semibold text-teal-600 hover:underline dark:text-teal-300"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
