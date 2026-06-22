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
    <section className="grid-bg flex min-h-screen items-center justify-center px-4 py-24">
      <div
        ref={formRef}
        className="surface-card w-full max-w-md rounded-3xl p-8"
      >
        <div className="login-animate mb-4 flex justify-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/30">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
              <path d="M11 2h2v9h9v2h-9v9h-2v-9H2v-2h9z" />
            </svg>
          </span>
        </div>
        <h2 className="login-animate mb-2 text-center text-3xl font-extrabold tracking-tight text-teal-900 dark:text-teal-50">
          Welcome back
        </h2>
        <p className="login-animate mb-6 text-center text-teal-700/80 dark:text-teal-100/70">
          Sign in to <span className="font-semibold">MedHaven</span> to manage
          your appointments and connect with your care team.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-animate field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-animate field"
          />

          <div className="login-animate text-right text-sm">
            <Link
              to="/forgot-password"
              className="font-semibold text-teal-600 hover:underline dark:text-teal-300"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="login-animate flex items-center justify-center gap-2 text-sm">
            <span className="text-teal-700/80 dark:text-teal-100/70">
              Not Registered?
            </span>
            <Link
              to="/register"
              className="font-semibold text-teal-600 hover:underline dark:text-teal-300"
            >
              Register Now
            </Link>
          </div>
          <div className="login-animate">
            <button
              type="submit"
              className="anim-pulse w-full rounded-2xl bg-teal-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600"
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
