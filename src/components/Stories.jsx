import React from 'react';

const Stories = () => {
  return (
    <section id="stories">
      <div className="wrap">
        <div className="eyebrow">Patient stories</div>
        <div className="section-head reveal" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <h2>What our patients say</h2>
        </div>
        <div className="t-wrap reveal" id="reviews-container">
          {/* Reviews will be loaded dynamically here via JS */}
        </div>
      </div>
    </section>
  );
};

export default Stories;

