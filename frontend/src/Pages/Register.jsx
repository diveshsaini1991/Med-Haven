import axios from 'axios';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Context } from '../main';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [tempUserData, setTempUserData] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigateTo = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    document.title = 'MedHaven - Register New User';
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray('.register-animate'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

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

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  const handleRegistration = async (e) => {
    e.preventDefault();
    const today = new Date();
    if (dob && dob > today) {
      toast.error('Date of Birth cannot be in the future.');
      return;
    }

    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const dobIsoString = dob ? dob.toISOString().split('T')[0] : '';
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/user/patient/register`,
        {
          firstName,
          lastName,
          email,
          phone,
          dob: dobIsoString,
          gender,
          password,
          role: 'Patient',
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setTempUserData({
        firstName,
        lastName,
        email,
        phone,
        dob: dobIsoString,
        gender,
        password,
        role: 'Patient',
      });

      toast.success(data.message);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/user/patient/verify-otp`,
        {
          ...tempUserData,
          otp,
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      toast.success(data.message);
      setIsAuthenticated(true);
      navigateTo('/');

      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setDob(null);
      setGender('');
      setPassword('');
      setOtp('');
      setStep(1);
      setTempUserData(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/user/patient/resend-otp`,
        { email },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      toast.success(data.message);
      setResendCooldown(30);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <section className="grid-bg flex min-h-screen items-center justify-center px-4 py-24">
      <div
        ref={formRef}
        className="surface-card w-full max-w-2xl rounded-3xl p-8"
      >
        <h2 className="register-animate mb-2 text-center text-3xl font-extrabold tracking-tight text-teal-900 dark:text-teal-50">
          Create Your Account
        </h2>
        <p className="register-animate mb-8 text-center text-teal-700/80 dark:text-teal-100/70">
          Join <span className="font-semibold">MedHaven</span> today. Book
          appointments, access health records, and connect with our medical
          team—securely and easily.
        </p>

        <form
          onSubmit={step === 1 ? handleRegistration : handleVerifyOtp}
          className="space-y-6"
        >
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="register-animate field"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="register-animate field"
                />
              </div>

              {/* Email/Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="register-animate field"
                />
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="register-animate field"
                />
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="register-animate overflow-visible relative react-datepicker-popper">
                  <DatePicker
                    selected={dob}
                    onChange={(date) => setDob(date)}
                    placeholderText="Date of Birth"
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    className="field"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="register-animate field"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/*Password */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                <input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="register-animate field"
                />
              </div>

              {/* Already Registered */}
              <div className="register-animate flex items-center justify-center gap-2 text-sm">
                <span className="text-teal-700/80 dark:text-teal-100/70">
                  Already Registered?
                </span>
                <Link
                  to="/login"
                  className="font-semibold text-teal-600 hover:underline dark:text-teal-300"
                >
                  Login Now
                </Link>
              </div>
              <div className="register-animate text-center">
                <button
                  type="submit"
                  className="anim-pulse w-full rounded-2xl bg-teal-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-4 text-center text-teal-700/80 dark:text-teal-100/70">
                Enter the OTP sent to <strong>{tempUserData?.email}</strong>
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="field"
              />
              <div className="mt-4 flex justify-between gap-3">
                <button
                  type="submit"
                  className="w-[48%] rounded-2xl bg-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600"
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
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
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default Register;
