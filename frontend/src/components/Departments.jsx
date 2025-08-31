import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Departments = () => {
  const departmentsArray = [
    { name: 'Pediatrics', imageUrl: '/departments/pedia.jpg' },
    { name: 'Orthopedics', imageUrl: '/departments/ortho.jpg' },
    { name: 'Cardiology', imageUrl: '/departments/cardio.jpg' },
    { name: 'Neurology', imageUrl: '/departments/neuro.jpg' },
    { name: 'Oncology', imageUrl: '/departments/onco.jpg' },
    { name: 'Radiology', imageUrl: '/departments/radio.jpg' },
    { name: 'Physical Therapy', imageUrl: '/departments/therapy.jpg' },
    { name: 'Dermatology', imageUrl: '/departments/derma.jpg' },
    { name: 'ENT', imageUrl: '/departments/ent.jpg' },
  ];

  const wrapperRef = useRef(null);

  useEffect(() => {
    const baseSpeed = 100;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let direction = 1;

    const wrapper = wrapperRef.current;
    const deptCards = wrapper.querySelectorAll('.dept-card');

    deptCards.forEach((card) => {
      wrapper.appendChild(card.cloneNode(true));
    });

    let totalWidth = 0;
    wrapper.querySelectorAll('.dept-card').forEach((card) => {
      totalWidth += card.offsetWidth;
    });

    gsap.set(wrapper, { x: 0 });

    let currentX = 0;
    let lastTime = performance.now();

    const animate = (time) => {
      const deltaTime = (time - lastTime) / 1000; // sec
      lastTime = time;

      const movement = (baseSpeed + scrollVelocity) * direction * deltaTime;

      currentX -= movement;

      if (currentX <= -totalWidth / 2) {
        currentX += totalWidth / 2;
      } else if (currentX >= 0) {
        currentX -= totalWidth / 2;
      }

      gsap.set(wrapper, { x: currentX });

      scrollVelocity *= 0.9;

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    const onScroll = () => {
      const scrollDiff = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;

      if (scrollDiff > 0) {
        direction = 1;
      } else if (scrollDiff < 0) {
        direction = -1;
      }

      scrollVelocity = Math.min(Math.abs(scrollDiff) * 5, 150);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <h2 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-10 text-center">
          Departments
        </h2>

        <div className="overflow-hidden">
          <div ref={wrapperRef} className="flex">
            {departmentsArray.map((depart, index) => (
              <div
                key={index}
                className="dept-card flex-shrink-0 w-64 bg-blue-50 dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden mr-6"
              >
                <img
                  src={depart.imageUrl}
                  alt={`${depart.name} Department`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 text-center">
                    {depart.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Departments;
