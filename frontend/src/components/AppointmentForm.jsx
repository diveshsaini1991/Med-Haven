import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const departmentsArray = [
  'Pediatrics',
  'Orthopedics',
  'Cardiology',
  'Neurology',
  'Oncology',
  'Radiology',
  'Physical Therapy',
  'Dermatology',
  'ENT',
];

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  appointment_date: '',
  department: 'Pediatrics',
  doctor_firstName: '',
  doctor_lastName: '',
  address: '',
  hasVisited: false,
};

const AppointmentForm = ({
  initialValues = defaultValues,
  submitText = 'Get Appointment',
  onSubmit,
  isEdit = false,
  onCancel,
}) => {
  const [form, setForm] = useState(initialValues);
  const [doctors, setDoctors] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.get(
        `${VITE_BACKEND_URL}/api/v1/user/doctors`,
        { withCredentials: true }
      );
      setDoctors(data.doctors);
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray('.form-animate'), {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDoctorChange = (e) => {
    const [firstName, lastName] = e.target.value.split(' ');
    setForm((prev) => ({
      ...prev,
      doctor_firstName: firstName || '',
      doctor_lastName: lastName || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!form.dob) {
      toast.error('Please select your Date of Birth.');
      return;
    }
    if (!form.appointment_date) {
      toast.error('Please select your Appointment Date.');
      return;
    }

    const dobDate = new Date(form.dob);
    const appointmentDateObj = new Date(form.appointment_date);

    if (dobDate > today) {
      toast.error('Date of Birth cannot be in the future.');
      return;
    }
    if (appointmentDateObj < today) {
      toast.error('Appointment Date cannot be in the past.');
      return;
    }

    if (onSubmit) {
      await onSubmit(form);
      return;
    }

    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      await axios.post(
        `${VITE_BACKEND_URL}/api/v1/appointment/post`,
        {
          ...form,
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      toast.success('Appointment booked successfully!');

      setForm(defaultValues);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div ref={formRef} className="surface-card rounded-3xl p-8 md:p-12">
          <h2 className="form-animate mb-10 text-center text-3xl font-bold text-teal-900 dark:text-teal-50">
            {isEdit ? 'Edit Appointment' : 'Book Your Appointment'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First/Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="form-animate field"
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="form-animate field"
              />
            </div>

            {/* Email/Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="form-animate field"
              />
              <input
                name="phone"
                type="number"
                placeholder="Mobile Number"
                value={form.phone}
                onChange={handleChange}
                className="form-animate field"
              />
            </div>

            {/* Date of Birth */}
            <div className="grid grid-cols-1 gap-6">
              <DatePicker
                selected={form.dob ? new Date(form.dob) : null}
                onChange={(date) =>
                  setForm((prev) => ({
                    ...prev,
                    dob: date ? date.toISOString().split('T')[0] : '',
                  }))
                }
                placeholderText="Date of Birth"
                maxDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="field form-animate"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>

            {/* Gender / Appointment Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="form-animate field hover:cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <DatePicker
                selected={
                  form.appointment_date ? new Date(form.appointment_date) : null
                }
                onChange={(date) =>
                  setForm((prev) => ({
                    ...prev,
                    appointment_date: date
                      ? date.toISOString().split('T')[0]
                      : '',
                  }))
                }
                placeholderText="Appointment Date"
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="field form-animate"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>

            {/* Department / Doctor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="form-animate field hover:cursor-pointer"
              >
                {departmentsArray.map((depart, index) => (
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                ))}
              </select>
              <select
                value={`${form.doctor_firstName} ${form.doctor_lastName}`}
                onChange={handleDoctorChange}
                className="form-animate field hover:cursor-pointer"
                disabled={!form.department}
              >
                <option value="">Select Doctor</option>
                {doctors
                  .filter((doc) => doc.doctorDepartment === form.department)
                  .map((doc, idx) => (
                    <option
                      value={`${doc.firstName} ${doc.lastName}`}
                      key={idx}
                    >
                      {doc.firstName} {doc.lastName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Address */}
            <textarea
              name="address"
              rows={5}
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="form-animate field resize-none"
            />

            {/* Visited Before */}
            <div className="form-animate flex items-center space-x-3">
              <label className="text-teal-700/80 dark:text-teal-100/70">
                Visited before?
              </label>
              <input
                name="hasVisited"
                type="checkbox"
                checked={form.hasVisited}
                onChange={handleChange}
                className="h-5 w-5 accent-teal-500"
              />
            </div>

            {/* Submit Button */}
            <div className="form-animate flex flex-col text-center md:flex-row md:justify-center md:space-x-4">
              <button
                type="submit"
                className={`rounded-2xl px-8 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 ${
                  isEdit
                    ? 'w-full bg-sand-500 shadow-sand-500/30 hover:bg-sand-400 md:w-1/2'
                    : 'anim-pulse w-full bg-teal-500 shadow-teal-500/30 hover:bg-teal-600'
                }`}
              >
                {submitText}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className="mt-4 w-full rounded-2xl border-2 border-teal-200 px-8 py-3.5 font-bold text-teal-700 transition hover:-translate-y-0.5 hover:border-teal-400 dark:border-ink-600 dark:text-teal-100 md:mt-0 md:w-1/2"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
