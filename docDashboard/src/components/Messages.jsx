import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Context } from '../main';
import { Navigate } from 'react-router-dom';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${VITE_BACKEND_URL}/api/v1/message/get`,
          {
            withCredentials: true,
          }
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
        toast.error('Failed to load messages.');
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={'/login'} />;
  }

  return (
    <section className="ml-[120px] bg-gray-200 p-10 h-screen rounded-tl-[50px] rounded-bl-[50px]  md:rounded-none md:p-5 overflow-auto">
      <h1 className="text-3xl font-bold text-[#3939d9f2] mb-8">MESSAGES</h1>
      <div className="flex flex-col gap-5">
        {messages && messages.length > 0 ? (
          messages.map((element) => (
            <div
              key={element._id}
              className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-3"
            >
              <p>
                <span className="font-semibold">First Name: </span>
                <span>{element.firstName}</span>
              </p>
              <p>
                <span className="font-semibold">Last Name: </span>
                <span>{element.lastName}</span>
              </p>
              <p>
                <span className="font-semibold">Email: </span>
                <span>{element.email}</span>
              </p>
              <p>
                <span className="font-semibold">Phone: </span>
                <span>{element.phone}</span>
              </p>
              <p>
                <span className="font-semibold">Message: </span>
                <span>{element.message}</span>
              </p>
              <p>
                <span className="font-semibold">To: </span>
                <span>
                  {element.to === 'Admin'
                    ? 'Admin'
                    : `Dr. ${element.doctor.firstName} ${element.doctor.lastName}`}
                </span>
              </p>
            </div>
          ))
        ) : (
          <h1 className="text-center text-gray-600 mt-10 text-xl">
            No Messages!
          </h1>
        )}
      </div>
    </section>
  );
};

export default Messages;
