/**
 * ===========================================
 * MOBILE-FIRST LANDING PAGE - MAIN SCRIPT
 * Competition-grade JavaScript with performance focus
 * ===========================================
 */

// ========================================
// PERFORMANCE & INIT
// ========================================

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Load CSS
const loadStyles = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/src/styles.css';
  document.head.appendChild(link);
};

// ========================================
// LOADING SCREEN
// ========================================
const handleLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');

  // Minimum display time for smooth experience
  const minLoadTime = 1000;
  const startTime = performance.now();

  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    const remainingTime = Math.max(0, minLoadTime - loadTime);

    setTimeout(() => {
      loadingScreen.classList.add('hidden');

      // Remove from DOM after transition
      setTimeout(() => {
        loadingScreen.remove();
      }, 400);
    }, remainingTime);
  });
};

// ========================================
// HEADER SCROLL BEHAVIOR
// ========================================
const handleHeaderScroll = () => {
  const header = document.getElementById('header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
};

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
const handleScrollReveal = () => {
  if (prefersReducedMotion) {
    // Immediately show all elements if reduced motion is preferred
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Stop observing after reveal for performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
};

// ========================================
// STATS COUNTER ANIMATION
// ========================================
const handleStatsCounter = () => {
  if (prefersReducedMotion) return;

  const stats = document.querySelectorAll('.stat-value');
  let hasAnimated = false;

  const animateValue = (element, start, end, duration, suffix = '') => {
    const startTime = performance.now();
    const isNumber = !isNaN(parseFloat(end));

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      if (isNumber) {
        const current = start + (parseFloat(end) - start) * easeProgress;
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = end + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        stats.forEach(stat => {
          const text = stat.textContent;
          const isMoneyValue = text.includes('$');
          const isPlusValue = text.includes('+');

          // Extract numeric value
          let numericValue = text.replace(/[^0-9.]/g, '');
          let suffix = '';

          if (text.includes('M')) suffix = 'M+';
          else if (text.includes('K')) suffix = 'K+';
          else if (text.includes('+')) suffix = '+';
          else if (text.includes('Years')) {
            numericValue = text;
            suffix = '';
          }

          const prefix = isMoneyValue ? '$' : '';
          const finalValue = numericValue + suffix;

          if (!text.includes('Years')) {
            stat.textContent = prefix + '0';
            animateValue(stat, 0, parseFloat(numericValue), 2000, suffix);
          }
        });

        observer.disconnect();
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
};

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
const handleSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip empty anchors
      if (href === '#') return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.getElementById('header')?.offsetHeight || 60;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });
};

// ========================================
// MAGNETIC BUTTON EFFECT
// ========================================
const handleMagneticButtons = () => {
  if (prefersReducedMotion || window.innerWidth < 768) return;

  const buttons = document.querySelectorAll('.button-primary');

  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle magnetic pull (max 4px)
      const moveX = x * 0.1;
      const moveY = y * 0.1;

      button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
};

// ========================================
// PARALLAX EFFECT FOR GRADIENT ORBS
// ========================================
const handleParallax = () => {
  if (prefersReducedMotion || window.innerWidth < 768) return;

  const orbs = document.querySelectorAll('.gradient-orb');
  let ticking = false;

  const updateParallax = () => {
    const scrolled = window.scrollY;

    orbs.forEach((orb, index) => {
      // Different speeds for each orb
      const speed = 0.2 + (index * 0.1);
      const yPos = -(scrolled * speed);
      orb.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
};

// ========================================
// ENHANCED FOCUS MANAGEMENT
// ========================================
const handleFocusManagement = () => {
  let isUsingKeyboard = false;

  // Detect keyboard usage
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isUsingKeyboard = true;
      document.body.classList.add('using-keyboard');
    }
  });

  // Detect mouse usage
  window.addEventListener('mousedown', () => {
    isUsingKeyboard = false;
    document.body.classList.remove('using-keyboard');
  });
};

// ========================================
// INTERSECTION OBSERVER POLYFILL CHECK
// ========================================
const checkIntersectionObserver = () => {
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported. Loading polyfill...');
    // In production, load polyfill here
    // For now, fallback: immediately show all elements
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('revealed');
    });
  }
};

// ========================================
// PERFORMANCE MONITORING
// ========================================
const monitorPerformance = () => {
  if ('PerformanceObserver' in window) {
    // Monitor layout shifts (CLS)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            console.log('Layout shift detected:', entry.value);
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Observer not supported
    }

    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('Long task detected:', entry.duration);
        }
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
    } catch (e) {
      // Observer not supported
    }
  }

  // Log performance metrics on load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log('Performance Metrics:');
        console.log('- DNS:', perfData.domainLookupEnd - perfData.domainLookupStart, 'ms');
        console.log('- TCP:', perfData.connectEnd - perfData.connectStart, 'ms');
        console.log('- TTFB:', perfData.responseStart - perfData.requestStart, 'ms');
        console.log('- Download:', perfData.responseEnd - perfData.responseStart, 'ms');
        console.log('- DOM Interactive:', perfData.domInteractive, 'ms');
        console.log('- DOM Complete:', perfData.domComplete, 'ms');
        console.log('- Load Complete:', perfData.loadEventEnd, 'ms');
      }

      // Log First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        console.log(`- ${entry.name}:`, entry.startTime, 'ms');
      });
    }, 0);
  });
};

// ========================================
// ERROR TRACKING
// ========================================
const handleErrors = () => {
  window.addEventListener('error', (event) => {
    console.error('Error caught:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
};

// ========================================
// VIEWPORT HEIGHT FIX FOR MOBILE
// ========================================
const handleMobileViewport = () => {
  // Fix for mobile browser address bar
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVh();

  window.addEventListener('resize', () => {
    setVh();
  }, { passive: true });
};

// ========================================
// LAZY LOAD IMAGES (if any)
// ========================================
const handleLazyLoad = () => {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for older browsers
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
};

// ========================================
// REGISTER SERVICE WORKER
// ========================================
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registered:', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }
};

// ========================================
// INITIALIZE EVERYTHING
// ========================================
const init = () => {
  console.log('🚀 Initializing landing page...');

  // Load styles
  loadStyles();

  // Core functionality
  handleLoadingScreen();
  handleHeaderScroll();
  handleSmoothScroll();
  handleFocusManagement();
  handleMobileViewport();

  // Check for feature support
  checkIntersectionObserver();

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      handleScrollReveal();
      handleStatsCounter();
      handleMagneticButtons();
      handleParallax();
      handleLazyLoad();
    });
  } else {
    handleScrollReveal();
    handleStatsCounter();
    handleMagneticButtons();
    handleParallax();
    handleLazyLoad();
  }

  // Register service worker for offline capability
  registerServiceWorker();

  // Development only
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    monitorPerformance();
    handleErrors();
  }

  console.log('✅ Landing page initialized successfully');
};

// Start the application
init();

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    handleScrollReveal,
    handleStatsCounter,
    handleSmoothScroll
  };
}
