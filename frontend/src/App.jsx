import React, { useContext, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Home from './Pages/Home';
import Appointment from './Pages/Appointment';
import AboutUs from './Pages/AboutUs';
import Register from './Pages/Register';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Context } from './main';
import Login from './Pages/Login';
import MyAppointments from './Pages/MyAppointments';
import EditAppointment from './Pages/EditAppointment';
import Chat from './Pages/Chat';

const AppContent = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(
          `${VITE_BACKEND_URL}/api/v1/user/patient/me`,
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated, setIsAuthenticated, setUser]);

  return (
    <>
      {location.pathname !== '/chat' && <Navbar />}

      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/myappointments" element={<MyAppointments />} />
        <Route path="/appointment/edit/:id" element={<EditAppointment />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {location.pathname !== '/chat' && <Footer />}
      <ToastContainer position="top-center" />
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
