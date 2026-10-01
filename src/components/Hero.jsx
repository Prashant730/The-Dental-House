import React from 'react';

const Hero = () => {
  return (
    <>
      <section className="hero">
        <video id="hero-video" preload="auto" autoPlay muted loop playsInline>
          <source src="assets/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="watermark-cover" id="teeth-scene">
          <div className="scene">
            <svg id="teeth-svg" viewBox="0 0 680 320" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} role="img">
              <title>Interactive teeth brushing animation</title>
              <desc>A smiling mouth with anatomically shaped teeth. Hover over teeth to see their names, click to make them sparkle, or drag the toothbrush to brush manually.</desc>
              <defs>
                <clipPath id="mouthClip">
                  <rect x="40" y="20" width="600" height="280" rx="50" />
                </clipPath>
                <linearGradient id="gumTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4647A" />
                  <stop offset="40%" stopColor="#E8899A" />
                  <stop offset="100%" stopColor="#F2B0BC" />
                </linearGradient>
                <linearGradient id="gumBot" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#D4647A" />
                  <stop offset="40%" stopColor="#E8899A" />
                  <stop offset="100%" stopColor="#F2B0BC" />
                </linearGradient>
                <linearGradient id="toothFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#FAFAFA" />
                  <stop offset="100%" stopColor="#F0EDE8" />
                </linearGradient>
                <linearGradient id="toothGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FFF8F0" />
                </linearGradient>
                <linearGradient id="gleam" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="40%" stopColor="rgba(255,255,255,0.55)" />
                  <stop offset="60%" stopColor="rgba(255,255,255,0.55)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
                <radialGradient id="tongue" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#E86B7A" />
                  <stop offset="100%" stopColor="#C94F5F" />
                </radialGradient>
                <filter id="toothShadow" x="-4%" y="-4%" width="108%" height="112%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#B0A090" floodOpacity="0.18" />
                </filter>
                <filter id="toothHoverGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FFD700" floodOpacity="0.5" />
                </filter>
              </defs>

              <rect x="40" y="20" width="600" height="280" rx="50" fill="#8B2035" />

              <g clipPath="url(#mouthClip)">
                <ellipse cx="340" cy="185" rx="180" ry="65" fill="url(#tongue)" opacity="0.7" />

                <path
                  d="M40,20 L640,20 L640,120 Q590,135 540,128 Q490,122 440,130 Q390,138 340,130 Q290,122 240,130 Q190,138 140,128 Q90,120 40,130 Z"
                  fill="url(#gumTop)" />

                <g className="teeth-group" filter="url(#toothShadow)">
                  <path className="tooth" data-tooth="Upper Left Molar"
                    d="M72,72 Q72,58 78,50 Q84,42 92,42 Q100,42 106,50 Q112,58 112,72 L112,120 Q92,126 72,120 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Upper Left Premolar"
                    d="M120,66 Q120,50 127,43 Q134,36 141,36 Q148,36 155,43 Q162,50 162,66 L162,118 Q141,124 120,118 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Upper Left Canine"
                    d="M172,60 Q172,42 180,32 Q185,26 190,26 Q195,26 200,32 Q208,42 208,60 L208,116 Q190,122 172,116 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Upper Left Lateral Incisor"
                    d="M218,64 Q218,46 226,38 Q232,32 238,32 Q244,32 250,38 Q258,46 258,64 L258,116 Q238,122 218,116 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Upper Left Central Incisor"
                    d="M268,60 Q268,40 278,32 Q286,26 296,26 Q306,26 314,32 Q324,40 324,60 L324,118 Q296,124 268,118 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Upper Right Central Incisor"
                    d="M334,60 Q334,40 344,32 Q352,26 362,26 Q372,26 380,32 Q390,40 390,60 L390,118 Q362,124 334,118 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Upper Right Lateral Incisor"
                    d="M400,64 Q400,46 408,38 Q414,32 420,32 Q426,32 432,38 Q440,46 440,64 L440,116 Q420,122 400,116 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Upper Right Canine"
                    d="M450,60 Q450,42 458,32 Q463,26 468,26 Q473,26 478,32 Q486,42 486,60 L486,116 Q468,122 450,116 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Upper Right Premolar"
                    d="M496,66 Q496,50 503,43 Q510,36 517,36 Q524,36 531,43 Q538,50 538,66 L538,118 Q517,124 496,118 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Upper Right Molar"
                    d="M548,72 Q548,58 554,50 Q560,42 568,42 Q576,42 582,50 Q588,58 588,72 L588,120 Q568,126 548,120 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                </g>

                <path
                  d="M40,300 L640,300 L640,195 Q590,182 540,190 Q490,198 440,188 Q390,178 340,188 Q290,198 240,188 Q190,178 140,190 Q90,200 40,188 Z"
                  fill="url(#gumBot)" />

                <g className="teeth-group" filter="url(#toothShadow)">
                  <path className="tooth" data-tooth="Lower Left Molar"
                    d="M72,248 Q72,262 78,270 Q84,278 92,278 Q100,278 106,270 Q112,262 112,248 L112,198 Q92,192 72,198 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Lower Left Premolar"
                    d="M120,252 Q120,268 127,275 Q134,282 141,282 Q148,282 155,275 Q162,268 162,252 L162,200 Q141,194 120,200 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Lower Left Canine"
                    d="M172,258 Q172,276 180,286 Q185,292 190,292 Q195,292 200,286 Q208,276 208,258 L208,202 Q190,196 172,202 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Lower Left Lateral Incisor"
                    d="M220,256 Q220,272 227,280 Q232,286 237,286 Q242,286 247,280 Q254,272 254,256 L254,202 Q237,196 220,202 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Lower Left Central Incisor"
                    d="M264,254 Q264,272 273,280 Q280,286 288,286 Q296,286 303,280 Q312,272 312,254 L312,200 Q288,194 264,200 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Lower Right Central Incisor"
                    d="M322,254 Q322,272 331,280 Q338,286 346,286 Q354,286 361,280 Q370,272 370,254 L370,200 Q346,194 322,200 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Lower Right Lateral Incisor"
                    d="M382,256 Q382,272 389,280 Q394,286 399,286 Q404,286 409,280 Q416,272 416,256 L416,202 Q399,196 382,202 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Lower Right Canine"
                    d="M428,258 Q428,276 436,286 Q441,292 446,292 Q451,292 456,286 Q464,276 464,258 L464,202 Q446,196 428,202 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Lower Right Premolar"
                    d="M476,252 Q476,268 483,275 Q490,282 497,282 Q504,282 511,275 Q518,268 518,252 L518,200 Q497,194 476,200 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                  <path className="tooth" data-tooth="Lower Right Molar"
                    d="M528,248 Q528,262 534,270 Q540,278 548,278 Q556,278 562,270 Q568,262 568,248 L568,198 Q548,192 528,198 Z"
                    fill="url(#toothFill)" stroke="#E0DBD4" strokeWidth="0.8" />
                </g>

                <rect className="gleam-bar" x="-100" y="30" width="80" height="95" fill="url(#gleam)" opacity="0.6" />

                <circle className="foam f1" cx="160" cy="110" r="4" fill="#fff" opacity="0" />
                <circle className="foam f2" cx="280" cy="105" r="3" fill="#fff" opacity="0" />
                <circle className="foam f3" cx="400" cy="112" r="3.5" fill="#fff" opacity="0" />
                <circle className="foam f4" cx="520" cy="108" r="3" fill="#fff" opacity="0" />
                <circle className="foam f5" cx="220" cy="200" r="3.5" fill="#fff" opacity="0" />
                <circle className="foam f6" cx="360" cy="195" r="4" fill="#fff" opacity="0" />
                <circle className="foam f7" cx="480" cy="202" r="3" fill="#fff" opacity="0" />

                <g id="click-sparkles"></g>
              </g>
            </svg>

            <div className="brush" id="toothbrush">
              <div className="handle">
                <div className="handle-grip"></div>
              </div>
              <div className="bristle-wrap">
                <div className="bristles">
                  <div className="bristle-row"></div>
                  <div className="bristle-row"></div>
                  <div className="bristle-row"></div>
                </div>
              </div>
            </div>

            <span className="sparkle sp1"></span>
            <span className="sparkle sp2"></span>
            <span className="sparkle sp3"></span>
            <span className="sparkle sp4"></span>
            <span className="sparkle sp5"></span>
            <span className="sparkle sp6"></span>

            <div className="tooth-tooltip" id="tooth-tooltip"></div>

            <div className="drag-hint" id="drag-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v8M12 2l-3 3M12 2l3 3M12 22v-8M12 22l-3-3M12 22l3-3M2 12h8M2 12l3-3M2 12l3 3M22 12h-8M22 12l-3-3M22 12l3 3"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Drag to brush!
            </div>
          </div>
        </div>
        <div className="wrap">
          <div className="hero-content">
            <div className="eyebrow">Excellence in Dental Care</div>
            <h1>Welcome to The Dental Home</h1>
            <p className="lede" style={{ marginTop: '20px', marginBottom: '20px' }}>
              A trusted dental practice in New Delhi & Faridabad led by AIIMS-trained specialists. We combine clinical
              excellence with warmth and transparency to help you achieve a healthy, confident smile.
            </p>
            <div className="hero-actions">
              <a href="#book" className="btn btn-primary">Book a visit</a>
              <a href="#services" className="btn btn-ghost">See services</a>
            </div>
          </div>
        </div>
      </section>

      <div className="trust">
        <div className="wrap">
          <div className="trust-track" id="trust-track">
            <span className="trust-item">Root Canal Treatment</span>
            <span className="trust-item">Cosmetic Dentistry &amp; Smile Makeover</span>
            <span className="trust-item">Orthodontics (Braces &amp; Aligners)</span>
            <span className="trust-item">Dental Implants</span>
            <span className="trust-item">Crowns, Bridges &amp; Dentures</span>
            <span className="trust-item">Root Canal Treatment</span>
            <span className="trust-item">Cosmetic Dentistry &amp; Smile Makeover</span>
            <span className="trust-item">Orthodontics (Braces &amp; Aligners)</span>
            <span className="trust-item">Dental Implants</span>
            <span className="trust-item">Crowns, Bridges &amp; Dentures</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
