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
    <section className="text-white relative py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={formRef}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 md:p-12"
        >
          <h2 className="form-animate text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-10">
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
                className="form-animate input-field"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-animate input-field"
              />
            </div>

            {/* Email / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-animate input-field"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-animate input-field"
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
                className="form-animate input-field select-dark"
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
                  className="form-animate input-field select-dark hover:cursor-pointer"
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
                  className="form-animate input-field select-dark hover:cursor-pointer"
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
              className="p-3 form-animate input-field resize-none w-full"
            />

            {/* Submit */}
            <div className="text-center form-animate">
              <button
                type="submit"
                className=" px-8 py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition w-full border-2 border-white"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .input-field {
          padding: 10px;
          width: 100%;
          }
        .input-field::placeholder {
          color: white !important;
          opacity: 1;
        }
        .select-dark {
          background-color: bg-gray-800;
          color: white;
        }
        .select-dark.dark\\:bg-gray-700 {
          background-color: #374151 !important;
          color: white;
        }
        select option {
          background-color: #1f2937;
          color: white;
        }
      `}</style>
    </section>
  );
};

export default MessageForm;
