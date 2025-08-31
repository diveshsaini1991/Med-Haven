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
  aadhaar: '',
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
    <section className="text-white relative py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={formRef}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 md:p-12"
        >
          <h2 className="form-animate text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-10">
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
                className="form-animate input-field"
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="form-animate input-field"
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
                className="form-animate input-field"
              />
              <input
                name="phone"
                type="number"
                placeholder="Mobile Number"
                value={form.phone}
                onChange={handleChange}
                className="form-animate input-field"
              />
            </div>

            {/* Aadhaar / Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="aadhaar"
                type="number"
                placeholder="Aadhaar"
                value={form.aadhaar}
                onChange={handleChange}
                className="form-animate input-field"
              />
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
                className="input-field form-animate"
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
                className="form-animate input-field select-dark"
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
                className="input-field form-animate"
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
                className="form-animate input-field select-dark"
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
                className="form-animate input-field select-dark"
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
              className="form-animate input-field resize-none w-full"
            />

            {/* Visited Before */}
            <div className="form-animate flex items-center space-x-3">
              <label className="text-gray-700 dark:text-gray-200">
                Visited before?
              </label>
              <input
                name="hasVisited"
                type="checkbox"
                checked={form.hasVisited}
                onChange={handleChange}
                className="w-5 h-5"
              />
            </div>

            {/* Submit Button */}
            <div className="form-animate text-center flex flex-col md:flex-row md:justify-center md:space-x-4">
              <button
                type="submit"
                className={`px-8 py-3 ${isEdit ? 'w-1/2 bg-yellow-500 hover:bg-yellow-600' : 'w-full bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition border-2 border-white`}
              >
                {submitText}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className="w-1/2 px-8 py-3 mt-4 md:mt-0 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition border-2 border-white"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <style>{`
          .input-field {
            padding: 10px;
            border-radius: 10px;
          }
          .input-field::placeholder {
            color: white !important;
            opacity: 1;
          }
          .select-dark option {
            background-color: #1f2937;
            color: white;
          }
        `}</style>
      </div>
    </section>
  );
};

export default AppointmentForm;
