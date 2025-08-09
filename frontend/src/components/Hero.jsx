import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = ({ title, imageUrl }) => {
  const heroRef = useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl
        .from(".hero-title", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(".hero-desc", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .from(".hero-image", { scale: 0.95, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.7");
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="bg-white dark:bg-gray-900 py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 mb-12 lg:mb-0">
          <h1 className="hero-title text-4xl font-extrabold text-blue-700 dark:text-blue-400 sm:text-5xl">
            {title}
          </h1>
          <p className="hero-desc mt-6 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            MedHaven Medical Institute is a state-of-the-art facility dedicated to providing comprehensive healthcare services with compassion and expertise. Our team of skilled professionals is committed to delivering personalized care tailored to each patient's needs. At MedHaven, we prioritize your well-being, ensuring a harmonious journey towards optimal health and wellness.
          </p>
        </div>
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <img
            src={imageUrl}
            alt="Hero"
            className="hero-image w-full max-w-md rounded-lghidden lg:block"
          />
        </div>
      </div>
    </section>
  );
};
export default Hero;
