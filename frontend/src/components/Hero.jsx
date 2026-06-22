import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Hero = ({ title, imageUrl }) => {
  const heroRef = useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from(
          '.hero-desc',
          { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .from(
          '.hero-image',
          { scale: 0.95, opacity: 0, duration: 1, ease: 'power3.out' },
          '-=0.7'
        );
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden grid-bg pt-28 pb-20"
    >
      <div className="blob anim-glow absolute -left-24 -top-10 h-72 w-72 rounded-full bg-teal-300 dark:bg-teal-600" />
      <div className="blob anim-glow absolute right-0 top-32 h-80 w-80 rounded-full bg-sand-400/70" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <span className="hero-title inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-700 dark:bg-ink-700 dark:text-teal-200">
            <span className="anim-beat inline-block text-teal-500">❤</span>
            Trusted healthcare, close to you
          </span>
          <h1 className="hero-title mt-6 text-4xl font-extrabold leading-tight tracking-tight text-teal-900 dark:text-teal-50 sm:text-5xl">
            {title}
          </h1>
          <p className="hero-desc mt-6 max-w-2xl text-lg text-teal-700/80 dark:text-teal-100/70">
            MedHaven Medical Institute is a state-of-the-art facility dedicated
            to providing comprehensive healthcare services with compassion and
            expertise. Our skilled team delivers personalized care tailored to
            each patient's needs — ensuring a harmonious journey towards optimal
            health and wellness.
          </p>
          <div className="hero-desc mt-8 flex flex-wrap gap-3">
            <Link
              to="/appointment"
              className="anim-pulse rounded-2xl bg-teal-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-600"
            >
              Book an Appointment
            </Link>
            <Link
              to="/about"
              className="rounded-2xl border-2 border-teal-200 px-7 py-3.5 font-bold text-teal-700 transition hover:-translate-y-0.5 hover:border-teal-400 dark:border-ink-600 dark:text-teal-100"
            >
              Learn More
            </Link>
          </div>
          <svg
            className="ekg mt-10 h-9 w-full max-w-md text-teal-400"
            viewBox="0 0 400 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M0 20 H110 l10 -14 14 28 12 -22 9 14 H400" />
          </svg>
        </div>

        <div className="relative flex items-center justify-center lg:col-span-5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Hero"
              className="hero-image anim-floaty w-full max-w-md rounded-[2rem] shadow-2xl shadow-teal-600/30"
            />
          ) : (
            <div className="hero-image anim-floaty mx-auto grid h-72 w-72 place-items-center rounded-[2.5rem] bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-2xl shadow-teal-600/40">
              <svg
                viewBox="0 0 24 24"
                className="h-32 w-32 opacity-90"
                fill="currentColor"
              >
                <path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Zm-7 18a7 7 0 0 1 14 0v2H5v-2Z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default Hero;
