/**
 * IDE Vloer- en Tegelwerken — Main JavaScript
 * Handles: header scroll, hamburger menu, scroll animations,
 * before/after slider, lightbox, and form AJAX submission.
 */
document.addEventListener('DOMContentLoaded', () => {

  // =====================================================================
  // 1. Sticky Header — add .scrolled class on scroll
  // =====================================================================
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // =====================================================================
  // 2. Hamburger Menu (mobile)
  // =====================================================================
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =====================================================================
  // 3. Smooth Scroll for anchor links
  // =====================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =====================================================================
  // 4. Intersection Observer — Scroll Reveal Animations
  // =====================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // =====================================================================
  // 5. Before & After Slider
  // =====================================================================
  const sliderContainer = document.querySelector('.ba-slider-container');

  if (sliderContainer) {
    const imageAfter = sliderContainer.querySelector('.image-after');
    const sliderHandle = sliderContainer.querySelector('.slider-handle');
    let isDragging = false;

    function moveSlider(clientX) {
      if (!isDragging) return;
      const rect = sliderContainer.getBoundingClientRect();
      let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      sliderHandle.style.left = `${percentage}%`;
      imageAfter.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    }

    // Mouse events
    sliderContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      moveSlider(e.clientX);
      e.preventDefault();
    });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => moveSlider(e.clientX));

    // Touch events
    sliderContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      moveSlider(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (isDragging) {
        e.preventDefault();
        moveSlider(e.touches[0].clientX);
      }
    }, { passive: false });
  }

  // =====================================================================
  // 6. Lightbox (for gallery items on realisaties page)
  // =====================================================================
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || 'Uitvergrote foto';
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // =====================================================================
  // 7. Form AJAX Submission (universal for contact + vacatures)
  // =====================================================================
  const ajaxForms = document.querySelectorAll('.js-ajax-form');

  ajaxForms.forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const statusEl = form.querySelector('.status-message');
      const originalText = submitBtn ? submitBtn.textContent : '';

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verzenden...';
      }
      if (statusEl) {
        statusEl.className = 'status-message';
        statusEl.textContent = '';
      }

      const data = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method || 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (statusEl) {
            statusEl.textContent = 'Bedankt! Uw bericht is succesvol verzonden. Wij nemen zo snel mogelijk contact op.';
            statusEl.className = 'status-message success';
          }
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (error) {
        if (statusEl) {
          statusEl.textContent = 'Oeps! Er is iets misgegaan. Probeer het later opnieuw of neem telefonisch contact op.';
          statusEl.className = 'status-message error';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  });

});
