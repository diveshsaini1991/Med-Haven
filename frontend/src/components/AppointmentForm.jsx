import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

gsap.registerPlugin(ScrollTrigger);

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  const departmentsArray = [
    "Pediatrics", "Orthopedics", "Cardiology", "Neurology", "Oncology", "Radiology", "Physical Therapy", "Dermatology", "ENT"
  ];

  const [doctors, setDoctors] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/doctors`,
        { withCredentials: true }
      );
      setDoctors(data.doctors);
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray(".form-animate"), {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleAppointment = async (e) => {
    e.preventDefault();
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (!dob) {
      toast.error("Please select your Date of Birth.");
      return;
    }
  
    if (!appointmentDate) {
      toast.error("Please select your Appointment Date.");
      return;
    }
  
    const dobDate = new Date(dob);
    const appointmentDateObj = new Date(appointmentDate);
  
    // DOB must not be in the future
    if (dobDate > today) {
      toast.error("Date of Birth cannot be in the future.");
      return;
    }
  
    // Appointment date must not be in the past
    if (appointmentDateObj < today) {
      toast.error("Appointment Date cannot be in the past.");
      return;
    }
  
    try {
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/v1/appointment/post`,
        {
          firstName, lastName, email, phone, aadhaar,
          dob, gender, appointment_date: appointmentDate, department,
          doctor_firstName: doctorFirstName, doctor_lastName: doctorLastName,
          hasVisited, address
        },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
  
      toast.success(data.message);
  
      // Reset fields
      setFirstName(""); setLastName(""); setEmail(""); setPhone("");
      setAadhaar(""); setDob(""); setGender(""); setAppointmentDate("");
      setDepartment("Pediatrics"); setDoctorFirstName(""); setDoctorLastName("");
      setHasVisited(false); setAddress("");
  
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
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
            Book Your Appointment
          </h2>

          <form onSubmit={handleAppointment} className="space-y-6">
            {/* First/Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="First Name" value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="form-animate input-field" />
              <input type="text" placeholder="Last Name" value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="form-animate input-field" />
            </div>

            {/* Email/Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-animate input-field" />
              <input type="number" placeholder="Mobile Number" value={phone}
                onChange={e => setPhone(e.target.value)}
                className="form-animate input-field" />
            </div>

            {/* Aadhaar / Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="number"
                placeholder="Aadhaar"
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value)}
                className="form-animate input-field"
              />

            <DatePicker
              selected={dob ? new Date(dob) : null}
              onChange={(date) => setDob(date ? date.toISOString().split("T")[0] : "")}
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
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="form-animate input-field select-dark"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <DatePicker
              selected={appointmentDate ? new Date(appointmentDate) : null}
              onChange={(date) => setAppointmentDate(date ? date.toISOString().split("T")[0] : "")}
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
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDoctorFirstName("");
                  setDoctorLastName("");
                }}
                className="form-animate input-field select-dark"
              >
                {departmentsArray.map((depart, index) => (
                  <option value={depart} key={index}>{depart}</option>
                ))}
              </select>
              <select
                value={`${doctorFirstName} ${doctorLastName}`}
                onChange={(e) => {
                  const [firstName, lastName] = e.target.value.split(" ");
                  setDoctorFirstName(firstName);
                  setDoctorLastName(lastName);
                }}
                className="form-animate input-field select-dark"
                disabled={!department}
              >
                <option value="">Select Doctor</option>
                {doctors
                  .filter(doc => doc.doctorDepartment === department)
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
              rows={5}
              placeholder="Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="form-animate input-field resize-none w-full"
            />

            {/* Visited Before */}
            <div className="form-animate flex items-center space-x-3">
              <label className="text-gray-700 dark:text-gray-200">Visited before?</label>
              <input
                type="checkbox"
                checked={hasVisited}
                onChange={e => setHasVisited(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            {/* Submit */}
            <div className="form-animate text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition w-full border-2 border-white"
              >
                Get Appointment
              </button>
            </div>
          </form>
        </div>
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
    </section>
  );
};

export default AppointmentForm;
