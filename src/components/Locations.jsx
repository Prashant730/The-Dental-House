import React, { useState, useEffect, useCallback } from 'react';

const Locations = () => {
  const [activeClinic, setActiveClinic] = useState('delhi');

  // Update map when clinic tab changes
  useEffect(() => {
    const activeInfo = document.getElementById('info-' + activeClinic);
    if (!activeInfo) return;

    const lat = parseFloat(activeInfo.getAttribute('data-lat'));
    const lng = parseFloat(activeInfo.getAttribute('data-lng'));
    const name = activeInfo.getAttribute('data-name');

    if (window.clinicMap && window.clinicMarker) {
      window.clinicMap.setCenter({ lat, lng });
      window.clinicMap.setZoom(14);
      if (typeof window.clinicMarker.setPosition === 'function') {
        window.clinicMarker.setPosition({ lat, lng });
        window.clinicMarker.setTitle(name);
      } else if (window.clinicMarker.position) {
        window.clinicMarker.position = { lat, lng };
        window.clinicMarker.title = name;
      }
    } else {
      const mapEl = document.getElementById('leaflet-map');
      if (mapEl) {
        const iframe = mapEl.querySelector('iframe');
        if (iframe) {
          iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent(name) + '&z=14&output=embed';
        }
      }
    }

    // Clear old routes
    if (window.routePolyline) {
      window.routePolyline.setMap(null);
      window.routePolyline = null;
    }
    if (window.userMarker) {
      if (typeof window.userMarker.setMap === 'function') {
        window.userMarker.setMap(null);
      }
      window.userMarker = null;
    }

    // Update header clinic name
    const nameEl = document.getElementById('header-loc-name');
    if (nameEl) {
      nameEl.textContent = name.includes('Faridabad') ? 'Faridabad' : 'CR Park';
    }
  }, [activeClinic]);

  return (
    <section id="locations" style={{ background: 'var(--ivory-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="eyebrow">Visit us</div>
        <div className="section-head reveal" style={{ flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <div>
            <h2>Our clinics</h2>
          </div>
          <p className="lede" style={{ maxWidth: '80ch' }}>
            Welcome to The Dental Home — Established in 2016, The Dental Home is a trusted dental practice with clinics in Chittaranjan Park, New Delhi, and Faridabad, Haryana. Led by two AIIMS, New Delhi-trained specialist dentists, we are committed to delivering high-quality, evidence-based dental care.
          </p>
        </div>

        <div className="loc-tabs reveal" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <button
            className={"btn clinic-tab " + (activeClinic === "delhi" ? "btn-primary active" : "btn-ghost")}
            onClick={() => setActiveClinic('delhi')}
          >
            Chittaranjan Park, Delhi
          </button>
          <button
            className={"btn clinic-tab " + (activeClinic === "faridabad" ? "btn-primary active" : "btn-ghost")}
            onClick={() => setActiveClinic('faridabad')}
          >
            Sector 85, Faridabad
          </button>
        </div>

        <div className="loc-panel active reveal" id="panel-clinic">
          {/* Delhi Clinic */}
          <div className="loc-info" id="info-delhi" style={{ display: activeClinic === 'delhi' ? 'flex' : 'none' }}>
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
          <div className="loc-info" id="info-faridabad" style={{ display: activeClinic === 'faridabad' ? 'flex' : 'none' }}>
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


