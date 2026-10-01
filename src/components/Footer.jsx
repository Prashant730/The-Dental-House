import React from 'react';

const Footer = () => {
  return (
    <>
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-col">
              <div className="logo" style={{ marginBottom: '12px' }}>
                <img className="logo-mark" style={{ objectFit: 'contain', width: '24px', height: '24px' }} src="/assets/logo.png" alt="The Dental Home" />
                The Dental Home
              </div>
              <p style={{ maxWidth: '28ch' }}>Quality dental care in a warm, welcoming environment.</p>
            </div>
            <div className="foot-col">
              <p style={{ color: 'var(--ink)', fontWeight: 500 }}>Clinic</p>
              <a href="#locations">Chittaranjan Park, Delhi | Sector 85, Faridabad</a>
              <a href="#locations">Thu–Tue 11am-7pm (Delhi) | Wed-Mon 5pm-9pm (FBD)</a>
            </div>
            <div className="foot-col">
              <p style={{ color: 'var(--ink)', fontWeight: 500 }}>Doctors</p>
              <p>Dr.Sukhwant Yadav</p>
              <p>Dr. Sushma Chaurasia</p>
            </div>
            <div className="foot-col">
              <p style={{ color: 'var(--ink)', fontWeight: 500 }}>Site</p>
              <a href="#services">Services</a>
              <a href="#stories">Stories</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 The Dental Home</span>
            <span>Privacy · Terms</span>
          </div>
        </div>
      </footer>

      <div className="mobile-cta">
        <a href="#book" className="btn btn-primary">Book appointment</a>
      </div>

      <button id="scroll-to-top" aria-label="Scroll to top">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
};

export default Footer;

