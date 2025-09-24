import React from 'react';
import styles from '../assets/styles/footer.module.css';
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate, Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaFacebookSquare, FaInstagramSquare, FaLinkedin } from 'react-icons/fa';

function Footer() {
  const navigate = useNavigate();

  function handleNavigation(sectionId) {
    return navigate('/', { state: { sectionId } });
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerWrapper}>
        <div className={styles.footerContainer}>
          <div className={styles.linksSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="about">About Us</Link></li>
              <li>
                <ScrollLink to="howItWorks" smooth={true} duration={500} onClick={() => handleNavigation('howItWorks')}>
                  How It Works
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="services" smooth={true} duration={500} onClick={() => handleNavigation('services')}>
                  Services
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="faqs" smooth={true} duration={500} onClick={() => handleNavigation('faqs')}>
                  FAQs
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="contact" smooth={true} duration={500} onClick={() => handleNavigation('contact')}>
                  Contact Us
                </ScrollLink>
              </li>
              <li><Link to="privacypolicy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className={styles.contactSection}>
            <h4>Contact Us</h4>
            <p>Email: support@ustawi.web.app</p>
            <p>Phone: +254 (720) 201-332</p>
            <p>Address: Nairobi, Kenya</p>
          </div>

          <div className={styles.socialSection}>
            <h4>Connect with Us</h4>
            <div className={styles.socialIcons}>
              <IconContext.Provider value={{ size: '1.5rem' }}>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebookSquare />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagramSquare />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
              </IconContext.Provider>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Ustawi. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
