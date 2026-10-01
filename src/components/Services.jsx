import React from 'react';

const Services = () => {
  return (
    <>
      <section id="services">
        <div className="wrap">
          <div className="section-head reveal" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="eyebrow">Our Services</div>
            <h2>Complete dental care for every smile</h2>
            <p className="lede" style={{ marginTop: '18px', maxWidth: '50ch' }}>
              From preventive checkups to advanced restorative and cosmetic treatment — everything your smile needs, under one roof.
            </p>

            <svg className="wave" width="140" height="10" viewBox="0 0 140 10" fill="none" style={{ marginTop: '34px', opacity: 0.55 }}>
              <path d="M1 5C11 -1 21 11 31 5C41 -1 51 11 61 5C71 -1 81 11 91 5C101 -1 111 11 121 5C126 2 131 2 139 5" stroke="var(--rust)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="svc-grid reveal">
            <div className="svc-card" data-long-desc="Dental crowns and bridges are restorative treatments used to repair damaged or weakened teeth and replace missing teeth. They help restore the appearance, strength, and function of your smile while providing a natural-looking result.">
              <div className="svc-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                  <path d="M12 3l3 3h-6l3-3z" />
                  <rect x="7" y="7" width="10" height="9" rx="3" />
                  <path d="M9 20v-1M12 20v-2M15 20v-1" />
                </svg>
              </div>
              <h3>Crown &amp; Bridge</h3>
              <p className="desc">Restore damaged or missing teeth with durable, natural-looking crowns and bridges that improve both function and appearance.</p>
              <a className="svc-learn">Learn more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            </div>
            <div className="svc-card" data-long-desc="Dental implants provide a long-term solution for replacing missing teeth. An implant is placed into the jawbone to support a dental crown or other restoration, helping restore chewing function and create a natural-looking smile.">
              <div className="svc-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                  <path d="M12 4c-3 0-5 2-5 5 0 4 2 9 3 10s1-4 2-4 1 4 2 4 3-6 3-10c0-3-2-5-5-5z" />
                  <path d="M12 9v6" />
                </svg>
              </div>
              <h3>Dental Implant</h3>
              <p className="desc">A reliable tooth-replacement solution designed to restore the function, appearance, and confidence of your smile.</p>
              <a className="svc-learn">Learn more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            </div>
            <div className="svc-card" data-long-desc="Orthodontic treatment helps correct crooked, crowded, or misaligned teeth and improve the overall bite. Customized treatment plans gradually move the teeth into a healthier and more balanced position for an improved smile.">
              <div className="svc-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                  <rect x="4" y="9" width="4" height="4" rx="1" />
                  <rect x="16" y="9" width="4" height="4" rx="1" />
                  <path d="M8 11h8" />
                  <path d="M10 15c0 2 1 3 2 3s2-1 2-3" />
                </svg>
              </div>
              <h3>Orthodontic Treatment</h3>
              <p className="desc">Customized orthodontic treatment to improve tooth alignment, bite, and overall smile appearance.</p>
              <a className="svc-learn">Learn more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            </div>
            <div className="svc-card" data-long-desc="Transform your smile with personalized cosmetic dentistry treatments designed to improve the appearance of your teeth, including their shape, alignment, color, and overall aesthetics. Our smile makeover approach is tailored to create a natural-looking and confident smile.">
              <div className="svc-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                  <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
                </svg>
              </div>
              <h3>Cosmetic Dentistry &amp; Smile Makeover</h3>
              <p className="desc">Personalized cosmetic dentistry designed to enhance the appearance of your smile and create a natural, confident look.</p>
              <a className="svc-learn">Learn more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            </div>
            <div className="svc-card" data-long-desc="Root canal treatment is used to treat infection or inflammation inside a tooth while preserving the natural tooth whenever possible. The infected tissue is removed, the tooth is cleaned and sealed, and it can then be restored for normal function.">
              <div className="svc-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                  <path d="M12 4c-3 0-5 2-5 5 0 4 2 9 3 10s.7-3 2-3 1.3 3 2 3 3-6 3-10c0-3-2-5-5-5z" />
                  <path d="M12 9v5" />
                  <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h3>Root Canal Treatment</h3>
              <p className="desc">A tooth-saving treatment that removes infection from inside the tooth and helps restore normal dental function.</p>
              <a className="svc-learn">Learn more <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            </div>
            <a href="#book" className="svc-card cta" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="svc-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                  <rect x="4" y="5" width="16" height="15" rx="2" />
                  <path d="M4 9h16M8 3v4M16 3v4" />
                  <path d="M9 14l2 2 4-4" />
                </svg>
              </div>
              <h3>Not sure where to start?</h3>
              <p className="desc">Book a consultation and we'll map out the right treatment for you.</p>
              <span className="svc-learn">Book a visit <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </a>
          </div>
        </div>
      </section>

      <div className="modal-overlay" id="service-modal" role="dialog" aria-modal="true" aria-labelledby="modal-service-name">
        <div className="modal-panel" style={{ maxWidth: '540px', padding: 0, overflow: 'hidden', position: 'relative' }}>
          <button className="modal-close" id="service-modal-close" aria-label="Close" style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <svg width="12" height="12" viewBox="0 0 15 15">
              <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <img id="modal-service-img" src="" alt="Service Photo" style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', display: 'block', background: 'var(--ivory-deep)' }} />
          <div style={{ padding: '28px 24px' }}>
            <h3 id="modal-service-name" style={{ marginBottom: '12px', fontSize: '24px' }}></h3>
            <p id="modal-service-desc" style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: '1.6' }}></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
