import React from 'react';

const Team = () => {
  return (
    <>
      <section id="team">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Meet our doctors</div>
              <h2>Experienced dentists who truly care</h2>
            </div>
            <p className="lede">Both doctors are here every day, so you always see a familiar face.</p>
          </div>
          <div className="team-grid reveal">
            <div className="doctor-card" data-doctor="yadav" role="button" tabIndex="0" aria-haspopup="dialog">
              <img className="doctor-avatar" src="/assets/doctor-male.jpeg" alt="Dr. Sukhwant Singh Yadav" style={{ objectFit: 'cover' }} />
              <p className="doctor-name">Dr. Sukhwant Singh Yadav</p>
              <p className="doctor-role">Endodontist, Dentist</p>
              <span className="doctor-clinic-tag tag-downtown">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rust-deep)', display: 'inline-block' }}></span>
                The Dental Home
              </span>
              <div className="doctor-quals">
                <span className="qual-pill">MDS - Conservative Dentistry &amp; Endodontics</span>
                <span className="qual-pill">BDS</span>
                <span className="qual-pill">17 years experience</span>
              </div>
              <p className="doctor-hint">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                View full credentials
              </p>
            </div>
            <div className="doctor-card" data-doctor="chaurasiya" role="button" tabIndex="0" aria-haspopup="dialog">
              <img className="doctor-avatar" src="/assets/doctor-female.jpg" alt="Dr. Sushma Chaurasia" style={{ objectFit: 'cover' }} />
              <p className="doctor-name">Dr. Sushma Chaurasia</p>
              <p className="doctor-role">Dentist, Orthodontist</p>
              <span className="doctor-clinic-tag tag-downtown">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rust-deep)', display: 'inline-block' }}></span>
                The Dental Home
              </span>
              <div className="doctor-quals">
                <span className="qual-pill">BDS</span>
                <span className="qual-pill">MDS - Orthodontics</span>
                <span className="qual-pill">18 years experience</span>
              </div>
              <p className="doctor-hint">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                View full credentials
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="modal-overlay" id="doctor-modal" role="dialog" aria-modal="true" aria-labelledby="modal-doc-name">
        <div className="modal-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <button className="modal-close" id="modal-close" aria-label="Close" style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
            <svg width="15" height="15" viewBox="0 0 15 15">
              <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <div className="modal-head" style={{ padding: '36px 36px 16px 36px', borderBottom: '1px solid var(--line)' }}>
            <div className="modal-avatar" id="modal-avatar"></div>
            <div>
              <p className="doctor-name" id="modal-doc-name"></p>
              <p className="doctor-role" id="modal-doc-role"></p>
              <span className="doctor-clinic-tag" id="modal-doc-tag"></span>
            </div>
          </div>

          <div style={{ position: 'relative', flex: 1 }}>
            <div id="modal-slider-wrapper" style={{ display: 'flex', width: '200%', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {/* Pane 1: Profile */}
              <div style={{ width: '50%', padding: '24px 36px 36px 36px', maxHeight: '60vh', overflowY: 'auto' }}>
                <p className="modal-bio" id="modal-bio"></p>
                <p className="modal-section-label">Credentials</p>
                <ul className="modal-qual-list" id="modal-qual-list"></ul>
              </div>
              {/* Pane 2: Certifications */}
              <div style={{ width: '50%', padding: '24px 36px 36px 36px', maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <p className="modal-section-label" style={{ fontWeight: 500, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '16px' }}>
                  Certifications & Achievements
                </p>
                <div id="modal-carousel-container" style={{ flex: 1, minHeight: '320px', width: '100%' }}></div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button id="modal-prev-btn" className="modal-nav-pill modal-nav-prev" aria-label="Previous pane">
              <span className="nav-ripple"></span>
              <svg className="nav-arrow-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="nav-label">Back</span>
            </button>
            <button id="modal-next-btn" className="modal-nav-pill modal-nav-next" aria-label="Next pane">
              <span className="nav-ripple"></span>
              <span className="nav-label">Certificates</span>
              <svg className="nav-arrow-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Team;

