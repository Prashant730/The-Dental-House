import React from 'react';

const Locations = () => {
  return (
    <section id="locations" style={{ background: 'var(--ivory-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="eyebrow">Visit us</div>
        <div className="section-head reveal" style={{ flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <div>
            <h2>Our clinics</h2>
          </div>
          <p className="lede" style={{ maxWidth: '80ch' }}>
            Welcome to The Dental Home
            Established in 2016, The Dental Home is a trusted dental practice with clinics in Chittaranjan Park, New Delhi, and Faridabad, Haryana. Led by two AIIMS, New Delhi-trained specialist dentists with experience at India's premier dental institutes, we are committed to delivering high-quality, evidence-based dental care.
            Our philosophy is simple—warmth, transparency, personalised care, and clinical excellence. By offering dedicated appointments, maintaining the highest standards of hygiene and sterilization, and using modern dental techniques, we ensure every patient receives safe, comfortable, and effective treatment.
            At The Dental Home, we're committed to helping you achieve a healthy, confident smile in an environment where you always feel cared for and informed.
          </p>
        </div>

        <div className="loc-tabs reveal" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <button className="btn btn-primary clinic-tab active" data-target="delhi">Chittaranjan Park, Delhi</button>
          <button className="btn btn-ghost clinic-tab" data-target="faridabad">Sector 85, Faridabad</button>
        </div>

        <div className="loc-panel active reveal" id="panel-clinic" data-clinic="clinic">
          {/* Delhi Clinic */}
          <div className="loc-info" id="info-delhi" data-lat="28.5396" data-lng="77.2477" data-name="The Dental Home Chittaranjan Park Delhi">
            <div className="loc-row">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div>
                <div className="label">Address</div>
                <div className="value" style={{ fontSize: '13.5px', lineHeight: '1.4' }}>G-1422 Market No. 2, Chittaranjan Park, New Delhi, 110019</div>
              </div>
            </div>
            <div className="loc-row">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <div className="label">Hours</div>
                <div className="value" style={{ fontFamily: 'var(--font-mono)', lineHeight: '1.4' }}>Thu–Tue, 11:00–19:00<br />Wed Closed</div>
              </div>
            </div>
            <div className="loc-row">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2C9.5 21 3 14.5 3 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="label">Phone</div>
                <div className="value" style={{ fontFamily: 'var(--font-mono)' }}>+91 8264001306</div>
              </div>
            </div>
            <div className="loc-row">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div>
                <div className="label">Doctors</div>
                <div className="value">Dr. Sukhwant Yadav &amp; Dr. Sushma Chaurasiya</div>
              </div>
            </div>
            <a href="#book" className="btn btn-primary" style={{ marginTop: '8px', width: 'fit-content' }}>Book appointment</a>
          </div>

          {/* Faridabad Clinic */}
          <div className="loc-info" id="info-faridabad" style={{ display: 'none' }} data-lat="28.40478" data-lng="77.35598" data-name="The Dental Home - Faridabad">
            <div className="loc-row">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div>
                <div className="label">Address</div>
                <div className="value" style={{ fontSize: '13.5px', lineHeight: '1.4' }}>Shop no. 36, First Floor, Amolik Sankalp,<br />Sector 85, Faridabad, Haryana</div>
              </div>
            </div>
            <div className="loc-row">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <div className="label">Hours</div>
                <div className="value" style={{ fontFamily: 'var(--font-mono)', lineHeight: '1.4' }}>Wed–Mon, 17:00–21:00<br />Tue Closed</div>
              </div>
            </div>
            <div className="loc-row">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2C9.5 21 3 14.5 3 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="label">Phone</div>
                <div className="value" style={{ fontFamily: 'var(--font-mono)' }}>+91 8264001306</div>
              </div>
            </div>
            <div className="loc-row">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div>
                <div className="label">Doctors</div>
                <div className="value">Dr. Sukhwant Yadav &amp; Dr. Sushma Chaurasiya</div>
              </div>
            </div>
            <a href="#book" className="btn btn-primary" style={{ marginTop: '8px', width: 'fit-content' }}>Book appointment</a>
          </div>
          <div className="loc-map">
            <div id="leaflet-map" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;

