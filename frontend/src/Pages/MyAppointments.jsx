import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import gsap from "gsap";

const MyAppointments = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cardsContainerRef = useRef(null);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (
      !loading &&
      appointments.length > 0 &&
      cardsContainerRef.current &&
      cardsContainerRef.current.querySelectorAll
    ) {
      const cards = cardsContainerRef.current.querySelectorAll(".appointment-card");
      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "all", 
        });
      }
    }
  }, [loading, appointments]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchAppointments = async () => {
      try {
        const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const { data } = await axios.get(
          `${VITE_BACKEND_URL}/api/v1/appointment/myappointments`,
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; 
  }

  // Check if appointment date is in the future
  const canDeleteOrEditAppointment = (appointmentDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset to midnight for date-only comparison
    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate >= today;
  };
  

  const handleDelete = async (id, appointmentDate) => {
    if (!canDeleteOrEditAppointment(appointmentDate)) {
      toast.error("You cannot delete past appointments.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      await axios.delete(`${VITE_BACKEND_URL}/api/v1/appointment/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Appointment deleted successfully");
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    }
  };

  const handleEdit = (id) => {
    navigate(`/appointment/edit/${id}`);
  };

  const getStatusClass = (status) => {
    if (!status) return "text-blue-600"; 
    switch (status.toLowerCase()) {
      case "accepted":
        return "text-green-600 font-semibold";
      case "rejected":
        return "text-red-600 font-semibold";
      case "updated":
        return "text-yellow-500 font-semibold";
      case "pending":
      default:
        return "text-blue-600 font-semibold";
    }
  };
  

  return (
    <div className="bg-gray-800 pt-3 text-gray-300">
      <section className="max-w-5xl mx-auto p-4 min-h-96 bg-gray-800">
        <h1 className="text-3xl font-bold text-center my-16 text-blue-700 dark:text-blue-400">
          My Appointments
        </h1>

        {loading ? (
          <p className="text-center">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No appointments found.</p>
        ) : (
          <div ref={cardsContainerRef} className="space-y-4">
            {appointments.map((appt) => (
              <div
              key={appt._id}
              className="appointment-card p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
            >
              <div className="flex-1">
                  <p>
                  <span className="font-semibold">Patient:</span> {appt.firstName} {appt.lastName}
                  </p>
                  <p>
                    <span className="font-semibold">Appointment Date:</span>{" "}
                    {new Date(appt.appointment_date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Doctor:</span> {appt.doctor.firstName} {appt.doctor.lastName}
                  </p>
                  <p>
                    <span className="font-semibold">Department:</span> {appt.department}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span> {appt.address}
                  </p>
                  <p>
                    <span className="font-semibold">Visited Before:</span> {appt.hasVisited ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={getStatusClass(appt.status)}>{appt.status || "Pending"}</span>
                  </p>
                </div>
            
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(appt._id)}
                  disabled={!canDeleteOrEditAppointment(appt.appointment_date)}
                  className={`px-4 py-2 rounded-lg text-white font-semibold shadow-lg transition ${
                    canDeleteOrEditAppointment(appt.appointment_date)
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  aria-label="Edit Appointment"
                  title={canDeleteOrEditAppointment(appt.appointment_date) ? "Edit Appointment" : "Cannot edit past appointment"}
                >
                  Edit
                </button>
            
                <button
                  onClick={() => handleDelete(appt._id, appt.appointment_date)}
                  disabled={!canDeleteOrEditAppointment(appt.appointment_date)}
                  className={`px-4 py-2 rounded-lg text-white font-semibold shadow-lg transition ${
                    canDeleteOrEditAppointment(appt.appointment_date)
                      ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  aria-label="Delete Appointment"
                  title={canDeleteOrEditAppointment(appt.appointment_date) ? "Delete Appointment" : "Cannot delete past appointment"}
                >
                  Delete
                </button>
              </div>
            </div>
            
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyAppointments;
