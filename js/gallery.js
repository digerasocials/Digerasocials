/*
 * ==========================================
 * STUDIO CREATIVE: DYNAMIC GALLERY & LIGHTBOX
 * Premium Minimalist Architecture Aesthetic
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const residentialContainer = document.getElementById('residential-gallery');
  const commercialContainer = document.getElementById('commercial-gallery');

  if (residentialContainer) {
    buildGallery(residentialContainer, 'residential');
  } else if (commercialContainer) {
    buildGallery(commercialContainer, 'commercial');
  }
});

// Cache for valid loaded images to support seamless lightbox navigation
let activeGalleryImages = [];
let currentLightboxIndex = 0;

/**
 * DYNAMIC PATH CONFIGURATOR
 * Detects running environment and handles fallbacks automatically
 */
function getAssetPrefix() {
  // Check if we are inside a subfolder (e.g. /projects/residential.html or similar)
  const path = window.location.pathname;
  
  // If the path includes /projects/ or we are in a nested directory structure
  // This is highly flexible to match sub-routing on both local servers and relative file systems
  const isSubfolder = path.includes('/projects/') || (path.split('/').length > 2 && !path.startsWith('file:///C:'));
  
  // Local file systems (file:///) require a robust depth check
  if (window.location.protocol === 'file:') {
    // If the path has 'projects' before the file name
    return path.toLowerCase().includes('/projects/') ? '../' : '';
  }
  
  return isSubfolder ? '../' : '';
}

/**
 * BUILDS THE 12-IMAGE PORTFOLIO GALLERY
 */
function buildGallery(container, category) {
  const assetPrefix = getAssetPrefix();
  
  // High-end titles and descriptions to make the gallery feel premium
  const projectMetadata = {
    residential: [
      { title: "Pavilion House", loc: "Geneva, Switzerland" },
      { title: "Concrete Monolith", loc: "Kyoto, Japan" },
      { title: "Desert Sanctuary", loc: "Palm Springs, USA" },
      { title: "Forest Frame Villa", loc: "Oslo, Norway" },
      { title: "Minimalist Loft", loc: "Tribeca, NYC" },
      { title: "Ocean Edge Residence", loc: "Big Sur, California" },
      { title: "The Courtyard Residence", loc: "Melbourne, Australia" },
      { title: "Brutalist Hideaway", loc: "Sintra, Portugal" },
      { title: "Stone Walls Villa", loc: "Tuscany, Italy" },
      { title: "Glass House Retreat", loc: "Reykjavik, Iceland" },
      { title: "Canyon Crest Estate", loc: "Auckland, New Zealand" },
      { title: "Subterranean Sanctuary", loc: "Athens, Greece" }
    ],
    commercial: [
      { title: "Vanguard Studio Headquarters", loc: "London, UK" },
      { title: "Apex Retail Pavilion", loc: "Milan, Italy" },
      { title: "Ethereal Gallery Space", loc: "Paris, France" },
      { title: "The Grid Coworking Hub", loc: "Tokyo, Japan" },
      { title: "Monochrome Boutique Hotel", loc: "Copenhagen, Denmark" },
      { title: "Zenith Showroom", loc: "Seoul, South Korea" },
      { title: "Symmetry Design Lab", loc: "Berlin, Germany" },
      { title: "Echo Concert Hall", loc: "Helsinki, Finland" },
      { title: "Linear Corporate Center", loc: "Singapore" },
      { title: "Horizon Exhibition Pavilions", loc: "Dubai, UAE" },
      { title: "Raw Concrete Creative Hub", loc: "São Paulo, Brazil" },
      { title: "Minimal Museum of Modern Art", loc: "Stockholm, Sweden" }
    ]
  };

  const metadataList = projectMetadata[category] || Array(12).fill({ title: "Architectural Form", loc: "Studio Curation" });

  // Clear container
  container.innerHTML = '';
  activeGalleryImages = [];

  // Loop exactly 12 items
  for (let i = 1; i <= 12; i++) {
    const padIndex = String(i).padStart(2, '0');
    const filename = `${padIndex}.jpg`;

    // Establish dynamic target paths (Primary requested structure vs Flat asset structure)
    const primaryPath = `${assetPrefix}assets/projects/${category}/${filename}`;
    const fallbackPath = `${assetPrefix}assets/${category}/${filename}`;

    // Create DOM structure
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';
    item.style.transitionDelay = `${(i % 3) * 0.15}s`; // Stagger columns dynamically
    
    const img = document.createElement('img');
    img.alt = `${metadataList[i-1].title} - ${metadataList[i-1].loc}`;
    img.loading = 'lazy';
    img.decoding = 'async'; /* Forces background decoding of heavy JPEGs to prevent UI lag */
    
    // Fallback error-catching dynamic loader
    img.src = primaryPath;
    img.onerror = function() {
      img.src = fallbackPath;
      img.onerror = function() {
        // Secondary fallback
        img.src = `${assetPrefix}assets/projects/${filename}`;
        img.onerror = function() {
          // If all paths fail, the image physically does not exist in the directory.
          // Quietly remove the entire item card container from the page grid!
          item.remove();
          
          // Filter it out from our active lightbox registry so it doesn't show as a blank slide
          activeGalleryImages = activeGalleryImages.filter(gImg => gImg.index !== i);
          
          // Re-index remaining slides to ensure seamless lightbox order
          activeGalleryImages.forEach((gImg, idx) => {
            gImg.element.parentNode.onclick = () => {
              // Sync loaded src path
              activeGalleryImages.forEach(g => g.src = g.element.src);
              openLightbox(idx);
            };
          });
        };
      };
    };

    // Append clean hardware-accelerated image directly without text overlays
    item.appendChild(img);
    
    container.appendChild(item);

    // Keep track of this image in active list
    const imgObj = {
      src: '', // Set dynamically once img actually loads to avoid broken slides
      title: metadataList[i-1].title,
      loc: metadataList[i-1].loc,
      index: i,
      element: img
    };

    activeGalleryImages.push(imgObj);

    // Add click handler for high-end lightbox
    item.addEventListener('click', () => {
      // Sync exact loaded src path
      activeGalleryImages.forEach(gImg => {
        gImg.src = gImg.element.src;
      });
      
      openLightbox(i - 1);
    });
  }

  // Trigger scroll fade-ins once items are injected
  setTimeout(() => {
    const fadeElements = container.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
      element.classList.add('appear');
    });
  }, 100);
}

/**
 * HIGH-END CUSTOM LIGHTBOX ENGINE
 */
function getOrCreateLightbox() {
  let lightbox = document.querySelector('.lightbox');
  
  if (!lightbox) {
    // Dynamically inject Lightbox modal to keep HTML pages extremely clean
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-control lightbox-close" aria-label="Close Lightbox">
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <button class="lightbox-control lightbox-prev" aria-label="Previous Project">
        <svg viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="Architectural Portfolio Space">
        <div class="lightbox-caption">
          <div class="lightbox-counter">01 / 12</div>
          <div class="lightbox-title">Minimalist Pavilion</div>
        </div>
      </div>
      <button class="lightbox-control lightbox-next" aria-label="Next Project">
        <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    `;
    
    document.body.appendChild(lightbox);
    setupLightboxListeners(lightbox);
  }
  
  return lightbox;
}

function openLightbox(index) {
  const lightbox = getOrCreateLightbox();
  currentLightboxIndex = index;
  
  updateLightboxContent(lightbox);
  
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden'; // Lock scrolling
}

function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = ''; // Unlock scrolling
  }
}

function updateLightboxContent(lightbox) {
  const imgElement = lightbox.querySelector('.lightbox-img');
  const counterElement = lightbox.querySelector('.lightbox-counter');
  const titleElement = lightbox.querySelector('.lightbox-title');
  
  if (!imgElement || activeGalleryImages.length === 0) return;
  
  const project = activeGalleryImages[currentLightboxIndex];
  
  // Pre-load logic for smooth crossfade
  imgElement.style.opacity = '0';
  imgElement.style.transform = 'scale(0.97)';
  
  setTimeout(() => {
    imgElement.src = project.src;
    imgElement.alt = `Portfolio Slide ${String(currentLightboxIndex + 1).padStart(2, '0')}`;
    counterElement.textContent = `${String(currentLightboxIndex + 1).padStart(2, '0')} / ${String(activeGalleryImages.length).padStart(2, '0')}`;
    titleElement.textContent = ''; // Stripped description title to keep the entire site completely clean and focused on images
    
    imgElement.onload = () => {
      imgElement.style.opacity = '1';
      imgElement.style.transform = 'scale(1)';
    };
  }, 150);
}

function navigateLightbox(direction) {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  
  if (direction === 'next') {
    currentLightboxIndex = (currentLightboxIndex + 1) % activeGalleryImages.length;
  } else if (direction === 'prev') {
    currentLightboxIndex = (currentLightboxIndex - 1 + activeGalleryImages.length) % activeGalleryImages.length;
  }
  
  updateLightboxContent(lightbox);
}

/**
 * LIGHTBOX DESKTOP HOTKEYS & SWIPE ERGONOMICS
 */
function setupLightboxListeners(lightbox) {
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  closeBtn.addEventListener('click', closeLightbox);
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox('prev');
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox('next');
    });
  }
  
  // Close when clicking empty black glass overlay area
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });
  
  // Desktop Keyboard Arrow Keys Support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navigateLightbox('next');
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox('prev');
    }
  });

  // Mobile Swipe Gesture Support (Apple & Android)
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const threshold = 50; // Min drag distance in pixels
    const deltaX = touchEndX - touchStartX;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        // Swiped Left -> Load Next
        navigateLightbox('next');
      } else {
        // Swiped Right -> Load Prev
        navigateLightbox('prev');
      }
    }
  }
}
