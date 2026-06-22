import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MessageForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [to, setTo] = useState('Doctor');
  const [department, setDepartment] = useState('');
  const [doctor_firstName, setDoctorFirstName] = useState('');
  const [doctor_lastName, setDoctorLastName] = useState('');
  const [doctors, setDoctors] = useState([]);

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

  const formRef = useRef(null);

  useEffect(() => {
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    axios
      .get(`${VITE_BACKEND_URL}/api/v1/user/doctors`, { withCredentials: true })
      .then(({ data }) => setDoctors(data.doctors))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray('.form-animate'), {
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.13,
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/message/send`,
        {
          firstName,
          lastName,
          email,
          phone,
          message,
          to,
          department,
          doctor_firstName,
          doctor_lastName,
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      toast.success(data.message);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTo('Doctor');
      setDoctorFirstName('');
      setDoctorLastName('');
      setDepartment('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Message send failed');
    }
  };

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          ref={formRef}
          className="surface-card rounded-3xl p-8 md:p-12"
        >
          <h2 className="form-animate mb-10 text-center text-3xl font-bold text-teal-900 dark:text-teal-50">
            Send Us A Message
          </h2>

          <form onSubmit={handleMessage} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-animate field"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-animate field"
              />
            </div>

            {/* Email / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-animate field"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-animate field"
              />
            </div>

            {/* To */}
            <div>
              <select
                value={to}
                onChange={(e) => {
                  const val = e.target.value;
                  setTo(val);
                  if (val === 'Admin') {
                    setDoctorFirstName('');
                    setDoctorLastName('');
                    setDepartment('');
                  }
                }}
                className="form-animate field"
              >
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Department & Doctor */}
            {to === 'Doctor' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setDoctorFirstName('');
                    setDoctorLastName('');
                  }}
                  className="form-animate field hover:cursor-pointer"
                >
                  <option value="">Select Department</option>
                  {departmentsArray.map((depart, index) => (
                    <option value={depart} key={index}>
                      {depart}
                    </option>
                  ))}
                </select>
                <select
                  value={`${doctor_firstName} ${doctor_lastName}`.trim()}
                  onChange={(e) => {
                    const [firstName, lastName] = e.target.value.split(' ');
                    setDoctorFirstName(firstName);
                    setDoctorLastName(lastName || '');
                  }}
                  className="form-animate field hover:cursor-pointer"
                  disabled={!department}
                >
                  <option value="">Select Doctor</option>
                  {doctors
                    .filter((d) => d.doctorDepartment === department)
                    .map((doctor, index) => (
                      <option
                        value={`${doctor.firstName} ${doctor.lastName}`}
                        key={index}
                      >
                        {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Message */}
            <textarea
              rows={6}
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-animate field resize-none"
            />

            {/* Submit */}
            <div className="form-animate text-center">
              <button
                type="submit"
                className="anim-pulse w-full rounded-2xl bg-teal-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MessageForm;
