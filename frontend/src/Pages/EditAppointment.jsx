import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AppointmentForm from "../components/AppointmentForm";
import { Context } from "../main";

const EditAppointment = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [appt, setAppt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    const fetch = async () => {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.get(
        `${VITE_BACKEND_URL}/api/v1/appointment/myappointments`,
        { withCredentials: true }
      );
      const found = data.appointments.find(a => a._id === id);
      if (!found) { toast.error("Appointment not found"); navigate("/myappointments"); return; }
      setAppt({
        ...found,
        dob: found.dob ? new Date(found.dob).toISOString().split("T")[0] : "",
        appointment_date: found.appointment_date,
        doctor_firstName: found.doctor.firstName,
        doctor_lastName: found.doctor.lastName
      });
      setLoading(false);
    };
    fetch();
  }, [id, isAuthenticated, navigate]);

  const handleUpdate = async (formData) => {
    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      await axios.put(`${VITE_BACKEND_URL}/api/v1/appointment/patient/update/${id}`,
        formData, { withCredentials: true });
      toast.success("Appointment updated!");
      navigate("/myappointments");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating appointment");
    }
  };

  const handleCancel = () => {
    navigate("/myappointments");
  };

  if (loading || !appt) return <div className="text-center py-24">Loading appointment info...</div>;

  return (
    <AppointmentForm
      initialValues={appt}
      submitText="Update Appointment"
      onSubmit={handleUpdate}
      isEdit={true}
      onCancel={handleCancel}
    />
  );
};

export default EditAppointment;
