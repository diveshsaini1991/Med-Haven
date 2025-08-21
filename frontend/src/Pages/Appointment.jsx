import React, { useEffect } from "react";
import Hero from "../components/Hero";
import AppointmentForm from "../components/AppointmentForm";

const Appointment = () => {
  useEffect(()=>{
    document.title = "MedHaven - Book Appointment"
  },[]);
  return (
    <>
      <Hero
        title={"Schedule Your Appointment | MedHaven Medical Institute"}
        imageUrl={"/signin.png"}
      />
      <AppointmentForm submitText="Get Appointment"/>
    </>
  );
};

export default Appointment;