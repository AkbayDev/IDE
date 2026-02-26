document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Hamburger Menu ---
  const btn = document.getElementById("hamburger");
  const nav = document.querySelector("nav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      btn.classList.toggle("open");
      nav.classList.toggle("open");
    });
    const links = nav.querySelectorAll("a");
    links.forEach(a => {
      a.addEventListener("click", () => {
        btn.classList.remove("open");
        nav.classList.remove("open");
      });
    });
  }

  // --- 2. Before & After Slider (index.html) ---
  const sliderContainer = document.querySelector('.ba-slider-container');
  if (sliderContainer) {
    const imageAfter = document.querySelector('.image-after');
    const sliderHandle = document.querySelector('.slider-handle');
    let isDragging = false;

    const moveSlider = (clientX) => {
      if (!isDragging) return;
      const rect = sliderContainer.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const percentage = (x / rect.width) * 100;
      sliderHandle.style.left = `${percentage}%`;
      imageAfter.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    };

    sliderContainer.addEventListener('mousedown', (e) => { isDragging = true; moveSlider(e.clientX); });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => moveSlider(e.clientX));
    sliderContainer.addEventListener('touchstart', (e) => { isDragging = true; moveSlider(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => { if (isDragging) moveSlider(e.touches[0].clientX); }, { passive: false });
  }

  // --- 3. Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
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
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });
  }

  // --- 4. Universele Formulier Verwerking (AJAX naar PHP) ---
  const ajaxForms = document.querySelectorAll(".js-ajax-form");

  ajaxForms.forEach(form => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const currentForm = event.target;
      // We zoeken knoppen/status berichten binnen het huidige formulier
      const submitBtn = currentForm.querySelector('button[type="submit"]');
      const statusMessage = currentForm.querySelector(".status-message") || createStatusElement(currentForm);

      // UI Feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        currentForm.dataset.oldText = submitBtn.innerText;
        submitBtn.innerText = "Verzenden...";
      }

      statusMessage.style.display = "none";

      const data = new FormData(currentForm);

      try {
        const response = await fetch(currentForm.action, {
          method: "POST",
          body: data
        });

        if (response.ok) {
          statusMessage.innerText = "Bedankt! Je bericht is succesvol verzonden.";
          statusMessage.style.color = "#4ade80"; // Groen
          statusMessage.style.display = "block";
          currentForm.reset();
        } else {
          throw new Error("Fout bij verzenden");
        }
      } catch (error) {
        statusMessage.innerText = "Oeps! Er is iets misgegaan. Probeer het later opnieuw.";
        statusMessage.style.color = "#f87171"; // Rood
        statusMessage.style.display = "block";
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = currentForm.dataset.oldText;
        }
      }
    });
  });

  // Hulpfunctie om een status-element te maken als je die vergeet in de HTML
  function createStatusElement(parent) {
    const p = document.createElement("p");
    p.className = "status-message";
    p.style.marginTop = "15px";
    p.style.fontWeight = "bold";
    parent.appendChild(p);
    return p;
  }
});
