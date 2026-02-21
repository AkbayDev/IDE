document.addEventListener('DOMContentLoaded', () => {

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



//------------------------hamburger menu voor mobiele users-------------------------------------

document.addEventListener("DOMContentLoaded", function() {
  var btn = document.getElementById("hamburger");
  var nav = document.querySelector("nav");
  if (btn && nav) {
    btn.addEventListener("click", function() {
      btn.classList.toggle("open");
      nav.classList.toggle("open");
    });
    var links = nav.querySelectorAll("a");
    links.forEach(function(a) {
      a.addEventListener("click", function() {
        btn.classList.remove("open");
        nav.classList.remove("open");
      });
    });
  }
});


// ----------------------------------- Formulier Verwerking
  // --- Universele Formulier Verwerking (Contact & Vacatures) ---
  const ajaxForms = document.querySelectorAll(".js-ajax-form");

  ajaxForms.forEach(form => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const currentForm = event.target;
      const submitBtn = currentForm.querySelector(".submit-button");
      const buttonText = currentForm.querySelector(".button-text");
      const statusMessage = currentForm.querySelector(".status-message");

      // UI Feedback: Loading state
      if (submitBtn) submitBtn.disabled = true;
      if (buttonText) {
        // Bewaar originele tekst om later te herstellen
        currentForm.dataset.originalText = buttonText.innerText;
        buttonText.innerText = "Verzenden...";
      }
      if (statusMessage) statusMessage.style.display = "none";

      // Gebruik FormData om alle velden (inclusief bestanden!) op te halen
      const data = new FormData(currentForm);

      try {
        const response = await fetch(currentForm.action, {
          method: currentForm.method,
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          if (statusMessage) {
            statusMessage.innerText = "Bedankt! We hebben je gegevens goed ontvangen.";
            statusMessage.style.color = "#4ade80";
            statusMessage.style.display = "block";
          }
          currentForm.reset();
        } else {
          throw new Error("Server error");
        }
      } catch (error) {
        if (statusMessage) {
          statusMessage.innerText = "Oeps! Er is iets misgegaan. Probeer het later opnieuw.";
          statusMessage.style.color = "#f87171";
          statusMessage.style.display = "block";
        }
      } finally {
        // Herstel de knop
        if (submitBtn) submitBtn.disabled = false;
        if (buttonText) buttonText.innerText = currentForm.dataset.originalText;
      }
    });
  });

        if (response.ok) {
          // Succes scenario
          statusMessage.innerText = "Bedankt! Je bericht is succesvol verzonden.";
          statusMessage.style.color = "#4ade80"; // Groen
          statusMessage.style.display = "block";
          contactForm.reset(); // Maak het formulier leeg
        } else {
          // Error van server
          statusMessage.innerText = "Oeps! Er is iets misgegaan. Probeer het later opnieuw.";
          statusMessage.style.color = "#f87171"; // Rood
          statusMessage.style.display = "block";
        }
      } catch (error) {
        // Netwerkfout
        statusMessage.innerText = "Netwerkfout. Controleer je internetverbinding.";
        statusMessage.style.color = "#f87171";
        statusMessage.style.display = "block";
      } finally {
        // Reset de knop
        submitBtn.disabled = false;
        if (buttonText) buttonText.innerText = "Verstuur Aanvraag";
      }
    });
  }
