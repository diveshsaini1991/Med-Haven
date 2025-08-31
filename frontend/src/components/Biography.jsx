import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Biography = ({ imageUrl }) => {
  const bioRef = useRef(null);

  useEffect(() => {
    if (!bioRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: bioRef.current,
          start: 'top 70%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
        },
      });

      timeline
        .from('.bio-image', {
          x: -60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
        .from(
          '.bio-header',
          { x: 60, opacity: 0, duration: 0.7, ease: 'power3.out' },
          '-='
        )
        .from(
          '.bio-title',
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.2,
          },
          '-='
        )
        .from(
          '.bio-desc',
          {
            y: 20,
            opacity: 0,
            duration: 1.0,
            stagger: 0.3,
            ease: 'power2.out',
          },
          '-='
        );
    }, bioRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={bioRef} className="py-16 bg-blue-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center biography">
        <div className="bio-image flex-shrink-0 lg:w-1/3 flex justify-center">
          <img
            src={imageUrl}
            alt="Who We Are"
            className="w-64 h-64 object-cover rounded-2xl border-4 border-blue-200 shadow-lg"
          />
        </div>
        <div className="bio-header lg:w-2/3">
          <p className="bio-title text-cyan-600 font-semibold mb-3 text-lg tracking-wide">
            Biography
          </p>
          <h3 className="bio-title text-3xl sm:text-4xl font-bold text-blue-800 dark:text-blue-400 mb-4">
            Who We Are
          </h3>
          <div className="space-y-4">
            <p className="bio-desc text-gray-700 dark:text-gray-300 text-lg">
              MedHaven is a comprehensive hospital management platform built
              with the MERN stack. Our mission is to simplify patient care,
              streamline hospital operations, and empower medical professionals
              through innovative technology.
            </p>
            <p className="bio-desc text-gray-700 dark:text-gray-300 text-lg">
              As a modern healthcare solution, MedHaven enables clinics and
              hospitals to manage appointments, patient records, and
              practitioner workflows all in one place. We believe in the power
              of secure, easy-to-use tools that make a difference in both
              frontline patient care and backend administration.
            </p>
            <p className="bio-desc text-blue-700 dark:text-blue-400 font-medium">
              Our team is passionate about coding, healthcare, and delivering
              real-world impact in 2024 and beyond!
            </p>
            <p className="bio-desc text-gray-700 dark:text-gray-300 text-lg">
              From patient registration to record-keeping and secure
              communication, every module in MedHaven is designed for
              reliability, privacy, and speed. We are committed to helping care
              providers save time, reduce errors, and focus on what matters
              most: their patients.
            </p>
            <p className="bio-desc text-cyan-500 dark:text-cyan-400 font-semibold">
              MedHaven is made for today’s hospitals and tomorrow’s innovators.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biography;
