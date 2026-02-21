document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Fade-in on Scroll ---
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      appearOnScroll.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // --- 2. Contact Formulier (contact.html) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      alert(`Bedankt voor uw bericht, ${name}! We nemen zo spoedig mogelijk contact met u op.`);
      contactForm.reset();
    });
  }

  // --- 3. Before & After Slider (index.html) ---
  const sliderContainer = document.querySelector('.ba-slider-container');
  if (sliderContainer) {
    const imageAfter = document.querySelector('.image-after');
    const sliderHandle = document.querySelector('.slider-handle');
    let isDragging = false;

    sliderContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      moveSlider(e.clientX);
    });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => moveSlider(e.clientX));

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

    function moveSlider(clientX) {
      if (!isDragging) return;
      const rect = sliderContainer.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const percentage = (x / rect.width) * 100;
      sliderHandle.style.left = `${percentage}%`;
      imageAfter.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    }
  }

  // --- 4. Lightbox (Veilig gemaakt tegen crashes) ---
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // We doen ALLES van de lightbox IN deze if-statement.
  // Zo crasht het script niet op pagina's waar geen foto's staan.
  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        if(img) lightboxImg.src = img.src;
        if(lightboxCaption) lightboxCaption.textContent = overlay ? overlay.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- 5. Custom Formulier Verzending & Pop-up (vacatures.html) ---
  const jobForm = document.getElementById('jobForm');
  const successModal = document.getElementById('successModal');

  if (jobForm && successModal) {
    const modalMessage = document.getElementById('modal-message');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalOkBtn = document.getElementById('modal-ok-btn');

    jobForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Nu wordt dit 100% uitgevoerd!

      const submitBtn = jobForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      submitBtn.textContent = "Bezig met verzenden...";
      submitBtn.disabled = true;

      try {
        const formData = new FormData(jobForm);

        // AJAX request naar PHP
        const response = await fetch('sollicitatie.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
          const naam = formData.get('naam');
          if(modalMessage) modalMessage.textContent = `Bedankt, ${naam}! We hebben je sollicitatie in goede orde ontvangen. We nemen snel contact op.`;
          jobForm.reset();
        } else {
          if(modalMessage) modalMessage.textContent = "Er ging iets mis bij het verzenden op de server. Probeer het later opnieuw.";
        }
      } catch (error) {
        if(modalMessage) modalMessage.textContent = "Verbindingsfout. Controleer uw internetverbinding en probeer opnieuw.";
      }

      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
      successModal.classList.add('active');
    });

    const closeModal = () => successModal.classList.remove('active');

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeModal();
    });
  }

});
