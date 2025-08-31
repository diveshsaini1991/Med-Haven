import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../main';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoCheckCircleFill } from 'react-icons/go';
import { AiFillCloseCircle } from 'react-icons/ai';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `${VITE_BACKEND_URL}/api/v1/appointment/get`,
          {
            withCredentials: true,
          }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `${VITE_BACKEND_URL}/api/v1/appointment/doctor/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={'/login'} />;
  }

  return (
    <section className="ml-[120px] bg-gray-200 p-10 rounded-tl-[50px] rounded-bl-[50px]  md:rounded-none md:p-5">
      {/* Banner Section */}
      <div className="flex flex-wrap gap-5 mb-5 ">
        {/* First Box */}
        <div className="flex-2 flex items-center rounded-2xl bg-[#b5b5ff] p-5">
          <img
            src="/doc.png"
            alt="docImg"
            className="h-72 flex-1 object-contain"
          />
          <div className="flex-2 ml-5">
            <div className="flex items-center text-4xl mb-3">
              <p className="mr-2">Hello,</p>
              <h5 className="text-[#ff008d] font-semibold">
                {admin && `${admin.firstName} ${admin.lastName}`}
              </h5>
            </div>
            <p className="text-base">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis,
              nam molestias. Eaque molestiae ipsam commodi neque. Assumenda
              repellendus necessitatibus itaque.
            </p>
          </div>
        </div>
        {/* Second Box */}
        <div className="flex-1 rounded-2xl p-5 flex flex-col justify-center gap-3 bg-[#3939d9f2] text-white">
          <p className="text-2xl font-semibold">Total Appointments</p>
          <h3 className="text-4xl font-bold tracking-wider">
            {appointments.length}
          </h3>
        </div>
        {/* You can add third box here if needed */}
      </div>

      {/* Appointments table */}
      <div className="bg-white rounded-2xl p-10 h-[65vh] overflow-auto">
        <h5 className="text-2xl tracking-widest mb-5 text-gray-900">
          Appointments
        </h5>
        <table className="w-full text-gray-900 text-lg">
          <thead className="border-b">
            <tr>
              <th className="py-3">Patient</th>
              <th className="py-3">Date</th>
              <th className="py-3">Gender</th>
              <th className="py-3">Email</th>
              <th className="py-3">Status</th>
              <th className="py-3">Visited</th>
            </tr>
          </thead>
          <tbody>
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id} className="border-b last:border-none">
                  <td className="py-3">{`${appointment.firstName} ${appointment.lastName}`}</td>
                  <td className="py-3">
                    {appointment.appointment_date.substring(0, 16)}
                  </td>
                  <td className="py-3">{appointment.gender}</td>
                  <td className="py-3">{appointment.email}</td>
                  <td className="py-3 text-center">
                    <select
                      className={`text-lg font-semibold rounded px-3 py-1 ${
                        appointment.status === 'Pending'
                          ? 'text-yellow-500'
                          : appointment.status === 'Accepted'
                            ? 'text-green-600'
                            : 'text-red-600'
                      } focus:outline-none`}
                      value={appointment.status}
                      onChange={(e) =>
                        handleUpdateStatus(appointment._id, e.target.value)
                      }
                    >
                      <option value="Pending" className="text-yellow-500">
                        Pending
                      </option>
                      <option value="Accepted" className="text-green-600">
                        Accepted
                      </option>
                      <option value="Rejected" className="text-red-600">
                        Rejected
                      </option>
                    </select>
                  </td>
                  <td className="py-3 text-center">
                    {appointment.hasVisited === true ? (
                      <GoCheckCircleFill
                        className="text-green-600 mx-auto"
                        size={20}
                      />
                    ) : (
                      <AiFillCloseCircle
                        className="text-red-600 mx-auto"
                        size={20}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No Appointments Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
