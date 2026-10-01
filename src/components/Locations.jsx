import React, { useState, useEffect } from 'react';

const CLINICS = {
  delhi: {
    id: 'delhi',
    name: 'The Dental Home Chittaranjan Park Delhi',
    headerName: 'CR Park Clinic',
    lat: 28.5396,
    lng: 77.2477,
    address: 'G-1422 Market No. 2, Chittaranjan Park, New Delhi, 110019',
    hours: 'Thu–Tue, 11:00–19:00',
    closed: 'Wed Closed',
    phone: '+91 8264001306',
    doctors: 'Dr. Sukhwant Yadav & Dr. Sushma Chaurasiya',
    mapSrc: 'https://www.google.com/maps?q=28.5396,77.2477&z=15&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.5396,77.2477'
  },
  faridabad: {
    id: 'faridabad',
    name: 'The Dental Home - Faridabad',
    headerName: 'Faridabad Clinic',
    lat: 28.40478,
    lng: 77.35598,
    address: 'Shop no. 36, First Floor, Amolik Sankalp, Sector 85, Faridabad, Haryana',
    hours: 'Wed–Mon, 17:00–21:00',
    closed: 'Tue Closed',
    phone: '+91 8264001306',
    doctors: 'Dr. Sukhwant Yadav & Dr. Sushma Chaurasiya',
    mapSrc: 'https://www.google.com/maps?q=28.40478,77.35598&z=15&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.40478,77.35598'
  }
};

const Locations = () => {
  const [activeClinic, setActiveClinic] = useState('delhi');

  const openDirections = (clinicId) => {
    const clinic = CLINICS[clinicId] || CLINICS[activeClinic] || CLINICS.delhi;
    if (clinic && clinic.directionsUrl) {
      window.open(clinic.directionsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const updateClinicUI = (clinicId) => {
    try {
      const clinic = CLINICS[clinicId] || CLINICS.delhi;
      const isFbd = clinic.id === 'faridabad';

      // 1. Google Maps JS API (if loaded)
      if (window.clinicMap && window.clinicMarker) {
        window.clinicMap.setCenter({ lat: clinic.lat, lng: clinic.lng });
        window.clinicMap.setZoom(14);
        if (typeof window.clinicMarker.setPosition === 'function') {
          window.clinicMarker.setPosition({ lat: clinic.lat, lng: clinic.lng });
          window.clinicMarker.setTitle(clinic.name);
        } else if (window.clinicMarker.position) {
          window.clinicMarker.position = { lat: clinic.lat, lng: clinic.lng };
          window.clinicMarker.title = clinic.name;
        }
      } else {
        // Fallback Google Maps iframe
        const mapEl = document.getElementById('leaflet-map');
        if (mapEl) {
          let iframe = mapEl.querySelector('iframe');
          if (iframe) {
            iframe.src = clinic.mapSrc;
          } else {
            mapEl.innerHTML = '<iframe title="The Dental Home location on Google Maps" src="' + clinic.mapSrc + '" style="border:0; width:100%; height:100%; pointer-events:none;"></iframe>';
          }
        }
      }

      // 2. Clear old routes
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

      // 3. Update header clinic badge & status dot
      const nameEl = document.getElementById('header-loc-name');
      const dotEl = document.getElementById('header-dot');
      if (nameEl) {
        nameEl.textContent = clinic.headerName;
      }
      if (dotEl) {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const ist = new Date(utc + 3600000 * 5.5);
        const hours = ist.getHours();
        const day = ist.getDay();

        let isOpen = false;
        if (isFbd) {
          if (day !== 2 && hours >= 17 && hours < 21) isOpen = true;
        } else {
          if (day !== 3 && hours >= 11 && hours < 19) isOpen = true;
        }

        dotEl.style.backgroundColor = isOpen ? '#27AE60' : '#E74C3C';
        dotEl.title = isOpen ? 'Clinic is currently open' : 'Clinic is currently closed';
      }
    } catch (err) {
      console.warn('Error updating clinic UI:', err);
    }
  };

  const handleClinicChange = (clinicId) => {
    setActiveClinic(clinicId);
    updateClinicUI(clinicId);
  };

  useEffect(() => {
    updateClinicUI(activeClinic);
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
            className={'btn clinic-tab ' + (activeClinic === 'delhi' ? 'btn-primary active' : 'btn-ghost')}
            data-target="delhi"
            onClick={() => handleClinicChange('delhi')}
          >
            Chittaranjan Park, Delhi
          </button>
          <button
            className={'btn clinic-tab ' + (activeClinic === 'faridabad' ? 'btn-primary active' : 'btn-ghost')}
            data-target="faridabad"
            onClick={() => handleClinicChange('faridabad')}
          >
            Sector 85, Faridabad
          </button>
        </div>

        <div className="loc-panel active reveal" id="panel-clinic" data-clinic="clinic">
          {/* Delhi Clinic */}
          <div
            className="loc-info"
            id="info-delhi"
            data-lat="28.5396"
            data-lng="77.2477"
            data-name="The Dental Home Chittaranjan Park Delhi"
            style={{ display: activeClinic === 'delhi' ? 'flex' : 'none' }}
          >
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
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#book" className="btn btn-primary" style={{ width: 'fit-content' }}>Book appointment</a>
              <a
                href={CLINICS.delhi.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Open directions to Delhi Clinic in Google Maps"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Get directions
              </a>
            </div>
          </div>

          {/* Faridabad Clinic */}
          <div
            className="loc-info"
            id="info-faridabad"
            data-lat="28.40478"
            data-lng="77.35598"
            data-name="The Dental Home - Faridabad"
            style={{ display: activeClinic === 'faridabad' ? 'flex' : 'none' }}
          >
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
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#book" className="btn btn-primary" style={{ width: 'fit-content' }}>Book appointment</a>
              <a
                href={CLINICS.faridabad.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                title="Open directions to Faridabad Clinic in Google Maps"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Get directions
              </a>
            </div>
          </div>

          <div
            className="loc-map"
            onClick={() => openDirections(activeClinic)}
            title="Click to get directions in Google Maps"
            style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
          >
            <div id="leaflet-map" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
              <iframe
                title="The Dental Home location on Google Maps"
                src={CLINICS[activeClinic]?.mapSrc || CLINICS.delhi.mapSrc}
                style={{ border: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              />
            </div>

            {/* Clickable overlay to guarantee click response across all browsers */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                background: 'transparent'
              }}
            />

            {/* Top right prompt badge */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 3,
                background: 'rgba(26, 26, 26, 0.82)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '11.5px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                pointerEvents: 'none'
              }}
            >
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#2ECC71' }} />
              <span>Click map for directions</span>
            </div>

            {/* Floating bottom badge */}
            <a
              href={CLINICS[activeClinic]?.directionsUrl || CLINICS.delhi.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="map-directions-badge"
              style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                zIndex: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                color: 'var(--teal-primary, #0D7C66)',
                padding: '10px 16px',
                borderRadius: '100px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                fontWeight: 600,
                fontSize: '12.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                border: '1px solid rgba(13, 124, 102, 0.25)',
                cursor: 'pointer'
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span>Get directions to {activeClinic === 'faridabad' ? 'Faridabad Clinic' : 'CR Park Clinic'}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;