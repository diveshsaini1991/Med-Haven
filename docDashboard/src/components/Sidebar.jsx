import React, { useContext, useState, useEffect } from 'react';
import { TiHome } from 'react-icons/ti';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { AiFillMessage } from 'react-icons/ai';
import { MdChatBubbleOutline } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../main';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  {
    label: 'Home',
    icon: <TiHome />,
    to: '/',
  },
  {
    label: 'Messages',
    icon: <AiFillMessage />,
    to: '/messages',
  },
  {
    label: 'Chat',
    icon: <MdChatBubbleOutline />,
    to: '/chat',
  },
];

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigateTo = useNavigate();
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => {
    setShow(false);
  }, [location]);

  // Logout handler
  const handleLogout = async () => {
    await axios
      .get(`${VITE_BACKEND_URL}/api/v1/user/doctor/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Logout failed');
      });
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 h-full w-30 flex flex-col justify-center items-center 
          text-white bg-transparent p-[70px_0] 
          transition-transform duration-300 
          ${show ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:bg-[#3939d9f2]
        `}
      >
        <div className="flex flex-col gap-8">
          {NAV_LINKS.map((link, idx) => (
            <span
              key={link.label + idx}
              className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-white hover:text-[#3939d9f2] rounded-md transition"
              onClick={() => {
                if (link.to) navigateTo(link.to);
                setShow(false);
              }}
              title={link.label}
            >
              {React.cloneElement(link.icon, { className: 'w-full h-full' })}
            </span>
          ))}
          <span
            className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-white hover:text-[#3939d9f2] rounded-md transition"
            onClick={() => {
              handleLogout();
              setShow(false);
            }}
            title="Logout"
          >
            <RiLogoutBoxFill className="w-full h-full" />
          </span>
        </div>
      </nav>

      {/* Hamburger button for small screens */}
      <div
        className="
          fixed top-7 left-10 z-50 bg-[#3939d9f2] text-white rounded-md 
          w-10 h-10 flex justify-center items-center cursor-pointer 
          md:hidden
        "
        onClick={() => setShow(!show)}
      >
        <GiHamburgerMenu className="w-6 h-6" />
      </div>
    </>
  );
};

export default Sidebar;
