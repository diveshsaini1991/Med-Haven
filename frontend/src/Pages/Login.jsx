import axios from 'axios';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Context } from '../main';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigateTo = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    document.title = 'MedHaven - Login';
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.login-animate');
      gsap.from(targets, {
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/user/login`,
        { email, password, role: 'Patient' },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      toast.success(data.message);
      setIsAuthenticated(true);
      navigateTo('/');
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 px-4">
      <div
        ref={formRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-8"
      >
        <h2 className="login-animate text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-4">
          Sign In
        </h2>
        <p className="login-animate text-center text-gray-600 dark:text-gray-300 mb-6">
          Welcome back to <span className="font-semibold">MedHaven</span>.
          Please enter your details to log in to your account and manage your
          appointments.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-animate w-full px-4 py-3 border-2 border-white text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-animate w-full px-4 py-3 border-2 border-white text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-300"
          />

          <div className="login-animate flex items-center justify-center text-sm gap-2">
            <span className="text-gray-700 dark:text-gray-200">
              Not Registered?
            </span>
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Register Now
            </Link>
          </div>
          <div className="login-animate">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition  border-2 border-white"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
