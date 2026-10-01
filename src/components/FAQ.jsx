import React from 'react';

const FAQ = () => {
  return (
    <section id="faq" style={{ background: 'var(--ivory-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="eyebrow">Before you visit</div>
        <div className="section-head reveal" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <h2>Common questions</h2>
        </div>
        <div className="faq reveal">
          <div className="faq-item open">
            <button className="faq-q"><span>Do you accept insurance?</span><span className="plus"></span></button>
            <div className="faq-a">
              <p>Yes, we accept all major insurance plans and cashless treatment through most TPA networks. Call us to confirm your plan before your visit.</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-q"><span>Is the root canal treatment painful?</span><span className="plus"></span></button>
            <div className="faq-a">
              <p>Not at all. We use modern anaesthesia and advanced rotary instruments that make root canal treatment virtually painless. Most patients are surprised at how comfortable it is.</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-q"><span>Do you treat children?</span><span className="plus"></span></button>
            <div className="faq-a">
              <p>Absolutely! Dr. Sushma specialises in pediatric dentistry. We have a kid-friendly environment and take extra care to make first visits fun and stress-free.</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-q"><span>What are your timings?</span><span className="plus"></span></button>
            <div className="faq-a">
              <p>We're open Wednesday to Monday 5 PM to 9 PM for Faridabad Clinic and Thursday to Tuesday 11 AM to 7 PM for Delhi Clinic.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

