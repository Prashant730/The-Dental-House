class DepthCarousel {
  constructor(container, options = {}) {
    this.container = container;
    this.items = (options.items || [
      { image: 'https://picsum.photos/seed/depth1/800/1000', alt: 'Slide 1' },
      { image: 'https://picsum.photos/seed/depth2/800/1000', alt: 'Slide 2' },
      { image: 'https://picsum.photos/seed/depth3/800/1000', alt: 'Slide 3' },
      { image: 'https://picsum.photos/seed/depth4/800/1000', alt: 'Slide 4' },
      { image: 'https://picsum.photos/seed/depth5/800/1000', alt: 'Slide 5' },
      { image: 'https://picsum.photos/seed/depth6/800/1000', alt: 'Slide 6' }
    ]).map(it => typeof it === 'string' ? { image: it, alt: '' } : it);
    this.cardWidth = options.cardWidth || 300;
    this.cardHeight = options.cardHeight || 380;
    this.radius = options.radius || 18;
    this.tint = options.tint || '#05060a';
    this.depth = options.depth !== undefined ? options.depth : 220;
    this.spread = options.spread !== undefined ? options.spread : 90;
    this.tilt = options.tilt !== undefined ? options.tilt : 22;
    this.tiltDirection = options.tiltDirection || 'right';
    this.perspective = options.perspective || 1400;
    this.visibleCards = options.visibleCards || 4;
    this.falloff = options.falloff !== undefined ? options.falloff : 0.2;
    this.blur = options.blur !== undefined ? options.blur : 6;
    this.duration = options.duration || 700;
    this.ease = options.ease || 'power3.out';
    this.autoplay = options.autoplay || false;
    this.autoplayDelay = options.autoplayDelay || 3200;
    this.loop = options.loop !== undefined ? options.loop : true;
    this.showControls = options.showControls !== undefined ? options.showControls : true;
    this.showIndicators = options.showIndicators !== undefined ? options.showIndicators : true;
    this.onChange = options.onChange;

    this.count = this.items.length;
    this.pos = 0;
    this.focus = 0;
    this.active = 0;
    this.scale = 1;

    this.cardRefs = [];
    this.overlayRefs = [];
    
    this.tween = null;
    this.wheelTimer = null;
    this.autoTimer = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.drag = null;
    this.hovered = false;
    this.focused = false;

    this.initDOM();
    this.bindEvents();
    this.layout(this.pos);
    if (this.autoplay && !this.reducedMotion && this.count > 1) {
      this.startAutoPlay();
    }
    
    // Resize observer
    this.ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      const needed = this.cardWidth + Math.abs(this.spread) * 2 + 120;
      this.scale = this.clamp(w / needed, 0.4, 1);
      this.layout(this.pos);
    });
    this.ro.observe(this.root);
  }

  clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  initDOM() {
    this.container.innerHTML = '';
    
    this.root = document.createElement('div');
    this.root.className = 'depth-carousel';
    this.root.style.setProperty('--dc-perspective', `${this.perspective}px`);
    this.root.setAttribute('role', 'group');
    this.root.setAttribute('aria-roledescription', 'carousel');
    this.root.setAttribute('aria-label', 'Depth carousel');
    this.root.tabIndex = 0;

    this.stage = document.createElement('div');
    this.stage.className = 'depth-carousel__stage';
    this.root.appendChild(this.stage);

    this.items.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'depth-carousel__card';
      card.style.width = `${this.cardWidth}px`;
      card.style.height = `${this.cardHeight}px`;
      card.style.borderRadius = `${this.radius}px`;
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', `${i + 1} of ${this.count}`);
      card.setAttribute('aria-hidden', i !== this.active);
      card.addEventListener('click', () => this.onCardClick(i));
      
      const img = document.createElement('img');
      img.className = 'depth-carousel__img';
      img.src = item.image;
      img.alt = item.alt || '';
      img.draggable = false;
      
      const tint = document.createElement('span');
      tint.className = 'depth-carousel__tint';
      tint.style.background = this.tint;
      
      card.appendChild(img);
      card.appendChild(tint);
      this.stage.appendChild(card);
      
      this.cardRefs.push(card);
      this.overlayRefs.push(tint);
    });

    if (this.showControls && this.count > 1) {
      this.prevBtn = document.createElement('button');
      this.prevBtn.type = 'button';
      this.prevBtn.className = 'depth-carousel__arrow depth-carousel__arrow--prev';
      this.prevBtn.setAttribute('aria-label', 'Previous slide');
      this.prevBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      this.prevBtn.addEventListener('click', () => this.navigateBy(-1));
      
      this.nextBtn = document.createElement('button');
      this.nextBtn.type = 'button';
      this.nextBtn.className = 'depth-carousel__arrow depth-carousel__arrow--next';
      this.nextBtn.setAttribute('aria-label', 'Next slide');
      this.nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      this.nextBtn.addEventListener('click', () => this.navigateBy(1));
      
      this.root.appendChild(this.prevBtn);
      this.root.appendChild(this.nextBtn);
    }

    if (this.showIndicators && this.count > 1) {
      this.dotsContainer = document.createElement('div');
      this.dotsContainer.className = 'depth-carousel__dots';
      this.dotsContainer.setAttribute('role', 'tablist');
      this.dotsContainer.setAttribute('aria-label', 'Slides');
      
      this.dots = [];
      this.items.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === this.active);
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.className = `depth-carousel__dot${i === this.active ? ' is-active' : ''}`;
        dot.addEventListener('click', () => this.setFocus(i, true));
        this.dotsContainer.appendChild(dot);
        this.dots.push(dot);
      });
      
      this.root.appendChild(this.dotsContainer);
    }

    this.container.appendChild(this.root);
  }

  layout(pos) {
    if (!this.count) return;
    const dir = this.tiltDirection === 'left' ? -1 : 1;
    const sc = this.scale;
    const n = this.count;

    for (let i = 0; i < n; i++) {
      const el = this.cardRefs[i];
      if (!el) continue;

      let d = i - pos;
      if (this.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }

      const back = Math.max(0, d);
      const az = Math.abs(d);
      const shown = az <= this.visibleCards + 0.5;

      const tz = -this.depth * d;
      const tx = dir * this.spread * d;
      const ry = dir * this.tilt * this.clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.15, 1 - back * this.falloff);
      const blurPx = this.blur > 0 ? Math.min(this.blur, (back / Math.max(1, this.visibleCards)) * this.blur) : 0;
      const zi = Math.round(2000 - d * 20);

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
      el.style.zIndex = String(zi);
      el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

      const ov = this.overlayRefs[i];
      if (ov) ov.style.opacity = this.clamp(back * this.falloff * 1.25, 0, 0.86).toFixed(3);
    }
  }

  notify(idx) {
    this.active = idx;
    this.cardRefs.forEach((c, i) => c.setAttribute('aria-hidden', i !== idx));
    if (this.dots) {
      this.dots.forEach((d, i) => {
        d.className = `depth-carousel__dot${i === idx ? ' is-active' : ''}`;
        d.setAttribute('aria-selected', i === idx);
      });
    }
    if (this.onChange) this.onChange(idx, this.items[idx]);
  }

  tweenTo(target, animate) {
    if (this.tween) this.tween.kill();
    const proxy = { p: this.pos };
    const dur = animate && !this.reducedMotion ? this.duration / 1000 : 0;
    
    // We assume gsap is loaded globally
    if (window.gsap) {
      this.tween = window.gsap.to(proxy, {
        p: target,
        duration: dur,
        ease: this.ease,
        onUpdate: () => {
          this.pos = proxy.p;
          this.layout(proxy.p);
        },
        onComplete: () => {
          const n = this.count;
          if (n > 0) this.pos = ((this.pos % n) + n) % n;
          this.layout(this.pos);
        }
      });
    } else {
      this.pos = target;
      const n = this.count;
      if (n > 0) this.pos = ((this.pos % n) + n) % n;
      this.layout(this.pos);
    }
  }

  setFocus(rawIndex, animate = true) {
    const n = this.count;
    if (!n) return;
    const idx = this.loop ? ((rawIndex % n) + n) % n : this.clamp(rawIndex, 0, n - 1);
    let delta = idx - this.pos;
    if (this.loop && n > 1) {
      delta = ((delta % n) + n) % n;
      if (delta > n / 2) delta -= n;
    }
    this.tweenTo(this.pos + delta, animate);
    if (idx !== this.focus) {
      this.focus = idx;
      this.notify(idx);
    }
  }

  navigateBy(step) {
    this.setFocus(this.focus + step, true);
  }

  bindEvents() {
    this.root.addEventListener('wheel', e => {
      if (this.count < 2) return;
      e.preventDefault();
      if (this.tween) this.tween.kill();
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const delta = e.deltaMode === 1 ? raw * 24 : raw;
      const step = this.clamp(delta / (this.cardWidth * 0.9), -0.6, 0.6);
      this.pos += step;
      this.layout(this.pos);
      if (this.wheelTimer) clearTimeout(this.wheelTimer);
      this.wheelTimer = setTimeout(() => this.setFocus(Math.round(this.pos), true), 130);
    }, { passive: false });

    this.root.addEventListener('pointerdown', e => {
      if (this.count < 2) return;
      if (this.tween) this.tween.kill();
      this.drag = {
        x: e.clientX,
        startPos: this.pos,
        lastX: e.clientX,
        lastT: performance.now(),
        v: 0,
        moved: false,
        id: e.pointerId
      };
    });

    this.root.addEventListener('pointermove', e => {
      if (!this.drag) return;
      const stepPx = Math.max(this.cardWidth * 0.55 * this.scale, 40);
      const dx = e.clientX - this.drag.x;
      if (!this.drag.moved && Math.abs(dx) > 4) {
        this.drag.moved = true;
        this.root.setPointerCapture(this.drag.id);
      }
      if (!this.drag.moved) return;
      const now = performance.now();
      const dt = Math.max(now - this.drag.lastT, 1);
      this.drag.v = (e.clientX - this.drag.lastX) / dt;
      this.drag.lastX = e.clientX;
      this.drag.lastT = now;
      this.pos = this.drag.startPos - dx / stepPx;
      this.layout(this.pos);
    });

    const pointerEnd = () => {
      if (!this.drag) return;
      const drag = this.drag;
      this.drag = null;
      if (!drag.moved) return;
      const stepPx = Math.max(this.cardWidth * 0.55 * this.scale, 40);
      const projected = this.pos - (drag.v * 180) / stepPx;
      this.setFocus(Math.round(projected), true);
    };

    this.root.addEventListener('pointerup', pointerEnd);
    this.root.addEventListener('pointercancel', pointerEnd);

    this.root.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.navigateBy(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.navigateBy(1);
      }
    });

    if (this.autoplay && this.count > 1) {
      this.root.addEventListener('mouseenter', () => this.hovered = true);
      this.root.addEventListener('mouseleave', () => this.hovered = false);
      this.root.addEventListener('focusin', () => this.focused = true);
      this.root.addEventListener('focusout', () => this.focused = false);
    }
  }

  onCardClick(index) {
    if (this.drag?.moved) return;
    this.setFocus(index, true);
  }

  startAutoPlay() {
    if (this.autoTimer) clearInterval(this.autoTimer);
    this.autoTimer = setInterval(() => {
      if (!this.hovered && !this.focused) this.navigateBy(1);
    }, Math.max(this.autoplayDelay, 600));
  }

  destroy() {
    if (this.ro) this.ro.disconnect();
    if (this.tween) this.tween.kill();
    if (this.wheelTimer) clearTimeout(this.wheelTimer);
    if (this.autoTimer) clearInterval(this.autoTimer);
    this.container.innerHTML = '';
  }
}
window.DepthCarousel = DepthCarousel;
