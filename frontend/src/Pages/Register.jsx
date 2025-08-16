import axios from "axios";
import React, { useContext, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import gsap from "gsap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName]       = useState("");
  const [lastName, setLastName]         = useState("");
  const [email, setEmail]               = useState("");
  const [phone, setPhone]               = useState("");
  const [aadhaar, setaadhaar]           = useState("");
  const [dob, setDob]                   = useState(null); 
  const [gender, setGender]             = useState("");
  const [password, setPassword]         = useState("");
  const [otp, setOtp]                   = useState("");
  const [step, setStep]                 = useState(1); 
  const [tempUserData, setTempUserData] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);



  const navigateTo = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray(".register-animate"), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
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
      toast.error("Date of Birth cannot be in the future.");
      return;
    }

    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const dobIsoString = dob ? dob.toISOString().split("T")[0] : "";
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/user/patient/register`,
        {
          firstName,
          lastName,
          email,
          phone,
          aadhaar,
          dob: dobIsoString,
          gender,
          password,
          role: "Patient",
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
  
      setTempUserData({
        firstName,
        lastName,
        email,
        phone,
        aadhaar,
        dob: dobIsoString,
        gender,
        password,
        role: "Patient",
      });
  
      toast.success(data.message);
      setStep(2);
  
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
          headers: { "Content-Type": "application/json" },
        }
      );
  
      toast.success(data.message);
      setIsAuthenticated(true);
      navigateTo("/"); 
  
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setaadhaar("");
      setDob(null);
      setGender("");
      setPassword("");
      setOtp("");
      setStep(1);
      setTempUserData(null);
  
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
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
          headers: { "Content-Type": "application/json" },
        }
      );
  
      toast.success(data.message);
      setResendCooldown(30); 
  
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };
  
  


  return (
    <section className="text-white min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 px-4">
      <div
        ref={formRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full p-8"
      >
        <h2 className="register-animate text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-4">
          Create Your Account
        </h2>
        <p className="register-animate text-center text-gray-600 dark:text-gray-300 mb-8">
          Join <span className="font-semibold">MedHaven</span> today. Book appointments, access health records, and connect with our medical team—securely and easily.
        </p>

        
        <form onSubmit={step === 1 ? handleRegistration : handleVerifyOtp} className="space-y-6">

          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="register-animate input-field"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="register-animate input-field"
            />
          </div>

          {/* Email/Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-animate input-field"
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="register-animate input-field"
            />
          </div>

          {/* Aadhaar and Date of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="number"
              placeholder="Aadhaar Number"
              value={aadhaar}
              onChange={(e) => setaadhaar(e.target.value)}
              className="register-animate input-field"
            />
            <div className="register-animate overflow-visible relative react-datepicker-popper">
              <DatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                placeholderText="Date of Birth"
                maxDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className=" input-field w-full px-4 py-3 text-gray-900 dark:text-white rounded-lg  bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-white outline-none transition placeholder-gray-500 dark:placeholder-gray-300"
                showMonthDropdown
                showYearDropdown
                dropdownMode="scroll"
              />
            </div>
          </div>

          {/* Gender & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="register-animate input-field select-dark"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-animate input-field"
            />
          </div>

          {/* Already Registered */}
          <div className="register-animate flex items-center justify-center text-sm gap-2">
            <span className="text-gray-700 dark:text-gray-200">Already Registered?</span>
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Login Now
            </Link>
          </div>
              <div className="register-animate text-center">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-center mb-4 text-gray-700 dark:text-gray-300">
                Enter the OTP sent to <strong>{tempUserData?.email}</strong>
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field w-full px-4 py-3 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-white outline-none transition placeholder-gray-500 dark:placeholder-gray-300"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="w-[48%] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition"
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className={`w-[48%] px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition 
                    ${resendCooldown > 0 ? "bg-gray-400 cursor-not-allowed" : "border border-blue-600 text-blue-600 hover:bg-blue-50"}`}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </>
          )}

        </form>

      </div>

      <style>{`
        .input-field {
          border-radius: 10px; 
          padding: 10px;
        }
        .select-dark option {
          background-color: #1f2937;
          color: white;
        }
        .react-datepicker-popper {
          z-index: !important;
        }
      `}</style>
    </section>
  );
};

export default Register;
