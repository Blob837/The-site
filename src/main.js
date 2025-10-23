/**
 * PRAECO LANDING - MAIN JAVASCRIPT
 * Competition-grade interactions | GSAP animations | Lenis smooth scroll
 * 60fps performance | Mobile-optimized | Reduced motion support
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './style.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Check for reduced motion preference
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Check if device is touch-enabled
 */
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/**
 * Initialize Lenis smooth scrolling (desktop only, respects reduced motion)
 */
let lenis;
if (!isTouchDevice && !prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // RAF loop for Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync GSAP ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/**
 * Header scroll effect
 */
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
}, { passive: true });

/**
 * Intersection Observer for scroll reveals
 */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');

      // Enhanced GSAP animation for scroll reveals (if not reduced motion)
      if (!prefersReducedMotion) {
        gsap.from(entry.target, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all',
        });
      }
    }
  });
}, observerOptions);

// Observe all scroll-reveal elements
document.querySelectorAll('.scroll-reveal').forEach((el) => {
  observer.observe(el);
});

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -80 });
      } else {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  });
});

/**
 * Desktop-only enhancements
 */
if (!isTouchDevice && !prefersReducedMotion) {
  // Cursor glow effect
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';

    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Magnetic button effect
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });

  // Card tilt effect
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });

  // Stat items magnetic effect
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(stat => {
    stat.addEventListener('mouseenter', () => {
      gsap.to(stat.querySelector('.stat-value'), {
        scale: 1.05,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
    });

    stat.addEventListener('mouseleave', () => {
      gsap.to(stat.querySelector('.stat-value'), {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });
}

/**
 * Mobile-optimized touch feedback
 */
if (isTouchDevice) {
  const touchElements = document.querySelectorAll('.button, .card, .stat-item, .nav-button');
  touchElements.forEach(el => {
    el.addEventListener('touchstart', function() {
      this.style.transition = 'all 0.1s ease';
    }, { passive: true });

    el.addEventListener('touchend', function() {
      this.style.transition = '';
    }, { passive: true });
  });
}

/**
 * Parallax effect for gradient orbs (performance-optimized)
 */
let ticking = false;
const parallaxMultiplier = isTouchDevice ? 0.15 : 0.3;

window.addEventListener('scroll', () => {
  if (!ticking && !prefersReducedMotion) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const orb1 = document.querySelector('.gradient-orb-1');
      const orb2 = document.querySelector('.gradient-orb-2');
      const orb3 = document.querySelector('.gradient-orb-3');

      if (orb1) {
        gsap.to(orb1, {
          y: scrolled * parallaxMultiplier,
          duration: 0.5,
          ease: 'none',
        });
      }
      if (orb2) {
        gsap.to(orb2, {
          y: scrolled * -parallaxMultiplier * 0.7,
          duration: 0.5,
          ease: 'none',
        });
      }
      if (orb3) {
        gsap.to(orb3, {
          y: scrolled * parallaxMultiplier * 0.5,
          duration: 0.5,
          ease: 'none',
        });
      }

      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/**
 * Animate stat values on scroll into view
 */
const statValues = document.querySelectorAll('.stat-value');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
      entry.target.classList.add('animated');

      if (!prefersReducedMotion) {
        gsap.fromTo(entry.target,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
        );
      }
    }
  });
}, { threshold: 0.5 });

statValues.forEach(stat => statObserver.observe(stat));

/**
 * GSAP ScrollTrigger animations for sections (if not reduced motion)
 */
if (!prefersReducedMotion) {
  // Fade in sections
  gsap.utils.toArray('.section').forEach((section, i) => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Stagger animate cards
  gsap.utils.toArray('.grid').forEach((grid) => {
    const cards = grid.querySelectorAll('.card');
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Feature items slide in
  gsap.utils.toArray('.feature-item').forEach((item, i) => {
    gsap.from(item, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Hero title shimmer enhancement
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.from(heroTitle, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.2,
    });
  }

  // CTA section pulse
  const ctaSection = document.querySelector('.cta-section');
  if (ctaSection) {
    gsap.from(ctaSection.querySelector('h2'), {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: ctaSection,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });
  }
}

/**
 * Log performance metrics in development
 */
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    if ('performance' in window) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      console.log('%c⚡ Performance Metrics', 'color: #00e599; font-size: 16px; font-weight: bold;');
      console.log(`📊 Page Load Time: ${pageLoadTime}ms`);
      console.log(`🔌 Connect Time: ${connectTime}ms`);
      console.log(`🎨 Render Time: ${renderTime}ms`);
      console.log(`📱 Touch Device: ${isTouchDevice}`);
      console.log(`♿ Reduced Motion: ${prefersReducedMotion}`);
      console.log(`🚀 Lenis Enabled: ${!!lenis}`);
    }
  });
}

/**
 * Service Worker registration (production only)
 */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      },
      (error) => {
        console.log('❌ Service Worker registration failed:', error);
      }
    );
  });
}

console.log('%c🏆 Praeco Landing - Built for $100K Competition', 'color: #00e599; font-size: 14px; font-weight: bold; padding: 10px;');
