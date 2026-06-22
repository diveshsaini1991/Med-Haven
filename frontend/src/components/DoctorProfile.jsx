import React, { useEffect, useRef, useState } from 'react';
import { getLowResCloudinaryUrl } from '../utils/cloudinaryHelpers';
import gsap from 'gsap';

const formatDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const DoctorProfile = ({ doctor, onBack }) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const imageRef = useRef(null);
  const [showImageOverlay, setShowImageOverlay] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    if (showImageOverlay) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power1.out' }
      );
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [showImageOverlay]);

  const closeOverlay = () => {
    gsap.to(imageRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in',
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in',
      onComplete: () => {
        setShowImageOverlay(false);
      },
    });
  };

  if (!doctor) return null;

  const imageUrl = doctor.avatarUrl || doctor.docAvatar?.url;

  return (
    <>
      <div
        ref={containerRef}
        className="flex-1 flex flex-col p-6 bg-white dark:bg-ink-900 overflow-y-auto text-teal-900 dark:text-teal-50"
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-4 self-start rounded-xl bg-teal-500 px-4 py-2 font-bold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:cursor-pointer hover:bg-teal-600"
        >
          ← Back
        </button>

        {/* Doctor Image and Name */}
        <div className="flex flex-col items-center">
          {imageUrl ? (
            <img
              src={getLowResCloudinaryUrl(imageUrl, 120, 40)}
              alt={doctor.name || `${doctor.firstName} ${doctor.lastName}`}
              className="w-32 h-32 rounded-full object-cover mb-4 cursor-pointer"
              onClick={() => setShowImageOverlay(true)}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-400 mb-4" />
          )}
          <h2 className="text-2xl font-bold">
            {doctor.name || `${doctor.firstName} ${doctor.lastName}`}
          </h2>
          <p className="mt-1 font-medium text-teal-600 dark:text-teal-300">
            {doctor.department || doctor.doctorDepartment}
          </p>
        </div>

        {/* Doctor Details */}
        <div className="mt-6 w-full">
          <h3 className="mb-2 text-lg font-semibold text-teal-700 dark:text-teal-200">
            Profile Details
          </h3>
          <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10">
            <div>
              <span className="font-medium">Email: </span>
              <span>{doctor.email || '-'}</span>
            </div>
            <div>
              <span className="font-medium">Phone: </span>
              <span>{doctor.phone || '-'}</span>
            </div>
            <div>
              <span className="font-medium">Aadhaar: </span>
              <span>{doctor.aadhaar || '-'}</span>
            </div>
            <div>
              <span className="font-medium">DOB: </span>
              <span>{formatDate(doctor.dob)}</span>
            </div>
            <div>
              <span className="font-medium">Gender: </span>
              <span>{doctor.gender || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Overlay with blurred background */}
      {showImageOverlay && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/50 backdrop-blur-sm dark:bg-black/70"
          onClick={closeOverlay}
        >
          {/* Close button fixed top-right */}
          <button
            onClick={closeOverlay}
            className="fixed top-4 right-4 text-white text-4xl font-bold  bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 cursor-pointer focus:outline-none z-60"
            aria-label="Close image"
          >
            &times;
          </button>

          <div onClick={(e) => e.stopPropagation()}>
            <img
              ref={imageRef}
              src={getLowResCloudinaryUrl(imageUrl, 800, 0)}
              alt={doctor.name || `${doctor.firstName} ${doctor.lastName}`}
              className="max-w-screen max-h-screen rounded-lg object-contain shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorProfile;
