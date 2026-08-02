
  // --- Interactive teeth animation ---
  (function(){
    const scene = document.querySelector('.scene');
    const svg = document.getElementById('teeth-svg');
    const brush = document.getElementById('toothbrush');
    const tooltip = document.getElementById('tooth-tooltip');
    const dragHint = document.getElementById('drag-hint');
    const clickSparklesG = document.getElementById('click-sparkles');
    if(!scene || !svg || !brush) return;

    // Let the SVG not block mouse events on the brush div.
    // Individual .tooth paths get pointer-events:all from CSS.
    svg.style.pointerEvents = 'none';

    // --- Tooth hover tooltip (scene-level tracking) ---
    const teeth = svg.querySelectorAll('.tooth');
    let currentToothEl = null;

    // Use scene-level mousemove to track which tooth is under cursor.
    // This avoids sticky tooltips caused by unreliable mouseleave on SVG paths.
    scene.addEventListener('mousemove', (e) => {
      // Temporarily enable SVG pointer-events to do hit-test
      svg.style.pointerEvents = '';
      const el = document.elementFromPoint(e.clientX, e.clientY);
      svg.style.pointerEvents = 'none';

      if(el && el.classList && el.classList.contains('tooth')){
        const name = el.getAttribute('data-tooth');
        if(name){
          tooltip.textContent = name;
          tooltip.classList.add('visible');
          const rect = scene.getBoundingClientRect();
          tooltip.style.left = (e.clientX - rect.left) + 'px';
          tooltip.style.top = (e.clientY - rect.top - 24) + 'px';
        }
        currentToothEl = el;
      } else {
        tooltip.classList.remove('visible');
        currentToothEl = null;
      }
    });

    // Hide tooltip when cursor leaves the scene entirely
    scene.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
      currentToothEl = null;
    });

    // --- Click sparkle burst ---
    teeth.forEach(tooth => {
      tooth.addEventListener('click', (e) => {
        tooth.classList.add('clicked');
        setTimeout(() => tooth.classList.remove('clicked'), 400);
        createSparkleBurst(e, tooth);
      });
    });

    // Auto-hide drag hint after 5s
    if(dragHint){
      setTimeout(() => {
        dragHint.style.opacity = '0';
        dragHint.style.transition = 'opacity 0.5s ease';
      }, 7000);
    }


    function createSparkleBurst(e, tooth){
      const pt = svg.createSVGPoint();
      const ctm = svg.getScreenCTM();
      if(!ctm) return;
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPt = pt.matrixTransform(ctm.inverse());
      const cx = svgPt.x;
      const cy = svgPt.y;

      const colors = ['#FFD700', '#FFA500', '#FF6347', '#FFFFFF', '#87CEEB', '#98FB98'];
      for(let i = 0; i < 8; i++){
        const angle = (Math.PI * 2 * i) / 8;
        const dist = 15 + Math.random() * 15;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const size = 3 + Math.random() * 4;

        const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        star.setAttribute('cx', cx);
        star.setAttribute('cy', cy);
        star.setAttribute('r', size);
        star.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
        star.classList.add('click-star');
        star.style.setProperty('--dx', dx + 'px');
        star.style.setProperty('--dy', dy + 'px');
        clickSparklesG.appendChild(star);
        setTimeout(() => star.remove(), 650);
      }
    }

    // --- Draggable toothbrush ---
    let isDragging = false;
    let grabOffsetX = 0;
    let grabOffsetY = 0;
    let hintHidden = false;
    let resumeTimer = null;
    let rafId = null;
    let pendingX = 0;
    let pendingY = 0;

    brush.addEventListener('mousedown', startDrag);
    brush.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e){
      e.preventDefault();
      e.stopPropagation();

      // Clear any pending resume
      if(resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }

      isDragging = true;

      // Freeze the animation: read the current computed position, then kill animation
      const brushComp = window.getComputedStyle(brush);
      const curLeft = brushComp.left;
      const curTop = brushComp.top;
      const curTransform = brushComp.transform;

      // Kill animation and pin to current position
      brush.style.animation = 'none';
      brush.style.left = curLeft;
      brush.style.top = curTop;
      brush.style.transform = curTransform;
      brush.classList.add('dragging');

      // Force reflow so animation: none takes effect
      void brush.offsetHeight;

      const sceneRect = scene.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Calculate grab offset: where inside the brush the user clicked
      const brushLeft = parseFloat(curLeft) || 0;
      const brushTop = parseFloat(curTop) || 0;
      grabOffsetX = clientX - sceneRect.left - brushLeft;
      grabOffsetY = clientY - sceneRect.top - brushTop;

      if(!hintHidden && dragHint){
        dragHint.style.opacity = '0';
        dragHint.style.transition = 'opacity 0.3s ease';
        hintHidden = true;
      }

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
    }

    function onDrag(e){
      if(!isDragging) return;
      e.preventDefault();

      const sceneRect = scene.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let x = clientX - sceneRect.left - grabOffsetX;
      let y = clientY - sceneRect.top - grabOffsetY;

      // Clamp within the scene bounds
      const maxX = sceneRect.width - brush.offsetWidth;
      const maxY = sceneRect.height - brush.offsetHeight;
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      pendingX = x;
      pendingY = y;

      if(!rafId){
        rafId = requestAnimationFrame(applyDragPosition);
      }
    }

    function applyDragPosition(){
      rafId = null;
      if(!isDragging) return;

      brush.style.left = pendingX + 'px';
      brush.style.top = pendingY + 'px';
      // Subtle rotation based on horizontal position
      const sceneW = scene.getBoundingClientRect().width;
      const rotAngle = ((pendingX / sceneW) * 16 - 8);
      brush.style.transform = 'rotate(' + rotAngle.toFixed(1) + 'deg)';

      // Check brush–tooth collision
      checkBrushCollision();
    }

    function endDrag(){
      isDragging = false;
      brush.classList.remove('dragging');
      if(rafId){ cancelAnimationFrame(rafId); rafId = null; }

      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);

      // Resume the auto animation after 1.2s
      resumeTimer = setTimeout(() => {
        if(!isDragging){
          brush.style.animation = '';
          brush.style.left = '';
          brush.style.top = '';
          brush.style.transform = '';
        }
      }, 1200);
    }

    function checkBrushCollision(){
      const bristleEl = brush.querySelector('.bristle-wrap');
      if(!bristleEl) return;
      const bristleRect = bristleEl.getBoundingClientRect();

      teeth.forEach(tooth => {
        const bbox = tooth.getBoundingClientRect();
        const overlap = !(bristleRect.right < bbox.left || bristleRect.left > bbox.right ||
                          bristleRect.bottom < bbox.top || bristleRect.top > bbox.bottom);
        if(overlap && !tooth.classList.contains('brushed')){
          tooth.classList.add('brushed');
          setTimeout(() => tooth.classList.remove('brushed'), 2000);
        }
      });
    }
  })();

  // --- Hero background video ---
  (function(){
    const video = document.getElementById('hero-video');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReducedMotion){
      video.pause();
    } else {
      video.addEventListener('loadedmetadata', () => { video.playbackRate = 0.75; });
      video.play().catch(() => {});
    }
  })();

  // doctor credential modal
  const doctorData = {
    yadav: {
      name: 'Dr. Sukhbat Yadav', role: 'General & cosmetic dentistry', clinic: 'downtown', initials: 'SY',
      bio: 'Dr. Sukhbat Yadav leads The Dental Home with a focus on cosmetic and restorative dentistry. He believes in painless procedures and uses the latest technology to deliver the best results.',
      quals: ['BDS â€” Bachelor of Dental Surgery', 'MDS â€” Master of Dental Surgery', 'Specialist in cosmetic dentistry', 'Advanced implantology training', 'Member, Indian Dental Association']
    },
    chaurasiya: {
      name: 'Dr. Sushma Chaurasiya', role: 'Orthodontics & pediatric dentistry', clinic: 'downtown', initials: 'SC',
      bio: 'Dr. Sushma Chaurasiya specialises in orthodontic treatments and pediatric care. She has a gentle approach that puts even the most anxious patients at ease.',
      quals: ['BDS â€” Bachelor of Dental Surgery', 'MDS â€” Orthodontics & Dentofacial Orthopaedics', 'Certified in clear aligner therapy', 'Specialist in pediatric dentistry', 'Member, Indian Orthodontic Society']
    }
  };
  const modal = document.getElementById('doctor-modal');
  const modalAvatar = document.getElementById('modal-avatar');
  const modalName = document.getElementById('modal-doc-name');
  const modalRole = document.getElementById('modal-doc-role');
  const modalTag = document.getElementById('modal-doc-tag');
  const modalBio = document.getElementById('modal-bio');
  const modalQualList = document.getElementById('modal-qual-list');
  let lastFocused = null;

  function openDoctorModal(id){
    const d = doctorData[id];
    if(!d) return;
    modalAvatar.textContent = d.initials;
    modalAvatar.className = 'modal-avatar avatar-downtown';
    modalName.textContent = d.name;
    modalRole.textContent = d.role;
    modalTag.className = 'doctor-clinic-tag tag-downtown';
    modalTag.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:var(--rust-deep);display:inline-block;"></span>The Dental Home';
    modalBio.textContent = d.bio;
    modalQualList.innerHTML = d.quals.map(q => '<li><svg viewBox="0 0 24 24" fill="none" style="color:var(--rust)"><path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>' + q + '</span></li>').join('');
    lastFocused = document.activeElement;
    modal.classList.add('open');
    document.getElementById('modal-close').focus();
    document.body.style.overflow = 'hidden';
  }
  function closeDoctorModal(){
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if(lastFocused) lastFocused.focus();
  }
  document.querySelectorAll('.doctor-card').forEach(card => {
    card.addEventListener('click', () => openDoctorModal(card.dataset.doctor));
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openDoctorModal(card.dataset.doctor); }
    });
  });
  document.getElementById('modal-close').addEventListener('click', closeDoctorModal);
  modal.addEventListener('click', e => { if(e.target === modal) closeDoctorModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal.classList.contains('open')) closeDoctorModal(); });

  // sticky header shadow (optimized)
  const header = document.getElementById('site-header');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 8);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // testimonial carousel
  const slides = document.querySelectorAll('.t-slide');
  const dots = document.querySelectorAll('.t-dot');
  let current = 0, timer;
  function showSlide(i){
    slides.forEach((s,idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d,idx) => d.classList.toggle('active', idx === i));
    current = i;
  }
  dots.forEach(dot => dot.addEventListener('click', () => { showSlide(+dot.dataset.i); restart(); }));
  function restart(){
    clearInterval(timer);
    timer = setInterval(() => showSlide((current + 1) % slides.length), 6000);
  }
  restart();
  document.querySelector('.t-wrap').addEventListener('mouseenter', () => clearInterval(timer));
  document.querySelector('.t-wrap').addEventListener('mouseleave', restart);

  // faq accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = 0; });
      if(!isOpen){
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  revealEls.forEach(el => io.observe(el));

  // Initialize Leaflet Map
  window.clinicMap = L.map('leaflet-map').setView([28.5396, 77.2477], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
  }).addTo(window.clinicMap);
  window.clinicMarker = L.marker([28.5396, 77.2477]).addTo(window.clinicMap).bindPopup("The Dental Home - Delhi");

  // --- Accurate Distance Calculator with Route Switching ---
  (function(){
    let CLINIC_LAT = 28.5396;
    let CLINIC_LNG = 77.2477;
    const OSRM_BASE = 'https://router.project-osrm.org/route/v1';
    const btn = document.getElementById('calc-dist-btn');
    const results = document.getElementById('dist-results');
    const errorEl = document.getElementById('dist-error');
    const recalcBtn = document.getElementById('dist-recalc-btn');
    const straightEl = document.getElementById('dist-straight');
    const modeRows = document.querySelectorAll('.dist-clickable');

    // Route colors per mode
    const MODE_COLORS = {
      driving: { color: '#C96A4A', weight: 5, opacity: 0.85, dashArray: null },
      walking: { color: '#27AE60', weight: 4, opacity: 0.8,  dashArray: '8, 6' },
      bus:     { color: '#E67E22', weight: 5, opacity: 0.8,  dashArray: null },
      metro:   { color: '#8E44AD', weight: 5, opacity: 0.8,  dashArray: '12, 8' }
    };

    // Store computed route data for each mode
    let routeData = {};
    let savedUserLat = null, savedUserLon = null;

    // Location Tabs Logic
    const tabs = document.querySelectorAll('.clinic-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('btn-primary', 'active'));
        tabs.forEach(t => t.classList.add('btn-ghost'));
        e.target.classList.remove('btn-ghost');
        e.target.classList.add('btn-primary', 'active');
        
        const targetId = e.target.getAttribute('data-target');
        document.querySelectorAll('.loc-info').forEach(info => {
          info.style.display = 'none';
        });
        const activeInfo = document.getElementById('info-' + targetId);
        activeInfo.style.display = ''; // revert to flex
        
        CLINIC_LAT = parseFloat(activeInfo.getAttribute('data-lat'));
        CLINIC_LNG = parseFloat(activeInfo.getAttribute('data-lng'));
        const name = activeInfo.getAttribute('data-name');
        
        window.clinicMap.setView([CLINIC_LAT, CLINIC_LNG], 14);
        window.clinicMarker.setLatLng([CLINIC_LAT, CLINIC_LNG]).bindPopup(name).openPopup();
        
        // Clear old routes from map when switching clinics
        if (window.currentRouteLayer) {
          window.clinicMap.removeLayer(window.currentRouteLayer);
        }
        
        if(savedUserLat && savedUserLon) {
           btn.click(); // Auto recalc distance for new location
        }
      });
    });

    btn.addEventListener('click', calculate);
    if(recalcBtn) recalcBtn.addEventListener('click', () => {
      recalcBtn.style.display = 'none';
      calculate();
    });

    // Click-to-switch-route on each mode row
    modeRows.forEach(row => {
      row.addEventListener('click', () => {
        const mode = row.dataset.mode;
        if(row.classList.contains('disabled')) return;
        if(!routeData[mode]) return;

        // Highlight active row
        modeRows.forEach(r => r.classList.remove('active'));
        row.classList.add('active');

        // Draw this mode's route
        drawRoute(mode);
      });
    });

    async function calculate(){
      btn.textContent = 'Locating…';
      btn.disabled = true;
      errorEl.style.display = 'none';
      routeData = {};

      if(!navigator.geolocation){
        showError('Geolocation is not supported by your browser.');
        return;
      }

      try {
        const pos = await getPosition();
        savedUserLat = pos.coords.latitude;
        savedUserLon = pos.coords.longitude;

        btn.textContent = 'Calculating routes…';

        // Show results area
        btn.style.display = 'none';
        results.style.display = 'block';
        document.querySelectorAll('.dist-row').forEach(el => el.style.display = 'flex');
        modeRows.forEach(r => { r.classList.remove('disabled'); r.classList.remove('active'); });

        // Straight-line distance (Vincenty formula)
        const straightDist = vincentyDistance(savedUserLat, savedUserLon, CLINIC_LAT, CLINIC_LNG);
        if(straightEl){
          straightEl.textContent = `📍 Straight-line: ${straightDist.toFixed(2)} km`;
        }

        // Fetch driving route from OSRM
        const drivingResult = await fetchOSRM('driving', savedUserLon, savedUserLat);

        // === DRIVING ===
        let drivingDist, drivingTime;
        if(drivingResult){
          drivingDist = drivingResult.distance / 1000;
          drivingTime = drivingResult.duration / 60;
          routeData.driving = { geometry: drivingResult.geometry, dist: drivingDist, time: drivingTime };
        } else {
          drivingDist = straightDist * 1.35;
          drivingTime = straightDist < 30 ? (drivingDist / 25) * 60 : (drivingDist / 55) * 60;
          // Fallback: straight-line route
          routeData.driving = { straight: true, dist: drivingDist, time: drivingTime };
        }
        const drivingSpeed = (drivingDist / (drivingTime / 60));
        setModeUI('dist-car', 'dist-car-speed', drivingDist, drivingTime, drivingSpeed);

        // === WALKING ===
        const walkRow = document.querySelector('[data-mode="walking"]');
        if(straightDist <= 15){
          const walkDist = drivingDist * 0.85; // walkers take shorter paths
          const walkSpeed = 5; // km/h
          const walkTime = (walkDist / walkSpeed) * 60;
          routeData.walking = { straight: true, dist: walkDist, time: walkTime };
          setModeUI('dist-walk', 'dist-walk-speed', walkDist, walkTime, walkSpeed);
        } else {
          document.getElementById('dist-walk').textContent = 'Too far to walk';
          document.getElementById('dist-walk-speed').textContent = '';
          walkRow.classList.add('disabled');
        }

        // === BUS ===
        const busRow = document.querySelector('[data-mode="bus"]');
        if(straightDist <= 500){
          let busDist, busSpeed, busWait;
          if(straightDist <= 30){
            busDist = drivingDist * 1.25;
            busSpeed = 16;
            busWait = 8;
          } else {
            busDist = drivingDist * 1.1;
            busSpeed = 45;
            busWait = 15;
          }
          const busTime = (busDist / busSpeed) * 60 + busWait;
          const busAvgSpeed = (busDist / (busTime / 60));
          // Bus follows similar road route as driving
          if(drivingResult){
            routeData.bus = { geometry: drivingResult.geometry, dist: busDist, time: busTime };
          } else {
            routeData.bus = { straight: true, dist: busDist, time: busTime };
          }
          setModeUI('dist-bus', 'dist-bus-speed', busDist, busTime, busAvgSpeed);
        } else {
          document.getElementById('dist-bus').textContent = 'Too far for bus';
          document.getElementById('dist-bus-speed').textContent = '';
          busRow.classList.add('disabled');
        }

        // === METRO ===
        const metroRow = document.querySelector('[data-mode="metro"]');
        if(straightDist <= 50){
          const metroDist = straightDist * 1.15;
          const metroSpeed = 33;
          const metroTime = (metroDist / metroSpeed) * 60 + 15;
          const metroAvgSpeed = (metroDist / (metroTime / 60));
          routeData.metro = { straight: true, dist: metroDist, time: metroTime };
          setModeUI('dist-metro', 'dist-metro-speed', metroDist, metroTime, metroAvgSpeed);
        } else {
          document.getElementById('dist-metro').textContent = 'Too far for metro';
          document.getElementById('dist-metro-speed').textContent = '';
          metroRow.classList.add('disabled');
        }

        // Activate driving by default and draw its route
        document.querySelector('[data-mode="driving"]').classList.add('active');
        drawRoute('driving');

        if(recalcBtn) recalcBtn.style.display = '';

      } catch(err) {
        showError(err.message || 'Could not get your location.');
      }
    }

    // --- Set UI for a mode ---
    function setModeUI(distId, speedId, distKm, timeMins, speedKmh){
      document.getElementById(distId).textContent = formatResult(distKm, timeMins);
      document.getElementById(speedId).textContent = `avg ${Math.round(speedKmh)} km/h`;
    }

    // --- Draw a specific mode's route on map ---
    function drawRoute(mode){
      if(!window.clinicMap || !savedUserLat) return;
      const data = routeData[mode];
      if(!data) return;

      // Clear previous route layers
      if(window.routeLayer) window.clinicMap.removeLayer(window.routeLayer);
      if(window.userMarker) window.clinicMap.removeLayer(window.userMarker);

      const style = MODE_COLORS[mode] || MODE_COLORS.driving;

      if(data.geometry && !data.straight){
        // Real OSRM GeoJSON route
        window.routeLayer = L.geoJSON(data.geometry, {
          style: { color: style.color, weight: style.weight, opacity: style.opacity, dashArray: style.dashArray }
        }).addTo(window.clinicMap);
      } else {
        // Straight-line fallback
        window.routeLayer = L.polyline(
          [[savedUserLat, savedUserLon], [CLINIC_LAT, CLINIC_LNG]],
          { color: style.color, weight: style.weight - 1, opacity: 0.6, dashArray: '6, 10' }
        ).addTo(window.clinicMap);
      }

      // User marker
      window.userMarker = L.marker([savedUserLat, savedUserLon])
        .addTo(window.clinicMap)
        .bindPopup('📍 Your Location')
        .openPopup();

      window.clinicMap.fitBounds(window.routeLayer.getBounds(), { padding: [40, 40] });
    }

    // --- Geolocation with timeout ---
    function getPosition(){
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, (err) => {
          switch(err.code){
            case 1: reject(new Error('Location access denied. Please allow location permission.')); break;
            case 2: reject(new Error('Location unavailable. Please check your device settings.')); break;
            case 3: reject(new Error('Location request timed out. Please try again.')); break;
            default: reject(new Error('Could not determine your location.'));
          }
        }, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 60000
        });
      });
    }

    // --- OSRM route fetch ---
    async function fetchOSRM(profile, userLon, userLat){
      const url = `${OSRM_BASE}/${profile}/${userLon},${userLat};${CLINIC_LNG},${CLINIC_LAT}?overview=full&geometries=geojson`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if(!res.ok) throw new Error('API error');
        const data = await res.json();
        if(data.routes && data.routes.length > 0) return data.routes[0];
        return null;
      } catch(e){
        clearTimeout(timeoutId);
        return null;
      }
    }

    // --- Vincenty geodesic distance ---
    function vincentyDistance(lat1, lon1, lat2, lon2){
      const a = 6378137, f = 1/298.257223563, b = a*(1-f);
      const toRad = v => v*Math.PI/180;
      const U1 = Math.atan((1-f)*Math.tan(toRad(lat1)));
      const U2 = Math.atan((1-f)*Math.tan(toRad(lat2)));
      const sinU1=Math.sin(U1), cosU1=Math.cos(U1);
      const sinU2=Math.sin(U2), cosU2=Math.cos(U2);
      let lambda = toRad(lon2-lon1), prev, iter=100;
      let sinSig, cosSig, sig, sinA, cosSqA, cos2M;
      do {
        const sL=Math.sin(lambda), cL=Math.cos(lambda);
        sinSig = Math.sqrt((cosU2*sL)**2 + (cosU1*sinU2 - sinU1*cosU2*cL)**2);
        if(!sinSig) return 0;
        cosSig = sinU1*sinU2 + cosU1*cosU2*cL;
        sig = Math.atan2(sinSig, cosSig);
        sinA = cosU1*cosU2*sL/sinSig;
        cosSqA = 1 - sinA**2;
        cos2M = cosSig - 2*sinU1*sinU2/(cosSqA||1);
        const C = f/16*cosSqA*(4+f*(4-3*cosSqA));
        prev = lambda;
        lambda = toRad(lon2-lon1) + (1-C)*f*sinA*(sig + C*sinSig*(cos2M + C*cosSig*(-1+2*cos2M**2)));
      } while(Math.abs(lambda-prev)>1e-12 && --iter>0);
      if(!iter) return haversine(lat1,lon1,lat2,lon2);
      const uSq = cosSqA*(a**2-b**2)/b**2;
      const A2 = 1+uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
      const B2 = uSq/1024*(256+uSq*(-128+uSq*(74-47*uSq)));
      const dS = B2*sinSig*(cos2M+B2/4*(cosSig*(-1+2*cos2M**2)-B2/6*cos2M*(-3+4*sinSig**2)*(-3+4*cos2M**2)));
      return b*A2*(sig-dS)/1000;
    }

    function haversine(lat1,lon1,lat2,lon2){
      const R=6371, toRad=v=>v*Math.PI/180;
      const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
      const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
      return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    }

    // --- Format distance + duration ---
    function formatResult(distKm, mins){
      const d = distKm<1 ? `${Math.round(distKm*1000)} m` : `${distKm.toFixed(1)} km`;
      const t = mins>=60 ? `${Math.floor(mins/60)}h ${Math.round(mins%60)}m` : `${Math.round(mins)} min`;
      return `${d} · ${t}`;
    }

    // --- Show error ---
    function showError(msg){
      btn.textContent = 'Get exact distance';
      btn.disabled = false;
      btn.style.display = '';
      results.style.display = 'block';
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
      document.querySelectorAll('.dist-row').forEach(el => el.style.display = 'none');
      if(straightEl) straightEl.textContent = '';
      if(recalcBtn) recalcBtn.style.display = 'none';
    }
  })();

  // mobile menu (simple scroll-to-nav fallback)
  document.querySelector('.burger').addEventListener('click', () => {
    document.querySelector('#locations').scrollIntoView({ behavior: 'smooth' });
  });

  // Form Submission -> WhatsApp Redirect
  const appForm = document.getElementById('appointment-form');
  if(appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const status = document.getElementById('form-status');
      const honeypot = e.target.querySelector('input[name="_honey"]').value;
      
      if(honeypot) return; // simple spam check

      // Get form values
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const date = document.getElementById('date').value;
      
      const serviceSelect = document.getElementById('service');
      const service = serviceSelect.options[serviceSelect.selectedIndex].text;
      
      const clinicSelect = document.getElementById('clinic');
      const clinic = clinicSelect.options[clinicSelect.selectedIndex].text;
      
      const notes = document.getElementById('notes').value.trim();

      // Construct WhatsApp message
      let msg = `Hello! I would like to book an appointment at The Dental Home.\n\n`;
      msg += `Here are my details:\n`;
      msg += `Name: ${name}\n`;
      msg += `Phone: ${phone}\n`;
      if(email) msg += `Email: ${email}\n`;
      msg += `Clinic: ${clinic}\n`;
      msg += `Preferred Date: ${date}\n`;
      msg += `Service Needed: ${service}\n`;
      if(notes) msg += `Notes: ${notes}\n\n`;
      msg += `Looking forward to your confirmation. Thank you!`;

      const whatsappUrl = `https://wa.me/918264001306?text=${encodeURIComponent(msg)}`;

      btn.innerHTML = `<span style="opacity:0.8;">Redirecting to WhatsApp...</span>`;
      btn.style.pointerEvents = 'none';
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Update UI
      setTimeout(() => {
        e.target.reset();
        btn.innerHTML = `Request Sent via WhatsApp`;
        btn.style.background = 'var(--slate-deep)';
        status.style.display = 'block';
        status.style.color = 'var(--slate-deep)';
        status.textContent = 'If WhatsApp did not open automatically, please click the "WhatsApp Us" button above.';

        // Restore the button and form to its original state after 4 seconds
        setTimeout(() => {
          btn.innerHTML = `Submit`;
          btn.style.background = '';
          btn.style.pointerEvents = '';
          status.style.display = 'none';
        }, 4000);
      }, 1500);
    });
  }
