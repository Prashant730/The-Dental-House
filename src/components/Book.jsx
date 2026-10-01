import React from 'react';

const Book = () => {
  return (
    <section id="book">
      <div className="wrap">
        <div className="book-container reveal">
          <div>
            <div className="eyebrow">Schedule your visit</div>
            <h2 style={{ marginBottom: '16px' }}>Book an appointment.</h2>
            <p className="lede" style={{ marginBottom: '24px', fontSize: '16px', maxWidth: '32ch' }}>
              Schedule your visit today. Fill out the form, call us, or message us on WhatsApp.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px' }}>
              <a href="https://wa.me/918264001306?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20The%20Dental%20Home." target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" id="btn-whatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
              <a href="tel:+918264001306" className="btn btn-call" id="btn-call">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2C9.5 21 3 14.5 3 6a2 2 0 012-2z" />
                </svg>
                Call Us Now
              </a>
            </div>
          </div>
          <div className="book-form-card">
            <form id="appointment-form">
              <input type="text" name="_honey" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="name">Full Name *</label>
                  <input type="text" id="name" name="fullname" required placeholder="Enter your name" autoComplete="name" />
                </div>
                <div className="input-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input type="tel" id="phone" name="phone" required placeholder="+91 9994455723" pattern="^\+?[0-9]{7,15}$" title="Enter a valid phone number (7-15 digits, optional + prefix)" autoComplete="tel" />
                </div>
              </div>
              <div className="form-grid" style={{ marginTop: '16px' }}>
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" placeholder="user@example.com" autoComplete="email" />
                </div>
                <div className="input-group">
                  <label htmlFor="clinic">Select Clinic *</label>
                  <select id="clinic" name="clinic" required defaultValue="">
                    <option value="" disabled>Choose a location...</option>
                    <option value="delhi">Chittaranjan Park, Delhi</option>
                    <option value="faridabad">Sector 85, Faridabad</option>
                  </select>
                </div>
              </div>
              <div className="form-grid" style={{ marginTop: '16px' }}>
                <div className="input-group">
                  <label htmlFor="date">Preferred Date *</label>
                  <input type="date" id="date" name="date" required />
                  <span id="date-error" style={{ color: 'var(--coral-deep)', fontSize: '12px', marginTop: '4px', display: 'none' }}></span>
                </div>
                <div className="input-group">
                  <label htmlFor="service">Service</label>
                  <select id="service" name="service" defaultValue="">
                    <option value="" disabled>Choose a service...</option>
                    <option value="prosthodontics">Crowns, Bridges & Dentures</option>
                    <option value="implants">Dental Implants</option>
                    <option value="orthodontics">Orthodontics (Braces & Aligners)</option>
                    <option value="cosmetic">Cosmetic Dentistry & Smile Makeover</option>
                    <option value="root-canal">Root Canal Treatment</option>
                  </select>
                </div>
              </div>
              <div className="input-group" style={{ marginTop: '16px' }}>
                <label htmlFor="notes">Additional Notes</label>
                <textarea id="notes" name="notes" rows="3" placeholder="Any specific concerns or medical history..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center', padding: '14px' }}>
                Submit
              </button>
              <div id="form-status" style={{ display: 'none', textAlign: 'center', marginTop: '16px', fontSize: '13.5px', fontWeight: 500 }}></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Book;

