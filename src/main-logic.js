import './DepthCarousel.js';

export default function initMainLogic() {
// --- HTML Sanitization Utility (XSS Protection) ---
function escapeHTML(str) {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(str))
  return div.innerHTML
}

// --- Interactive teeth animation ---
;(function () {
  const scene = document.querySelector('.scene')
  const svg = document.getElementById('teeth-svg')
  const brush = document.getElementById('toothbrush')
  const tooltip = document.getElementById('tooth-tooltip')
  const dragHint = document.getElementById('drag-hint')
  const clickSparklesG = document.getElementById('click-sparkles')
  if (!scene || !svg || !brush) return

  // Let the SVG not block mouse events on the brush div.
  // Individual .tooth paths get pointer-events:all from CSS.
  svg.style.pointerEvents = 'none'

  // --- Tooth hover tooltip (scene-level tracking) ---
  const teeth = svg.querySelectorAll('.tooth')
  let currentToothEl = null

  // Use scene-level mousemove to track which tooth is under cursor.
  // This avoids sticky tooltips caused by unreliable mouseleave on SVG paths.
  scene.addEventListener('mousemove', (e) => {
    // Temporarily enable SVG pointer-events to do hit-test
    svg.style.pointerEvents = ''
    const el = document.elementFromPoint(e.clientX, e.clientY)
    svg.style.pointerEvents = 'none'

    if (el && el.classList && el.classList.contains('tooth')) {
      const name = el.getAttribute('data-tooth')
      if (name) {
        tooltip.textContent = name
        tooltip.classList.add('visible')
        const rect = scene.getBoundingClientRect()
        tooltip.style.left = e.clientX - rect.left + 'px'
        tooltip.style.top = e.clientY - rect.top - 24 + 'px'
      }
      currentToothEl = el
    } else {
      tooltip.classList.remove('visible')
      currentToothEl = null
    }
  })

  // Hide tooltip when cursor leaves the scene entirely
  scene.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible')
    currentToothEl = null
  })

  // --- Click sparkle burst ---
  teeth.forEach((tooth) => {
    tooth.addEventListener('click', (e) => {
      tooth.classList.add('clicked')
      setTimeout(() => tooth.classList.remove('clicked'), 400)
      createSparkleBurst(e, tooth)
    })
  })

  // Auto-hide drag hint after 5s
  if (dragHint) {
    setTimeout(() => {
      dragHint.style.opacity = '0'
      dragHint.style.transition = 'opacity 0.5s ease'
    }, 7000)
  }

  function createSparkleBurst(e, tooth) {
    const pt = svg.createSVGPoint()
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    pt.x = e.clientX
    pt.y = e.clientY
    const svgPt = pt.matrixTransform(ctm.inverse())
    const cx = svgPt.x
    const cy = svgPt.y

    const colors = [
      '#FFD700',
      '#FFA500',
      '#FF6347',
      '#FFFFFF',
      '#87CEEB',
      '#98FB98',
    ]
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8
      const dist = 15 + Math.random() * 15
      const dx = Math.cos(angle) * dist
      const dy = Math.sin(angle) * dist
      const size = 3 + Math.random() * 4

      const star = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle',
      )
      star.setAttribute('cx', cx)
      star.setAttribute('cy', cy)
      star.setAttribute('r', size)
      star.setAttribute(
        'fill',
        colors[Math.floor(Math.random() * colors.length)],
      )
      star.classList.add('click-star')
      star.style.setProperty('--dx', dx + 'px')
      star.style.setProperty('--dy', dy + 'px')
      clickSparklesG.appendChild(star)
      setTimeout(() => star.remove(), 650)
    }
  }

  // --- Draggable toothbrush ---
  let isDragging = false
  let grabOffsetX = 0
  let grabOffsetY = 0
  let hintHidden = false
  let resumeTimer = null
  let rafId = null
  let pendingX = 0
  let pendingY = 0

  brush.addEventListener('mousedown', startDrag)
  brush.addEventListener('touchstart', startDrag, { passive: false })

  function startDrag(e) {
    e.preventDefault()
    e.stopPropagation()

    // Clear any pending resume
    if (resumeTimer) {
      clearTimeout(resumeTimer)
      resumeTimer = null
    }

    isDragging = true

    // Freeze the animation: read the current computed position, then kill animation
    const brushComp = window.getComputedStyle(brush)
    const curLeft = brushComp.left
    const curTop = brushComp.top
    const curTransform = brushComp.transform

    // Kill animation and pin to current position
    brush.style.animation = 'none'
    brush.style.left = curLeft
    brush.style.top = curTop
    brush.style.transform = curTransform
    brush.classList.add('dragging')

    // Force reflow so animation: none takes effect
    void brush.offsetHeight

    const sceneRect = scene.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    // Calculate grab offset: where inside the brush the user clicked
    const brushLeft = parseFloat(curLeft) || 0
    const brushTop = parseFloat(curTop) || 0
    grabOffsetX = clientX - sceneRect.left - brushLeft
    grabOffsetY = clientY - sceneRect.top - brushTop

    if (!hintHidden && dragHint) {
      dragHint.style.opacity = '0'
      dragHint.style.transition = 'opacity 0.3s ease'
      hintHidden = true
    }

    document.addEventListener('mousemove', onDrag)
    document.addEventListener('touchmove', onDrag, { passive: false })
    document.addEventListener('mouseup', endDrag)
    document.addEventListener('touchend', endDrag)
  }

  function onDrag(e) {
    if (!isDragging) return
    e.preventDefault()

    const sceneRect = scene.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    let x = clientX - sceneRect.left - grabOffsetX
    let y = clientY - sceneRect.top - grabOffsetY

    // Clamp within the scene bounds
    const maxX = sceneRect.width - brush.offsetWidth
    const maxY = sceneRect.height - brush.offsetHeight
    x = Math.max(0, Math.min(x, maxX))
    y = Math.max(0, Math.min(y, maxY))

    pendingX = x
    pendingY = y

    if (!rafId) {
      rafId = requestAnimationFrame(applyDragPosition)
    }
  }

  function applyDragPosition() {
    rafId = null
    if (!isDragging) return

    brush.style.left = pendingX + 'px'
    brush.style.top = pendingY + 'px'
    // Subtle rotation based on horizontal position
    const sceneW = scene.getBoundingClientRect().width
    const rotAngle = (pendingX / sceneW) * 16 - 8
    brush.style.transform = 'rotate(' + rotAngle.toFixed(1) + 'deg)'

    // Check brushâ€“tooth collision
    checkBrushCollision()
  }

  function endDrag() {
    isDragging = false
    brush.classList.remove('dragging')
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('touchmove', onDrag)
    document.removeEventListener('mouseup', endDrag)
    document.removeEventListener('touchend', endDrag)

    // Resume the auto animation after 1.2s
    resumeTimer = setTimeout(() => {
      if (!isDragging) {
        brush.style.animation = ''
        brush.style.left = ''
        brush.style.top = ''
        brush.style.transform = ''
      }
    }, 1200)
  }

  function checkBrushCollision() {
    const bristleEl = brush.querySelector('.bristle-wrap')
    if (!bristleEl) return
    const bristleRect = bristleEl.getBoundingClientRect()

    teeth.forEach((tooth) => {
      const bbox = tooth.getBoundingClientRect()
      const overlap = !(
        bristleRect.right < bbox.left ||
        bristleRect.left > bbox.right ||
        bristleRect.bottom < bbox.top ||
        bristleRect.top > bbox.bottom
      )
      if (overlap && !tooth.classList.contains('brushed')) {
        tooth.classList.add('brushed')
        setTimeout(() => tooth.classList.remove('brushed'), 2000)
      }
    })
  }
})()

// --- Hero background video ---
;(function () {
  const video = document.getElementById('hero-video')
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  if (prefersReducedMotion) {
    video.pause()
  } else {
    video.addEventListener('loadedmetadata', () => {
      video.playbackRate = 0.75
    })
    video.play().catch(() => {})
  }
})()

// doctor credential modal
const doctorData = {
  yadav: {
    name: 'Dr. Sukhwant Singh Yadav',
    role: 'Endodontist, Dentist',
    clinic: 'downtown',
    initials: 'SY',
    bio: 'Dr. Sukhwant Singh Yadav completed his postgraduation in Conservative Dentistry and Endodontics from the All India Institute of Medical Sciences (AIIMS) in 2013. He also has three years of experience as a senior resident at Maulana Azad Institute of Dental Sciences (MAIDS). He regularly upgrades his skills through workshops and conferences, with expertise in veneers, smile designing, re-treatment of previously endodontically treated teeth, and periapical surgeries.',
    quals: [
      'MDS - Conservative Dentistry & Endodontics',
      'BDS',
      '17 years experience overall',
      '13 years as a specialist',
    ],
    certifications: [
      { image: '/assets/male-certificate.jpeg', alt: 'AIIMS Certificate' },
      { image: '/assets/male-certificate.jpeg', alt: 'Endodontics Masterclass' },
      { image: '/assets/male-certificate.jpeg', alt: 'Smile Designing Award' },
      { image: '/assets/male-certificate.jpeg', alt: 'Advanced Dentistry Seminar' }
    ],
    image: '/assets/doctor-male.jpeg',
  },
  chaurasiya: {
    name: 'Dr. Sushma Chaurasia',
    role: 'Dentist, Orthodontist',
    clinic: 'downtown',
    initials: 'SC',
    bio: 'Dr. Sushma Chaurasia is an orthodontist trained at AIIMS, New Delhi. She is well versed in all types of braces, including clear aligners and invisible braces, and brings a calm, patient-friendly approach to treatment.',
    quals: [
      'BDS',
      'MDS - Orthodontics',
      '18 years experience overall',
      '11 years as a specialist',
      'Expert in braces and aligners',
    ],
    certifications: [
      { image: '/assets/female-certificate.jpeg', alt: 'Orthodontics Excellence' },
      { image: '/assets/female-certificate.jpeg', alt: 'Clear Aligners Certification' },
      { image: '/assets/female-certificate.jpeg', alt: 'Braces Masterclass' },
      { image: '/assets/female-certificate.jpeg', alt: 'Dental Conference Award' }
    ],
    image: '/assets/doctor-female.jpg',
  },
}
const modal = document.getElementById('doctor-modal')
const modalAvatar = document.getElementById('modal-avatar')
const modalName = document.getElementById('modal-doc-name')
const modalRole = document.getElementById('modal-doc-role')
const modalTag = document.getElementById('modal-doc-tag')
const modalBio = document.getElementById('modal-bio')
const modalQualList = document.getElementById('modal-qual-list')
const modalCarouselContainer = document.getElementById('modal-carousel-container')
const modalSliderWrapper = document.getElementById('modal-slider-wrapper')
const modalPrevBtn = document.getElementById('modal-prev-btn')
const modalNextBtn = document.getElementById('modal-next-btn')

let lastFocused = null
let activeCarousel = null;

if (modalPrevBtn && modalNextBtn && modalSliderWrapper) {
  modalPrevBtn.addEventListener('click', () => {
    modalSliderWrapper.style.transform = 'translateX(0)';
    modalPrevBtn.style.display = 'none';
    modalNextBtn.style.display = 'flex';
  });

  modalNextBtn.addEventListener('click', () => {
    modalSliderWrapper.style.transform = 'translateX(-50%)';
    modalNextBtn.style.display = 'none';
    modalPrevBtn.style.display = 'flex';
  });
}

function openDoctorModal(id) {
  const d = doctorData[id]
  if (!d) return
  if (d.image) {
    modalAvatar.innerHTML = `<img src="${escapeHTML(d.image)}" alt="${escapeHTML(d.name)}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`
    modalAvatar.className = 'modal-avatar'
  } else {
    modalAvatar.textContent = d.initials
    modalAvatar.className = 'modal-avatar avatar-downtown'
  }
  modalName.textContent = d.name
  modalRole.textContent = d.role
  modalTag.className = 'doctor-clinic-tag tag-downtown'
  modalTag.innerHTML =
    '<span style="width:6px;height:6px;border-radius:50%;background:var(--rust-deep);display:inline-block;"></span>The Dental Home'
  modalBio.textContent = d.bio
  modalQualList.innerHTML = d.quals
    .map(
      (q) =>
        '<li><svg viewBox="0 0 24 24" fill="none" style="color:var(--rust)"><path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>' +
        escapeHTML(q) +
        '</span></li>',
    )
    .join('')

  if (modalSliderWrapper) {
    modalSliderWrapper.style.transform = 'translateX(0)';
  }
  if (modalPrevBtn) modalPrevBtn.style.display = 'none';

  if (activeCarousel) {
    activeCarousel.destroy();
    activeCarousel = null;
  }
  
  if (d.certifications && d.certifications.length > 0 && window.DepthCarousel) {
    modalCarouselContainer.style.display = 'block';
    if (modalNextBtn) modalNextBtn.style.display = 'flex';
    setTimeout(() => {
      activeCarousel = new window.DepthCarousel(modalCarouselContainer, {
        items: d.certifications,
        cardWidth: 200,
        cardHeight: 280,
        depth: 180,
        spread: 70,
        tilt: 20,
        autoplay: true,
        autoplayDelay: 2500
      });
    }, 50);
  } else {
    modalCarouselContainer.style.display = 'none';
    if (modalNextBtn) modalNextBtn.style.display = 'none';
  }

  lastFocused = document.activeElement
  modal.classList.add('open')
  document.getElementById('modal-close').focus()
  document.body.style.overflow = 'hidden'
}
function closeDoctorModal() {
  modal.classList.remove('open')
  document.body.style.overflow = ''
  if (activeCarousel) {
    activeCarousel.destroy();
    activeCarousel = null;
  }
  if (lastFocused) lastFocused.focus()
}
document.querySelectorAll('.doctor-card').forEach((card) => {
  card.addEventListener('click', () => openDoctorModal(card.dataset.doctor))
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openDoctorModal(card.dataset.doctor)
    }
  })
})
document
  .getElementById('modal-close')
  .addEventListener('click', closeDoctorModal)
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeDoctorModal()
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeDoctorModal()
})

// Service modal logic
const serviceModal = document.getElementById('service-modal')
const serviceModalClose = document.getElementById('service-modal-close')
const serviceModalImg = document.getElementById('modal-service-img')
const serviceModalName = document.getElementById('modal-service-name')
const serviceModalDesc = document.getElementById('modal-service-desc')

const serviceImages = {
  'General & Preventive Dentistry': '/assets/service-general.jpg',
  'Restorative Dentistry & Fillings': '/assets/service-restorative.jpg',
  'Root Canal Treatment': '/assets/Root.jpeg',
  'Cosmetic Dentistry & Smile Makeover': '/assets/Cosmetic Dentistry & Smile Makeover.jpeg',
  'Orthodontic Treatment': '/assets/Orthodontic Treatment.jpeg',
  'Dental Implant': '/assets/Dental Implant.jpeg',
  'Crown & Bridge': '/assets/Crown & Bridge.jpeg',
  'Oral Surgery': '/assets/service-surgery.jpg',
}


let lastServiceFocused = null

function openServiceModal(title, desc) {
  serviceModalName.textContent = title
  serviceModalDesc.textContent = desc
  serviceModalImg.src =
    serviceImages[title] ||
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'
  lastServiceFocused = document.activeElement
  serviceModal.classList.add('open')
  serviceModalClose.focus()
  document.body.style.overflow = 'hidden'
}

function closeServiceModal() {
  serviceModal.classList.remove('open')
  document.body.style.overflow = ''
  if (lastServiceFocused) lastServiceFocused.focus()
}

document.querySelectorAll('.svc-card:not(.cta)').forEach((card) => {
  card.setAttribute('role', 'button')
  card.setAttribute('tabindex', '0')
  card.style.cursor = 'pointer'

  card.addEventListener('click', () => {
    const title = card.querySelector('h3').textContent.trim()
    const desc = card.getAttribute('data-long-desc') || card.querySelector('.desc').textContent.trim()
    openServiceModal(title, desc)
  })

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const title = card.querySelector('h3').textContent.trim()
      const desc = card.getAttribute('data-long-desc') || card.querySelector('.desc').textContent.trim()
      openServiceModal(title, desc)
    }
  })
})

if (serviceModalClose)
  serviceModalClose.addEventListener('click', closeServiceModal)
if (serviceModal)
  serviceModal.addEventListener('click', (e) => {
    if (e.target === serviceModal) closeServiceModal()
  })
document.addEventListener('keydown', (e) => {
  if (
    e.key === 'Escape' &&
    serviceModal &&
    serviceModal.classList.contains('open')
  )
    closeServiceModal()
})

// sticky header shadow (optimized)
const header = document.getElementById('site-header')
let ticking = false
window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 8)
        ticking = false
      })
      ticking = true
    }
  },
  { passive: true },
)

// testimonial carousel
async function loadReviews() {
  const container = document.getElementById('reviews-container')
  if (!container) return

  try {
    const res = await fetch('reviews.json')
    if (!res.ok) throw new Error('Failed to load reviews')
    const reviews = await res.json()

    let html = ''
    let controlsHtml = '<div class="t-controls">'

    const MAX_LENGTH = 180
    reviews.forEach((r, i) => {
      const safeText = escapeHTML(r.text)
      const safeAuthor = escapeHTML(r.author)
      const safeDate = escapeHTML(r.date)
      let quoteHtml = `"${safeText}"`
      if (r.text.length > MAX_LENGTH) {
        const shortText = escapeHTML(r.text.substring(0, MAX_LENGTH).trim() + '...')
        quoteHtml = `
          <span class="short-text">"${shortText}"</span>
          <span class="full-text" style="display:none;">"${safeText}"</span>
          <button class="read-more-btn" style="background:none; border:none; color:var(--rust); font-family:var(--font-mono); font-size:13px; font-weight:600; cursor:pointer; padding:0; margin-left:8px; text-decoration:underline;">Read more</button>
        `
      }

      html += `
        <div class="t-slide ${i === 0 ? 'active' : ''}">
          <p class="t-quote">${quoteHtml}</p>
          <p class="t-name">${safeAuthor} â€” ${safeDate}</p>
        </div>
      `
      controlsHtml += `<button class="t-dot ${i === 0 ? 'active' : ''}" data-i="${i}" aria-label="Story ${i + 1}"></button>`
    })

    controlsHtml += '</div>'
    container.innerHTML = html + controlsHtml

    container.querySelectorAll('.read-more-btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation() // prevent other click events if any
        const p = this.parentElement
        const shortText = p.querySelector('.short-text')
        const fullText = p.querySelector('.full-text')

        if (fullText.style.display === 'none') {
          fullText.style.display = 'inline'
          shortText.style.display = 'none'
          this.textContent = 'Read less'
          // Optionally stop the carousel from sliding while reading
          clearInterval(timer)
        } else {
          fullText.style.display = 'none'
          shortText.style.display = 'inline'
          this.textContent = 'Read more'
          restart() // resume carousel
        }
      })
    })

    // Re-initialize carousel logic
    const slides = container.querySelectorAll('.t-slide')
    const dots = container.querySelectorAll('.t-dot')
    let current = 0,
      timer

    function showSlide(i) {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i))
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i))
      current = i
    }

    dots.forEach((dot) =>
      dot.addEventListener('click', () => {
        showSlide(+dot.dataset.i)
        restart()
      }),
    )

    function restart() {
      clearInterval(timer)
      timer = setInterval(() => showSlide((current + 1) % slides.length), 6000)
    }

    restart()
    container.addEventListener('mouseenter', () => clearInterval(timer))
    container.addEventListener('mouseleave', restart)
  } catch (err) {
    console.error(err)
    container.innerHTML =
      '<p style="text-align:center;color:var(--ink-mute);">Could not load reviews at this time.</p>'
  }
}
loadReviews()

// faq accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const btn = item.querySelector('.faq-q')
  const answer = item.querySelector('.faq-a')

  // Initialize any already-open FAQ items with proper max-height
  if (item.classList.contains('open')) {
    answer.style.maxHeight = answer.scrollHeight + 'px'
  }

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item').forEach((i) => {
      i.classList.remove('open')
      i.querySelector('.faq-a').style.maxHeight = 0
    })
    if (!isOpen) {
      item.classList.add('open')
      answer.style.maxHeight = answer.scrollHeight + 'px'
    }
  })
})

// scroll reveal
const revealEls = document.querySelectorAll('.reveal')
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        io.unobserve(e.target)
      }
    })
  },
  { threshold: 0.15 },
)
revealEls.forEach((el) => io.observe(el))

// Initialize Google Map
const GOOGLE_MAPS_API_KEY = (() => {
  const metaKey = document
    .querySelector('meta[name="google-maps-api-key"]')
    ?.getAttribute('content')
    ?.trim()
  return (window.GOOGLE_MAPS_API_KEY || metaKey || '').trim()
})()
const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-js-api'
const GOOGLE_MAPS_PLACEHOLDER_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'
window.clinicMap = null
window.clinicMarker = null
window.routePolyline = null
window.userMarker = null

window.initClinicMap = function initClinicMap() {
  const mapEl = document.getElementById('leaflet-map')
  if (!mapEl || !window.google || !window.google.maps) return

  const delhiCenter = { lat: 28.5396, lng: 77.2477 }
  window.clinicMap = new google.maps.Map(mapEl, {
    center: delhiCenter,
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    gestureHandling: 'greedy',
  })

  if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
    window.clinicMarker = new google.maps.marker.AdvancedMarkerElement({
      position: delhiCenter,
      map: window.clinicMap,
      title: 'The Dental Home - Delhi',
    })
  } else {
    window.clinicMarker = new google.maps.Marker({
      position: delhiCenter,
      map: window.clinicMap,
      title: 'The Dental Home - Delhi',
    })
  }
}

function loadGoogleMapsScript() {
  if (
    !GOOGLE_MAPS_API_KEY ||
    GOOGLE_MAPS_API_KEY === GOOGLE_MAPS_PLACEHOLDER_KEY
  ) {
    const mapEl = document.getElementById('leaflet-map')
    if (mapEl) {
      mapEl.innerHTML = `
        <iframe
          title="The Dental Home location on Google Maps"
          src="https://www.google.com/maps?q=28.5396,77.2477&z=15&output=embed"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          style="border:0; width:100%; height:100%;"
        ></iframe>
`
      window.clinicMap = null
      window.clinicMarker = null
    }
    return
  }

  if (window.google && window.google.maps) {
    window.initClinicMap()
    return
  }
  if (document.getElementById(GOOGLE_MAPS_SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = GOOGLE_MAPS_SCRIPT_ID
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
    GOOGLE_MAPS_API_KEY,
  )}&libraries=marker&loading=async&callback=initClinicMap&v=weekly`
  script.async = true
  script.defer = true
  script.onerror = () => {
    const mapEl = document.getElementById('leaflet-map')
    if (mapEl) {
      mapEl.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:24px;text-align:center;color:var(--ink-soft);font-family:var(--font-mono);background:var(--ivory-deep);">Google Maps could not load. Check the API key and billing settings, then reload the page.</div>'
    }
  }
  document.head.appendChild(script)
}

loadGoogleMapsScript()

// --- Accurate Distance Calculator with Route Switching ---
;(function () {
  let CLINIC_LAT = 28.5396
  let CLINIC_LNG = 77.2477
  const OSRM_BASE = 'https://router.project-osrm.org/route/v1'
  const btn = document.getElementById('calc-dist-btn')
  const results = document.getElementById('dist-results')
  const errorEl = document.getElementById('dist-error')
  const recalcBtn = document.getElementById('dist-recalc-btn')
  const closeBtn = document.getElementById('dist-close-btn')

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      results.style.display = 'none'
      closeBtn.style.display = 'none'
      btn.style.display = ''
      if (routeLayer) {
        map.removeLayer(routeLayer)
        routeLayer = null
      }
    })
  }

  // Route colors per mode
  const MODE_COLORS = {
    driving: { color: '#C96A4A', weight: 5, opacity: 0.85, dashArray: null },
    bus: { color: '#E67E22', weight: 5, opacity: 0.8, dashArray: null },
    metro: { color: '#8E44AD', weight: 5, opacity: 0.8, dashArray: '12, 8' },
  }

  // Store computed route data for each mode
  let routeData = {}
  let savedUserLat = null,
    savedUserLon = null

  // Location Tabs Logic
  const tabs = document.querySelectorAll('.clinic-tab')
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const btn = e.target.closest('.clinic-tab') || tab
      tabs.forEach((t) => {
        t.classList.remove('btn-primary', 'active')
        t.classList.add('btn-ghost')
      })
      btn.classList.remove('btn-ghost')
      btn.classList.add('btn-primary', 'active')

      const targetId = btn.getAttribute('data-target')
      if (!targetId) return

      document.querySelectorAll('.loc-info').forEach((info) => {
        info.style.display = 'none'
      })
      const activeInfo = document.getElementById('info-' + targetId)
      if (activeInfo) activeInfo.style.display = '' // revert to flex

      CLINIC_LAT = (activeInfo && parseFloat(activeInfo.getAttribute('data-lat'))) || (targetId === 'faridabad' ? 28.40478 : 28.5396)
      CLINIC_LNG = (activeInfo && parseFloat(activeInfo.getAttribute('data-lng'))) || (targetId === 'faridabad' ? 77.35598 : 77.2477)
      const name = (activeInfo && activeInfo.getAttribute('data-name')) || (targetId === 'faridabad' ? 'The Dental Home - Faridabad' : 'The Dental Home Chittaranjan Park Delhi')

      if (window.clinicMap && window.clinicMarker) {
        window.clinicMap.setCenter({ lat: CLINIC_LAT, lng: CLINIC_LNG })
        window.clinicMap.setZoom(14)
        if (typeof window.clinicMarker.setPosition === 'function') {
          window.clinicMarker.setPosition({ lat: CLINIC_LAT, lng: CLINIC_LNG })
          window.clinicMarker.setTitle(name)
        } else if (window.clinicMarker.position) {
          window.clinicMarker.position = { lat: CLINIC_LAT, lng: CLINIC_LNG }
          window.clinicMarker.title = name
        }
      } else {
        const mapEl = document.getElementById('leaflet-map')
        if (mapEl) {
          const iframe = mapEl.querySelector('iframe')
          if (iframe) {
            iframe.src = `https://www.google.com/maps?q=${CLINIC_LAT},${CLINIC_LNG}&z=15&output=embed`
          } else {
            mapEl.innerHTML = `<iframe title="The Dental Home location on Google Maps" src="https://www.google.com/maps?q=${CLINIC_LAT},${CLINIC_LNG}&z=15&output=embed" style="border:0; width:100%; height:100%;"></iframe>`
          }
        }
      }

      // Clear old routes from map when switching clinics
      if (window.routePolyline) {
        window.routePolyline.setMap(null)
        window.routePolyline = null
      }
      if (window.userMarker) {
        if (typeof window.userMarker.setMap === 'function') {
          window.userMarker.setMap(null)
        }
        window.userMarker = null
      }

      updateHeaderClinic(name)
    })
  })


  function updateHeaderClinic(name) {
    if (!name) return
    const nameEl = document.getElementById('header-loc-name')
    const dotEl = document.getElementById('header-dot')
    const isFbd = typeof name === 'string' && name.includes('Faridabad')
    if (nameEl) {
      nameEl.textContent = isFbd ? 'Faridabad Clinic' : 'CR Park Clinic'
    }

    // Check if open based on clinic timings in IST
    const now = new Date()
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    const ist = new Date(utc + 3600000 * 5.5) // IST is UTC+5:30
    const hours = ist.getHours()
    const day = ist.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    let isOpen = false
    if (isFbd) {
      // Faridabad: 5pm to 9pm (17 to 21), Tuesday off (day !== 2)
      if (day !== 2 && hours >= 17 && hours < 21) {
        isOpen = true
      }
    } else {
      // CR Park: 11am to 7pm (11 to 19), Wednesday off (day !== 3)
      if (day !== 3 && hours >= 11 && hours < 19) {
        isOpen = true
      }
    }

    if (dotEl) {
      if (isOpen) {
        dotEl.style.backgroundColor = '#27AE60' // Green
        dotEl.title = 'Clinic is currently open'
      } else {
        dotEl.style.backgroundColor = '#E74C3C' // Red
        dotEl.title = 'Clinic is currently closed'
      }
    }
  }

  // Initialize with default active tab
  const activeTab = document.querySelector('.clinic-tab.active')
  if (activeTab) {
    const targetId = activeTab.getAttribute('data-target')
    const activeInfo = document.getElementById('info-' + targetId)
    if (activeInfo) updateHeaderClinic(activeInfo.getAttribute('data-name'))
  }

  // Auto select nearest clinic based on IP
  async function autoSelectNearestClinic() {
    try {
      const res = await fetch('https://get.geojs.io/v1/ip/geo.json')
      if (!res.ok) return
      const data = await res.json()
      if (data && data.latitude && data.longitude) {
        const userLat = parseFloat(data.latitude)
        const userLon = parseFloat(data.longitude)

        const delhiDist = haversine(userLat, userLon, 28.5396, 77.2477)
        const fbdDist = haversine(userLat, userLon, 28.40478, 77.35598)

        if (fbdDist < delhiDist) {
          const fbdTab = document.querySelector('[data-target="faridabad"]')
          if (fbdTab && !fbdTab.classList.contains('active')) fbdTab.click()
        } else {
          const delhiTab = document.querySelector('[data-target="delhi"]')
          if (delhiTab && !delhiTab.classList.contains('active'))
            delhiTab.click()
        }
      }
    } catch (e) {}
  }
  // Removed auto IP geolocation call â€” only triggered by user interaction now
  // Users can click the header location pill or distance button to trigger location
  if (recalcBtn)
    recalcBtn.addEventListener('click', () => {
      recalcBtn.style.display = 'none'
      calculate()
    })

  async function calculate() {
    btn.textContent = 'Locatingâ€¦'
    btn.disabled = true
    errorEl.style.display = 'none'
    routeData = {}

    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser.')
      return
    }

    try {
      const pos = await getPosition()
      savedUserLat = pos.coords.latitude
      savedUserLon = pos.coords.longitude

      btn.textContent = 'Calculating routesâ€¦'

      // Show results area
      btn.style.display = 'none'
      results.style.display = 'block'

      // Straight-line distance (Vincenty formula)
      const straightDist = vincentyDistance(
        savedUserLat,
        savedUserLon,
        CLINIC_LAT,
        CLINIC_LNG,
      )

      // Fetch driving route from OSRM
      const drivingResult = await fetchOSRM(
        'driving',
        savedUserLon,
        savedUserLat,
      )

      // === DRIVING ===
      let drivingDist, drivingTime
      if (drivingResult) {
        drivingDist = drivingResult.distance / 1000
        drivingTime = drivingResult.duration / 60
        routeData.driving = {
          geometry: drivingResult.geometry,
          dist: drivingDist,
          time: drivingTime,
        }
      } else {
        drivingDist = straightDist * 1.35
        drivingTime =
          straightDist < 30 ? (drivingDist / 25) * 60 : (drivingDist / 55) * 60
        // Fallback: straight-line route
        routeData.driving = {
          straight: true,
          dist: drivingDist,
          time: drivingTime,
        }
      }


      // Draw driving route on map
      drawRoute('driving')

      // Render distance results into the UI
      renderDistanceResults()

      if (recalcBtn) recalcBtn.style.display = ''
    } catch (err) {
      showError(err.message || 'Could not get your location.')
    }
  }

  // --- Draw a specific mode's route on map ---
  function drawRoute(mode) {
    if (!savedUserLat) return

    if (!window.clinicMap) {
      // Update fallback iframe to show the calculated route
      const mapEl = document.getElementById('leaflet-map')
      if (mapEl) {
        const iframe = mapEl.querySelector('iframe')
        if (iframe) {
          let dirflg = 'd'
          if (mode === 'bus' || mode === 'metro') dirflg = 'r'
          iframe.src = `https://www.google.com/maps?saddr=${savedUserLat},${savedUserLon}&daddr=${CLINIC_LAT},${CLINIC_LNG}&dirflg=${dirflg}&output=embed`
        }
      }
      return
    }

    const data = routeData[mode]
    if (!data) return

    // Clear previous route layers
    if (window.routePolyline) {
      window.routePolyline.setMap(null)
      window.routePolyline = null
    }
    if (window.userMarker) {
      if (typeof window.userMarker.setMap === 'function') {
        window.userMarker.setMap(null)
      } else if (window.userMarker.map) {
        window.userMarker.map = null
      }
      window.userMarker = null
    }

    const style = MODE_COLORS[mode] || MODE_COLORS.driving
    const routePath =
      data.geometry && !data.straight
        ? data.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
        : [
            { lat: savedUserLat, lng: savedUserLon },
            { lat: CLINIC_LAT, lng: CLINIC_LNG },
          ]

    window.routePolyline = new google.maps.Polyline({
      path: routePath,
      map: window.clinicMap,
      strokeColor: style.color,
      strokeOpacity: style.opacity,
      strokeWeight: style.weight,
      geodesic: true,
    })

    // User marker
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      window.userMarker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: savedUserLat, lng: savedUserLon },
        map: window.clinicMap,
        title: 'Your Location',
      })
    } else {
      window.userMarker = new google.maps.Marker({
        position: { lat: savedUserLat, lng: savedUserLon },
        map: window.clinicMap,
        title: 'Your Location',
      })
    }

    const bounds = new google.maps.LatLngBounds()
    routePath.forEach((point) => bounds.extend(point))
    window.clinicMap.fitBounds(bounds, 40)
  }

  // --- Geolocation with timeout and IP fallback ---
  function getPosition() {
    return new Promise((resolve, reject) => {
      const fallbackOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }

      const tryIpGeolocation = async (fallbackMsg) => {
        try {
          const res = await fetch('https://get.geojs.io/v1/ip/geo.json')
          if (!res.ok) throw new Error('IP Geo failed')
          const data = await res.json()
          if (data && data.latitude && data.longitude) {
            resolve({
              coords: {
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
              },
            })
          } else {
            reject(
              new Error(fallbackMsg || 'Could not determine your location.'),
            )
          }
        } catch (e) {
          reject(new Error(fallbackMsg || 'Could not determine your location.'))
        }
      }

      if (!navigator.geolocation) {
        return tryIpGeolocation('Geolocation is not supported by your browser.')
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        (err) => {
          if (err.code === 1) {
            // Access denied - use IP location as fallback
            tryIpGeolocation(
              'Location access denied. Please allow location permission.',
            )
          } else if (err.code === 2 || err.code === 3) {
            // Fallback to low accuracy on timeout or unavailable
            navigator.geolocation.getCurrentPosition(
              resolve,
              (err2) => {
                // If low accuracy fails, try IP geolocation
                let msg = 'Could not determine your location.'
                if (err2.code === 1)
                  msg =
                    'Location access denied. Please allow location permission.'
                else if (err2.code === 2)
                  msg =
                    'Location unavailable. Please check your device settings.'
                else if (err2.code === 3)
                  msg = 'Location request timed out. Please try again.'

                tryIpGeolocation(msg)
              },
              fallbackOptions,
            )
          } else {
            tryIpGeolocation('Could not determine your location.')
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 60000,
        },
      )
    })
  }

  // --- OSRM route fetch ---
  async function fetchOSRM(profile, userLon, userLat) {
    const url = `${OSRM_BASE}/${profile}/${userLon},${userLat};${CLINIC_LNG},${CLINIC_LAT}?overview=full&geometries=geojson`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    try {
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (data.routes && data.routes.length > 0) return data.routes[0]
      return null
    } catch (e) {
      clearTimeout(timeoutId)
      return null
    }
  }

  // --- Vincenty geodesic distance ---
  function vincentyDistance(lat1, lon1, lat2, lon2) {
    const a = 6378137,
      f = 1 / 298.257223563,
      b = a * (1 - f)
    const toRad = (v) => (v * Math.PI) / 180
    const U1 = Math.atan((1 - f) * Math.tan(toRad(lat1)))
    const U2 = Math.atan((1 - f) * Math.tan(toRad(lat2)))
    const sinU1 = Math.sin(U1),
      cosU1 = Math.cos(U1)
    const sinU2 = Math.sin(U2),
      cosU2 = Math.cos(U2)
    let lambda = toRad(lon2 - lon1),
      prev,
      iter = 100
    let sinSig, cosSig, sig, sinA, cosSqA, cos2M
    do {
      const sL = Math.sin(lambda),
        cL = Math.cos(lambda)
      sinSig = Math.sqrt(
        (cosU2 * sL) ** 2 + (cosU1 * sinU2 - sinU1 * cosU2 * cL) ** 2,
      )
      if (!sinSig) return 0
      cosSig = sinU1 * sinU2 + cosU1 * cosU2 * cL
      sig = Math.atan2(sinSig, cosSig)
      sinA = (cosU1 * cosU2 * sL) / sinSig
      cosSqA = 1 - sinA ** 2
      cos2M = cosSig - (2 * sinU1 * sinU2) / (cosSqA || 1)
      const C = (f / 16) * cosSqA * (4 + f * (4 - 3 * cosSqA))
      prev = lambda
      lambda =
        toRad(lon2 - lon1) +
        (1 - C) *
          f *
          sinA *
          (sig + C * sinSig * (cos2M + C * cosSig * (-1 + 2 * cos2M ** 2)))
    } while (Math.abs(lambda - prev) > 1e-12 && --iter > 0)
    if (!iter) return haversine(lat1, lon1, lat2, lon2)
    const uSq = (cosSqA * (a ** 2 - b ** 2)) / b ** 2
    const A2 =
      1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
    const B2 = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))
    const dS =
      B2 *
      sinSig *
      (cos2M +
        (B2 / 4) *
          (cosSig * (-1 + 2 * cos2M ** 2) -
            (B2 / 6) * cos2M * (-3 + 4 * sinSig ** 2) * (-3 + 4 * cos2M ** 2)))
    return (b * A2 * (sig - dS)) / 1000
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371,
      toRad = (v) => (v * Math.PI) / 180
    const dLat = toRad(lat2 - lat1),
      dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  // --- Format distance + duration ---
  function formatResult(distKm, mins) {
    const d =
      distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`
    const t =
      mins >= 60
        ? `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`
        : `${Math.round(mins)} min`
    return `${d} Â· ${t}`
  }

  // --- Render distance results into the UI ---
  function renderDistanceResults() {
    const driving = routeData.driving
    let html = ''

    if (driving) {
      html += `<div class="dist-clickable dist-row active" data-mode="driving">
        <span>ðŸš— Driving</span>
        <div class="dist-detail">
          <strong>${formatResult(driving.dist, driving.time)}</strong>
          ${driving.straight ? '<span class="dist-speed">~estimate</span>' : ''}
        </div>
      </div>`
    }

    results.innerHTML = html
    if (closeBtn) closeBtn.style.display = 'block'

    if (recalcBtn) {
      recalcBtn.style.display = ''
      results.appendChild(recalcBtn)
    }

    // Click handlers for route mode switching
    results.querySelectorAll('.dist-clickable').forEach((row) => {
      row.addEventListener('click', () => {
        results.querySelectorAll('.dist-clickable').forEach(r => r.classList.remove('active'))
        row.classList.add('active')
        drawRoute(row.dataset.mode)
      })
    })
  }

  // --- Show error ---
  function showError(msg) {
    btn.textContent = 'Get exact distance'
    btn.disabled = false
    btn.style.display = ''
    if (closeBtn) closeBtn.style.display = 'none'
    results.style.display = 'block'
    errorEl.textContent = msg
    errorEl.style.display = 'block'
    if (recalcBtn) recalcBtn.style.display = 'none'
  }
})()

// --- Mobile Navigation Menu ---
;(function () {
  const burger = document.querySelector('.burger')
  const mobileNav = document.getElementById('mobile-nav')
  const mobileNavClose = document.getElementById('mobile-nav-close')
  if (!burger || !mobileNav) return

  function openMobileNav() {
    mobileNav.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open')
    document.body.style.overflow = ''
  }

  burger.addEventListener('click', openMobileNav)
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav)

  // Close on overlay click
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMobileNav()
  })

  // Close on link click
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav)
  })

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMobileNav()
  })
})()

// Form Submission -> WhatsApp Redirect
const appForm = document.getElementById('appointment-form')
if (appForm) {
  appForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const submitBtn = e.target.querySelector('button[type="submit"]')
    const status = document.getElementById('form-status')
    const honeypot = e.target.querySelector('input[name="_honey"]').value

    if (honeypot) return // simple spam check

    // Get form values
    const formName = document.getElementById('name').value.trim()
    const formPhone = document.getElementById('phone').value.trim()
    const formEmail = document.getElementById('email').value.trim()
    const formDate = document.getElementById('date').value

    // Validate phone number
    const phoneRegex = /^\+?[0-9]{7,15}$/
    if (!phoneRegex.test(formPhone)) {
      status.style.display = 'block'
      status.style.color = 'var(--coral-deep)'
      status.textContent = 'Please enter a valid phone number (7-15 digits).'
      setTimeout(() => { status.style.display = 'none' }, 3000)
      return
    }

    // Validate booking date is not on a closed day
    const clinicSelect = document.getElementById('clinic')
    const dateInput = document.getElementById('date')
    if (formDate && clinicSelect.value) {
      const [yr, mo, dy] = formDate.split('-').map(Number)
      const selectedDay = new Date(yr, mo - 1, dy).getDay()
      if (clinicSelect.value === 'delhi' && selectedDay === 3) {
        dateInput.setCustomValidity('The Delhi clinic is closed on Wednesdays.')
        dateInput.reportValidity()
        return
      } else if (clinicSelect.value === 'faridabad' && selectedDay === 2) {
        dateInput.setCustomValidity('The Faridabad clinic is closed on Tuesdays.')
        dateInput.reportValidity()
        return
      } else {
        dateInput.setCustomValidity('')
      }
    }

    const serviceSelect = document.getElementById('service')
    const service = serviceSelect.options[serviceSelect.selectedIndex].text
    const clinic = clinicSelect.options[clinicSelect.selectedIndex].text
    const formNotes = document.getElementById('notes').value.trim()

    // Construct WhatsApp message
    let msg = `Hello! I would like to book an appointment at The Dental Home.\n\n`
    msg += `Here are my details:\n`
    msg += `Name: ${formName}\n`
    msg += `Phone: ${formPhone}\n`
    if (formEmail) msg += `Email: ${formEmail}\n`
    msg += `Clinic: ${clinic}\n`
    msg += `Preferred Date: ${formDate}\n`
    msg += `Service Needed: ${service}\n`
    if (formNotes) msg += `Notes: ${formNotes}\n\n`
    msg += `Looking forward to your confirmation. Thank you!`

    const whatsappUrl = `https://wa.me/918264001306?text=${encodeURIComponent(msg)}`

    submitBtn.innerHTML = `<span style="opacity:0.8;">Redirecting to WhatsApp...</span>`
    submitBtn.style.pointerEvents = 'none'

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener')

    // Update UI
    setTimeout(() => {
      e.target.reset()
      submitBtn.innerHTML = `Request Sent via WhatsApp`
      submitBtn.style.background = 'var(--slate-deep)'
      status.style.display = 'block'
      status.style.color = 'var(--slate-deep)'
      status.textContent =
        'If WhatsApp did not open automatically, please click the "WhatsApp Us" button above.'

      // Restore the button and form to its original state after 4 seconds
      setTimeout(() => {
        submitBtn.innerHTML = `Submit`
        submitBtn.style.background = ''
        submitBtn.style.pointerEvents = ''
        status.style.display = 'none'
      }, 4000)
    }, 1500)
  })
}

// Scroll to Top Button Logic
const scrollToTopBtn = document.getElementById('scroll-to-top')
if (scrollToTopBtn) {
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show')
      } else {
        scrollToTopBtn.classList.remove('show')
      }
    },
    { passive: true },
  )

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}

// Form Validation: Prevent booking on closed days
;(function setupBookingValidation() {
  const clinicSelect = document.getElementById('clinic')
  const appForm = document.getElementById('appointment-form')
  const dateInput = document.getElementById('date')
  const dateError = document.getElementById('date-error')

  if (!clinicSelect || !dateInput) return

  // Prevent selecting past dates
  const today = new Date()
  const offset = today.getTimezoneOffset()
  const localToday = new Date(today.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0]
  dateInput.setAttribute('min', localToday)

  function validateBookingDate() {
    if (!dateInput.value || !clinicSelect.value) {
      if (dateError) dateError.style.display = 'none'
      dateInput.setCustomValidity('')
      return
    }

    // Parse as local date to avoid UTC timezone shifts changing weekday checks.
    const [year, month, dayOfMonth] = dateInput.value.split('-').map(Number)
    const selectedDate = new Date(year, month - 1, dayOfMonth)
    const day = selectedDate.getDay() // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed...

    let isClosed = false
    let closedDayName = ''

    if (clinicSelect.value === 'delhi' && day === 3) {
      isClosed = true
      closedDayName = 'Wednesday'
    } else if (clinicSelect.value === 'faridabad' && day === 2) {
      isClosed = true
      closedDayName = 'Tuesday'
    }

    if (isClosed) {
      if (dateError) {
        dateError.textContent = `This clinic is closed on ${closedDayName}s. Please select another date.`
        dateError.style.display = 'block'
      }
      dateInput.setCustomValidity(`Clinic is closed on ${closedDayName}s.`)
    } else {
      if (dateError) dateError.style.display = 'none'
      dateInput.setCustomValidity('')
    }
  }

  clinicSelect.addEventListener('change', validateBookingDate)
  dateInput.addEventListener('input', validateBookingDate)
  dateInput.addEventListener('change', validateBookingDate)

  if (appForm) {
    appForm.addEventListener('submit', () => {
      validateBookingDate()
      dateInput.reportValidity()
    })
  }
})()

}

