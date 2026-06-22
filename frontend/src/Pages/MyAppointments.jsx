import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../main';
import gsap from 'gsap';

const MyAppointments = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cardsContainerRef = useRef(null);

  useEffect(() => {
    document.title = 'MedHaven - My Appointments';
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (
      !loading &&
      appointments.length > 0 &&
      cardsContainerRef.current &&
      cardsContainerRef.current.querySelectorAll
    ) {
      const cards =
        cardsContainerRef.current.querySelectorAll('.appointment-card');
      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'all',
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
        toast.error(
          error.response?.data?.message || 'Failed to load appointments'
        );
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
      toast.error('You cannot delete past appointments.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this appointment?'))
      return;

    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      await axios.delete(
        `${VITE_BACKEND_URL}/api/v1/appointment/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success('Appointment deleted successfully');
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete appointment'
      );
    }
  };

  const handleEdit = (id) => {
    navigate(`/appointment/edit/${id}`);
  };

  const getStatusClass = (status) => {
    if (!status) return 'text-teal-600 font-semibold';
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'text-emerald-500 font-semibold';
      case 'rejected':
        return 'text-rose-500 font-semibold';
      case 'updated':
        return 'text-amber-500 font-semibold';
      case 'pending':
      default:
        return 'text-teal-600 dark:text-teal-300 font-semibold';
    }
  };

  return (
    <div className="min-h-screen pt-20 text-teal-900 dark:text-teal-50">
      <section className="mx-auto min-h-96 max-w-5xl p-4">
        <h1 className="my-12 text-center text-3xl font-extrabold tracking-tight text-teal-900 dark:text-teal-50">
          My Appointments
        </h1>

        {loading ? (
          <p className="text-center text-teal-700/80 dark:text-teal-100/70">
            Loading appointments...
          </p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-teal-700/70 dark:text-teal-200/60">
            No appointments found.
          </p>
        ) : (
          <div ref={cardsContainerRef} className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="appointment-card surface-card flex flex-col items-start justify-between space-y-4 rounded-3xl p-6 md:flex-row md:items-center md:space-y-0"
              >
                <div className="flex-1 space-y-1 text-teal-800 dark:text-teal-100">
                  <p>
                    <span className="font-semibold text-teal-900 dark:text-teal-50">
                      Patient:
                    </span>{' '}
                    {appt.firstName} {appt.lastName}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-900 dark:text-teal-50">
                      Appointment Date:
                    </span>{' '}
                    {new Date(appt.appointment_date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-900 dark:text-teal-50">
                      Doctor:
                    </span>{' '}
                    {appt.doctor.firstName} {appt.doctor.lastName}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-900 dark:text-teal-50">
                      Department:
                    </span>{' '}
                    {appt.department}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-900 dark:text-teal-50">
                      Address:
                    </span>{' '}
                    {appt.address}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-900 dark:text-teal-50">
                      Visited Before:
                    </span>{' '}
                    {appt.hasVisited ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-900 dark:text-teal-50">
                      Status:
                    </span>{' '}
                    <span className={getStatusClass(appt.status)}>
                      {appt.status || 'Pending'}
                    </span>
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(appt._id)}
                    disabled={
                      !canDeleteOrEditAppointment(appt.appointment_date)
                    }
                    className={`rounded-xl px-5 py-2 font-bold text-white shadow-lg transition hover:-translate-y-0.5 ${
                      canDeleteOrEditAppointment(appt.appointment_date)
                        ? 'cursor-pointer bg-teal-500 shadow-teal-500/30 hover:bg-teal-600'
                        : 'cursor-not-allowed bg-teal-900/30 dark:bg-ink-600'
                    }`}
                    aria-label="Edit Appointment"
                    title={
                      canDeleteOrEditAppointment(appt.appointment_date)
                        ? 'Edit Appointment'
                        : 'Cannot edit past appointment'
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(appt._id, appt.appointment_date)
                    }
                    disabled={
                      !canDeleteOrEditAppointment(appt.appointment_date)
                    }
                    className={`rounded-xl px-5 py-2 font-bold text-white shadow-lg transition hover:-translate-y-0.5 ${
                      canDeleteOrEditAppointment(appt.appointment_date)
                        ? 'cursor-pointer bg-rose-500 shadow-rose-500/30 hover:bg-rose-600'
                        : 'cursor-not-allowed bg-teal-900/30 dark:bg-ink-600'
                    }`}
                    aria-label="Delete Appointment"
                    title={
                      canDeleteOrEditAppointment(appt.appointment_date)
                        ? 'Delete Appointment'
                        : 'Cannot delete past appointment'
                    }
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
