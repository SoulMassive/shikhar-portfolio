/* ============================================================
   REGISTER PLUGINS
============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   CURSOR
============================================================ */
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
});

// Lagged ring follow
gsap.ticker.add(() => {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  gsap.set(cursorRing, { x: ringX, y: ringY });
});

// Cursor scale on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor,     { scale: 2.5, duration: 0.3 });
    gsap.to(cursorRing, { scale: 1.5, borderColor: 'rgba(26,188,156,1)', duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor,     { scale: 1, duration: 0.3 });
    gsap.to(cursorRing, { scale: 1, borderColor: 'rgba(26,188,156,0.6)', duration: 0.3 });
  });
});

/* ============================================================
   SCROLL PROGRESS BAR
============================================================ */
const progressBar = document.getElementById('progress-bar');
ScrollTrigger.create({
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    gsap.to(progressBar, { width: `${self.progress * 100}%`, duration: 0.1 });
  }
});

/* ============================================================
   HERO ANIMATIONS (entrance)
============================================================ */
const heroTL = gsap.timeline({ delay: 0.3 });

heroTL
  .to('.hero-label', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
  .to('.hero-headline .line span', {
    y: '0%',
    duration: 1,
    stagger: 0.12,
    ease: 'expo.out'
  }, '-=0.4')
  .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
  .to('#scroll-indicator', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');

/* ============================================================
   HERO EXIT ANIMATION
============================================================ */
gsap.to('#hero-content', {
  y: -80,
  opacity: 0,
  ease: 'power2.in',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

/* ============================================================
   HELPER — wrap words in span tags
============================================================ */
function wrapWords(el) {
  el.querySelectorAll('.word').forEach(word => {
    const text   = word.textContent;
    word.innerHTML = `<span>${text}</span>`;
  });
}

/* ============================================================
   HELPER — create pinned section animation
   @param {string} sectionId
   @param {object} opts — videoScale, videoX, blur
============================================================ */
function createStorySection(sectionId, opts = {}) {
  const section  = document.getElementById(sectionId);
  const videoEl  = section.querySelector('video, .vid-placeholder');
  const tag      = section.querySelector('.section-tag');
  const headline = section.querySelector('.story-headline');
  const body     = section.querySelector('.story-body');
  const wordSpans = headline.querySelectorAll('.word span');

  // Pin the section during scroll
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=100%',
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
  });

  // Main scroll-scrubbed timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=100%',
      scrub: 1.5,
    }
  });

  // Video zoom
  tl.fromTo(videoEl,
    { scale: 1, ...(opts.videoX ? { x: 0 } : {}) },
    { scale: opts.videoScale || 1.08, ...(opts.videoX ? { x: opts.videoX } : {}), ease: 'none' },
    0
  );

  // Section tag
  tl.fromTo(tag, { opacity: 0, x: -30 }, { opacity: 1, x: 0, ease: 'power2.out' }, 0.05);

  // Headline words stagger
  tl.fromTo(wordSpans,
    { y: '110%', opacity: 0 },
    { y: '0%', opacity: 1, stagger: 0.08, ease: 'expo.out' },
    0.1
  );

  // Body text
  tl.fromTo(body, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.3);

  // Optional blur effect
  if (opts.blur) {
    tl.fromTo(videoEl, { filter: 'blur(8px)' }, { filter: 'blur(0px)', ease: 'power2.out' }, 0);
  }

  // Exit: fade out content
  tl.to([tag, wordSpans, body], {
    opacity: 0,
    y: -30,
    stagger: 0.04,
    ease: 'power2.in',
  }, 0.75);

  return tl;
}

/* ============================================================
   SECTION 1 — WEB DEV
============================================================ */
wrapWords(document.querySelector('#webdev-headline'));
createStorySection('section-webdev', { videoScale: 1.1 });

/* ============================================================
   SECTION 2 — E-COMMERCE
============================================================ */
wrapWords(document.querySelector('#ecom-headline'));
createStorySection('section-ecom', {
  videoScale: 1.06,
  videoX: -20,
});

/* ============================================================
   SECTION 3 — VIDEO EDITING (char-by-char reveal)
============================================================ */
(function setupEditSection() {
  const section  = document.getElementById('section-edit');
  const videoEl  = section.querySelector('video, .vid-placeholder');
  const tag      = section.querySelector('.section-tag');
  const headline = document.getElementById('edit-headline');
  const body     = section.querySelector('.story-body');

  // Split headline into individual characters
  const text = headline.textContent.trim();
  headline.innerHTML = text.split('').map(char =>
    char === ' '
      ? '<span class="char" style="display:inline-block;width:0.35em;">&nbsp;</span>'
      : `<span class="char">${char}</span>`
  ).join('');

  const chars = headline.querySelectorAll('.char');

  // Pin
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=100%',
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=100%',
      scrub: 1.5,
    }
  });

  // Blur → focus video
  tl.fromTo(videoEl,
    { scale: 1.05, filter: 'blur(12px)' },
    { scale: 1, filter: 'blur(0px)', ease: 'power2.out' },
    0
  );

  // Tag
  tl.fromTo(tag, { opacity: 0, x: -30 }, { opacity: 1, x: 0 }, 0.05);

  // Char-by-char
  tl.fromTo(chars,
    { opacity: 0, y: 30, rotate: 5 },
    { opacity: 1, y: 0, rotate: 0, stagger: 0.015, ease: 'back.out(1.5)' },
    0.1
  );

  // Body
  tl.fromTo(body, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.45);

  // Exit
  tl.to([tag, chars, body], {
    opacity: 0,
    y: -30,
    stagger: 0.006,
    ease: 'power2.in',
  }, 0.8);
})();

/* ============================================================
   CTA SECTION ENTRANCE
============================================================ */
const ctaTL = gsap.timeline({
  scrollTrigger: {
    trigger: '#cta',
    start: 'top 75%',
    end: 'top 30%',
    scrub: 1,
  }
});

ctaTL
  .to('.cta-eyebrow',  { opacity: 1, y: 0, ease: 'power3.out' })
  .to('.cta-headline', { opacity: 1, y: 0, ease: 'power3.out' }, '-=0.2')
  .to('.btn-primary',  { opacity: 1, y: 0, ease: 'power3.out' }, '-=0.15');

/* ============================================================
   NAV hide/show on scroll
============================================================ */
let lastScroll = 0;
ScrollTrigger.create({
  start: 'top -80',
  end: 99999,
  onUpdate: (self) => {
    const current = self.scroll();
    if (current > lastScroll && current > 100) {
      gsap.to('#nav', { y: -80, duration: 0.4, ease: 'power2.in' });
    } else {
      gsap.to('#nav', { y: 0,   duration: 0.4, ease: 'power2.out' });
    }
    lastScroll = current;
  }
});

/* ============================================================
   PARALLAX for hero background
============================================================ */
gsap.to('.hero-bg', {
  y: 120,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});

/* ============================================================
   REFRESH ScrollTrigger after fonts load
============================================================ */
document.fonts.ready.then(() => {
  ScrollTrigger.refresh();
});

/* ============================================================
   REDUCE MOTION — accessibility
============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(0.01);
  ScrollTrigger.getAll().forEach(st => st.kill());
}
