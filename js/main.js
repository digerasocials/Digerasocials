/*
 * ==========================================
 * STUDIO CREATIVE: GLOBAL INTERACTIVE LOGIC
 * Premium Minimalist Architecture Aesthetic
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all global micro-interactions
  initMobileNavigation();
  initHeroSlider();
  initScrollAnimations();
  initFloatingLabels();
  initFormSubmissions();
  highlightActiveMenu();
});

/**
 * 1. MOBILE NAVIGATION OVERLAY & HAMBURGER
 */
function initMobileNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const body = document.body;

  if (!hamburger || !mobileOverlay) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    
    // Prevent background scrolling when menu is open
    if (mobileOverlay.classList.contains('open')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  });

  // Close menu if links are clicked
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sub-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileOverlay.classList.remove('open');
      body.style.overflow = '';
    });
  });
}

/**
 * 2. AUTOMATIC HOME SLIDESHOW WITH SLOW ZOOM
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  let currentSlide = 0;
  const slideInterval = 6000; // 6 seconds per slide

  // Activate first slide
  slides[currentSlide].classList.add('active');

  setInterval(() => {
    // Remove active class from current
    slides[currentSlide].classList.remove('active');
    
    // Move to next index
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Add active class to next
    slides[currentSlide].classList.add('active');
  }, slideInterval);
}

/**
 * 3. INTERSECTION OBSERVER FOR FADE-IN SCROLL ANIMATIONS
 */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px' // Slightly offset bottom trigger
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          // Once animated, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for older browsers
    fadeElements.forEach(element => {
      element.classList.add('appear');
    });
  }
}

/**
 * 4. FLOATING LABELS FOR INQUIRY FORMS
 */
function initFloatingLabels() {
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  
  formInputs.forEach(input => {
    // Check initial state (if pre-filled by browser)
    if (input.value.trim() !== '') {
      input.placeholder = ''; // Clear placeholder to trigger label scale
    }

    input.addEventListener('focus', () => {
      input.placeholder = '';
    });

    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        input.placeholder = ' '; // Trigger CSS placeholder-shown rule
      }
    });
  });

  // Specifically handle careers custom file upload text feedback
  const fileInput = document.querySelector('.file-upload-input');
  const uploadText = document.querySelector('.file-upload-text');
  
  if (fileInput && uploadText) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        const filename = e.target.files[0].name;
        uploadText.innerHTML = `Selected File: <span style="text-decoration:none;font-weight:400;color:var(--accent-gold);">${filename}</span>`;
      } else {
        uploadText.innerHTML = `Drag & drop your CV or <span>Browse</span>`;
      }
    });
  }
}

/**
 * 5. SOPHISTICATED CONTACT/CAREERS SUBMISSION HANDLER
 */
function initFormSubmissions() {
  const forms = document.querySelectorAll('.minimal-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.btn-minimal');
      const statusMsg = form.querySelector('.form-status');
      
      if (!submitBtn || !statusMsg) return;
      
      const originalText = submitBtn.textContent;
      
      // Visual Loader feedback
      submitBtn.disabled = true;
      submitBtn.textContent = 'TRANSMITTING...';
      submitBtn.style.letterSpacing = '0.3em';
      submitBtn.style.opacity = '0.6';
      
      // Simulate API call (1.8s delay)
      setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.letterSpacing = '';
        submitBtn.style.opacity = '';
        
        // Dynamic success message
        statusMsg.style.display = 'block';
        statusMsg.className = 'form-status success';
        
        if (form.id === 'contact-form') {
          statusMsg.textContent = 'THANK YOU. YOUR INQUIRY HAS BEEN RECORDED AND TRANSMITTED TO OUR PRINCIPALS.';
        } else if (form.id === 'careers-form') {
          statusMsg.textContent = 'APPLICATION SUBMITTED. OUR CURATION COMMITTEE WILL REVIEW YOUR PORTFOLIO.';
        }
        
        // Reset form fields
        form.reset();
        
        // Trigger blur on inputs to reset floating labels
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
          input.placeholder = ' ';
        });
        
        // Scroll success message into view
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide success message after 8 seconds
        setTimeout(() => {
          statusMsg.style.display = 'none';
        }, 8000);
        
      }, 1800000 / 1000); // 1.8s simulation delay
    });
  });
}

/**
 * 6. AUTOMATIC ACTIVE NAVIGATION HIGHLIGHTING
 */
function highlightActiveMenu() {
  const currentPath = window.location.pathname;
  const pageFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  // Clean active states
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
  
  // Match link hrefs
  const desktopLinks = document.querySelectorAll('.nav-link, .dropdown-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sub-link');
  
  // helper to check match
  const isMatch = (href) => {
    if (!href) return false;
    const linkFilename = href.substring(href.lastIndexOf('/') + 1);
    return linkFilename === pageFilename;
  };

  desktopLinks.forEach(link => {
    if (isMatch(link.getAttribute('href'))) {
      link.classList.add('active');
      
      // If it's a dropdown link inside Projects, highlight the parent item as active too
      const dropdownParent = link.closest('.nav-item');
      if (dropdownParent) {
        dropdownParent.classList.add('active');
      }
    }
  });

  mobileLinks.forEach(link => {
    if (isMatch(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

  // Fallback for root projects pages
  if (pageFilename === 'projects.html') {
    const projectsItem = document.getElementById('nav-projects-parent');
    if (projectsItem) {
      projectsItem.classList.add('active');
    }
  }
}
