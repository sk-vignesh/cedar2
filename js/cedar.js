/* cedar.js — Cedar Enterprises site scripts */

(function () {
  'use strict';

  /* ── Preloader ── */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add('hidden');
      }, 900);
    }
  });

  /* ── Copyright year ── */
  var yearEls = document.querySelectorAll('#year');
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ── Header scroll behaviour ── */
  var header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ── Mobile nav ── */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  var mobileNavClose = document.getElementById('mobileNavClose');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileNavClose && mobileNav) {
    mobileNavClose.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  // Close on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Hero slider ── */
  var slides = document.querySelectorAll('.hero-slide');
  var dots   = document.querySelectorAll('.hero-dot');
  var currentSlide = 0;
  var slideInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  if (slides.length > 1) {
    slideInterval = setInterval(nextSlide, 6000);

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        clearInterval(slideInterval);
        goToSlide(i);
        slideInterval = setInterval(nextSlide, 6000);
      });
    });
  }

  /* ── Scroll-triggered fade animations ── */
  var animEls = document.querySelectorAll('.fade-up, .fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(function (el, i) {
      // Stagger delay for sibling elements
      el.style.transitionDelay = (i % 4) * 0.1 + 's';
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    animEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Animated stat counters ── */
  var statNums = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    var target = el.textContent.trim();
    // Only animate pure numeric values
    var num = parseInt(target.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num) || num === 0) return;
    var suffix = target.replace(/[0-9]/g, '');
    var start = 0;
    var duration = 1400;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * num) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target; // Ensure exact final value
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ── Contact form handling ── */
  var contactForm = document.getElementById('contactForm');
  var formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      var required = contactForm.querySelectorAll('[required]');
      required.forEach(function (field) {
        if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
          valid = false;
          field.style.borderColor = '#c0392b';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        formMessage.style.display = 'block';
        formMessage.style.background = '#fdecea';
        formMessage.style.color = '#c0392b';
        formMessage.style.border = '1px solid #f5c6cb';
        formMessage.textContent = 'Please complete all required fields.';
        return;
      }

      // Simulate submission (no backend — Cedar can wire this up)
      var submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(function () {
        formMessage.style.display = 'block';
        formMessage.style.background = '#eaf7f0';
        formMessage.style.color = '#1a6640';
        formMessage.style.border = '1px solid #b7e4cb';
        formMessage.textContent = 'Thank you for your message. We will be in touch within one business day.';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 800);
    });

    // Reset field error styling on input
    contactForm.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
      });
    });
  }

})();
