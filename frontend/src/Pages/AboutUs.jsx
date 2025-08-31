import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Biography from '../components/Biography';
const AboutUs = () => {
  useEffect(() => {
    document.title = 'MedHaven - About Us';
  }, []);
  return (
    <>
      <Hero
        title={'Learn More About Us | MedHaven Medical Institute'}
        imageUrl={'/about.png'}
      />
      <Biography imageUrl={'/whoweare.png'} />
    </>
  );
};

export default AboutUs;
