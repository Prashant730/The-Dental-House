import React, { useState, useEffect } from 'react';
import reviewsData from '../data/reviews.json';

const MAX_PREVIEW_LENGTH = 180;

const Stories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expanded, setExpanded] = useState({});
  const total = reviewsData.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [total, isPaused]);

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
    setIsPaused(true);
  };

  return (
    <section id="stories" style={{ background: 'var(--ivory)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="wrap">
        <div className="eyebrow" style={{ textAlign: 'center' }}>Patient stories</div>
        <div className="section-head reveal" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <h2>What our patients say</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px', background: 'var(--ivory-deep)', padding: '6px 16px', borderRadius: '100px', border: '1px solid var(--line)' }}>
            <span style={{ color: '#F4B400', fontSize: '15px' }}>★ ★ ★ ★ ★</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>4.9/5 Rating</span>
            <span style={{ fontSize: '12px', color: 'var(--ink-mute)' }}>• 150+ Verified Google Reviews</span>
          </div>
        </div>

        <div
          className="t-wrap reveal"
          id="reviews-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ position: 'relative', minHeight: '190px' }}
        >
          {reviewsData.map((review, i) => {
            const isLong = review.text.length > MAX_PREVIEW_LENGTH;
            const isExpanded = !!expanded[i];
            const displayText = isLong && !isExpanded
              ? review.text.substring(0, MAX_PREVIEW_LENGTH).trim() + '...'
              : review.text;

            return (
              <div
                key={i}
                className={'t-slide ' + (i === currentIndex ? 'active' : '')}
                style={{ display: i === currentIndex ? 'block' : 'none' }}
              >
                <div style={{ color: '#F4B400', fontSize: '18px', marginBottom: '16px', letterSpacing: '2px' }}>
                  {'★'.repeat(review.rating || 5)}
                </div>
                <p className="t-quote">
                  "{displayText}"
                  {isLong && (
                    <button
                      onClick={() => toggleExpand(i)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--rust)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        marginLeft: '8px',
                        textDecoration: 'underline'
                      }}
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </p>
                <p className="t-name">
                  <strong>{review.author}</strong> <span style={{ opacity: 0.6 }}>•</span> {review.date} <span style={{ opacity: 0.6 }}>•</span> <span style={{ color: 'var(--teal-primary, #0D7C66)', fontWeight: 500 }}>Google Review</span>
                </p>
              </div>
            );
          })}

          {/* Navigation Controls: Arrows and Dots */}
          <div className="t-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
            <button
              onClick={prevSlide}
              aria-label="Previous story"
              style={{
                background: 'none',
                border: '1px solid var(--line)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--ink)',
                fontSize: '18px',
                lineHeight: 1
              }}
            >
              ‹
            </button>

            <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
              {reviewsData.map((_, i) => (
                <button
                  key={i}
                  className={'t-dot ' + (i === currentIndex ? 'active' : '')}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={'Story ' + (i + 1)}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next story"
              style={{
                background: 'none',
                border: '1px solid var(--line)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--ink)',
                fontSize: '18px',
                lineHeight: 1
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stories;