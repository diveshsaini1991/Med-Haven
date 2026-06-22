import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Hero = ({ title, imageUrl, illustration = false }) => {
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
          {illustration ? (
            <svg
              viewBox="0 0 480 480"
              className="hero-image anim-floaty w-full max-w-md drop-shadow-2xl"
              role="img"
              aria-label="Calm clinical care illustration"
            >
              <defs>
                <linearGradient id="heroCard" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2fbdb2" />
                  <stop offset="1" stopColor="#0b5d5a" />
                </linearGradient>
                <linearGradient id="heroSand" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f7d49b" />
                  <stop offset="1" stopColor="#e8a84f" />
                </linearGradient>
              </defs>

              {/* Card */}
              <rect x="44" y="44" width="392" height="392" rx="60" fill="url(#heroCard)" />
              {/* Depth circles */}
              <circle cx="402" cy="96" r="90" fill="#ffffff" opacity="0.08" />
              <circle cx="92" cy="404" r="110" fill="#07201e" opacity="0.12" />

              {/* Center badge with medical cross */}
              <circle cx="240" cy="206" r="96" fill="#ffffff" opacity="0.95" />
              <g fill="#0e9c92">
                <rect x="222" y="150" width="36" height="112" rx="14" />
                <rect x="184" y="188" width="112" height="36" rx="14" />
              </g>

              {/* EKG line */}
              <path
                d="M96 326 H188 l16 -34 22 64 18 -50 14 26 H392"
                fill="none"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />

              {/* Floating card: heart rate */}
              <g>
                <rect x="60" y="120" width="118" height="60" rx="20" fill="#ffffff" />
                <path
                  d="M92 152c-7-5-14-9-14-17 0-5 4-8 8-8 3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 3 8 8 0 8-7 12-14 17Z"
                  fill="#0e9c92"
                />
                <rect x="116" y="138" width="50" height="9" rx="4.5" fill="#0e9c92" opacity="0.85" />
                <rect x="116" y="154" width="34" height="9" rx="4.5" fill="#9fd9d2" />
              </g>

              {/* Floating card: appointment check */}
              <g>
                <rect x="300" y="312" width="120" height="86" rx="22" fill="#ffffff" />
                <rect x="318" y="330" width="84" height="12" rx="6" fill="#cdeee9" />
                <circle cx="334" cy="368" r="14" fill="url(#heroSand)" />
                <path
                  d="M328 368 l4 4 8 -9"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="356" y="362" width="48" height="11" rx="5.5" fill="#0e9c92" opacity="0.85" />
              </g>

              {/* Plus motifs */}
              <g fill="#f2c078">
                <rect x="392" y="220" width="11" height="34" rx="5" />
                <rect x="381" y="231" width="34" height="11" rx="5" />
              </g>
              <g fill="#ffffff" opacity="0.6">
                <rect x="150" y="404" width="9" height="26" rx="4" />
                <rect x="141.5" y="412.5" width="26" height="9" rx="4" />
              </g>
            </svg>
          ) : imageUrl ? (
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
