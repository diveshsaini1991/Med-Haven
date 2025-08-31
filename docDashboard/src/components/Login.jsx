import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Context } from '../main';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          `${VITE_BACKEND_URL}/api/v1/user/login`,
          { email, password, confirmPassword, role: 'Doctor' },
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          navigateTo('/');
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center px-5"
      style={{ backgroundColor: 'rgba(57, 57, 217, 0.95)' }}
    >
      <div className="max-w-xl w-full bg-[#e5e5e5] rounded-[50px_0_0_50px] p-10 md:rounded-2xl md:m-5 flex flex-col items-center">
        <img src="/logo.png" alt="logo" className="w-1/3 mb-6 md:w-full" />
        <h1 className="text-3xl text-[#111111] font-bold mb-8">
          WELCOME TO MedHaven
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-lg">
          Only Doctors Are Allowed To Access These Resources!
        </p>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-8 w-full max-w-md"
        >
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-2xl p-4 pl-10 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-2xl p-4 pl-10 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-2xl p-4 pl-10 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-12 py-3 rounded-xl bg-gradient-to-tr from-[#9083d5] to-[#271776ca] text-white font-bold text-2xl hover:from-[#7a6bcf] hover:to-[#211565] transition"
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
