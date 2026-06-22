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
    <section ref={bioRef} className="py-20">
      <div className="biography mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:px-8">
        <div className="bio-image flex flex-shrink-0 justify-center lg:w-1/3">
          <img
            src={imageUrl}
            alt="Who We Are"
            className="h-64 w-64 rounded-[2rem] border-4 border-teal-200 object-cover shadow-xl shadow-teal-600/20 dark:border-ink-600"
          />
        </div>
        <div className="bio-header lg:w-2/3">
          <p className="bio-title mb-3 text-lg font-semibold tracking-wide text-teal-500">
            Biography
          </p>
          <h3 className="bio-title mb-4 text-3xl font-bold text-teal-900 dark:text-teal-50 sm:text-4xl">
            Who We Are
          </h3>
          <div className="space-y-4">
            <p className="bio-desc text-lg text-teal-700/80 dark:text-teal-100/70">
              MedHaven is a comprehensive hospital management platform built
              with the MERN stack. Our mission is to simplify patient care,
              streamline hospital operations, and empower medical professionals
              through innovative technology.
            </p>
            <p className="bio-desc text-lg text-teal-700/80 dark:text-teal-100/70">
              As a modern healthcare solution, MedHaven enables clinics and
              hospitals to manage appointments, patient records, and
              practitioner workflows all in one place. We believe in the power
              of secure, easy-to-use tools that make a difference in both
              frontline patient care and backend administration.
            </p>
            <p className="bio-desc font-medium text-teal-600 dark:text-teal-300">
              Our team is passionate about coding, healthcare, and delivering
              real-world impact in 2024 and beyond!
            </p>
            <p className="bio-desc text-lg text-teal-700/80 dark:text-teal-100/70">
              From patient registration to record-keeping and secure
              communication, every module in MedHaven is designed for
              reliability, privacy, and speed. We are committed to helping care
              providers save time, reduce errors, and focus on what matters
              most: their patients.
            </p>
            <p className="bio-desc font-semibold text-sand-500">
              MedHaven is made for today’s hospitals and tomorrow’s innovators.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biography;
