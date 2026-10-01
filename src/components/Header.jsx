import React from 'react';

const Header = () => {
  return (
    <>
      <header id="site-header">
        <div className="nav-inner">
          <a href="#" style={{ textDecoration: 'none' }}>
            <div className="logo">
              <img className="logo-mark" style={{ objectFit: 'contain', width: '30px', height: '30px' }} src="/assets/logo.png" alt="The Dental Home" />
              The Dental Home
            </div>
          </a>
          <nav className="nav-links">
            <a href="#team">Our Doctors</a>
            <a href="#locations">Visit Us</a>
            <a href="#services">Services</a>
            <a href="#stories">Stories</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-right">
            <button className="loc-pill" id="header-loc-pill" aria-live="polite"><span className="loc-dot" id="header-dot"></span><span id="header-loc-name">The Dental Home</span></button>
            <a href="#book" className="btn btn-primary">Book appointment</a>
            <button className="burger" aria-label="Open menu">
              <svg width="22" height="22" viewBox="0 0 22 22">
                <path d="M3 6h16M3 11h16M3 16h16" stroke="#2E2E2E" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div className="mobile-nav-overlay" id="mobile-nav">
        <div className="mobile-nav-panel">
          <div className="mobile-nav-header">
            <div className="logo">
              <img className="logo-mark" style={{ objectFit: 'contain', width: '24px', height: '24px' }} src="/assets/logo.png" alt="The Dental Home" />
              The Dental Home
            </div>
            <button className="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu">
              <svg width="18" height="18" viewBox="0 0 15 15">
                <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="mobile-nav-links">
            <a href="#team">Our Doctors</a>
            <a href="#locations">Visit Us</a>
            <a href="#services">Services</a>
            <a href="#stories">Stories</a>
            <a href="#faq">FAQ</a>
            <a href="#book" className="btn btn-primary" style={{ marginTop: '8px' }}>Book appointment</a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;

