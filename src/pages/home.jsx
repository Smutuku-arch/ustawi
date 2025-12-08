import React from 'react';
import { useApp } from '../context/appContext';
import Navbar from '../components/landingPage/navbar';
import Services from '../components/landingPage/services';
import Testimonials from '../components/landingPage/testimonials';
import HowItWorks from '../components/landingPage/howItWorks';
import Contact from '../components/landingPage/contact';
import Faqs from '../components/landingPage/faqs';
import Hero from '../components/landingPage/hero';
import ChatbotFeature from '../components/landingPage/chatFeature';
import './home.css';

function Homepage({ onLoginClick }) {
  const { user } = useApp();

  return (
    <div>
      <Navbar onLoginClick={onLoginClick} />
      <Hero onLoginClick={onLoginClick} />
      <section id="services"><Services /></section>
      <section id="howItWorks"><HowItWorks /></section>
      <section id="chatfeature"><ChatbotFeature /></section>
      <section id="testimonials"><Testimonials /></section>
      <section id="contact"><Contact /></section>
      <section id="faqs"><Faqs /></section>
    </div>
  );
}

export default Homepage;