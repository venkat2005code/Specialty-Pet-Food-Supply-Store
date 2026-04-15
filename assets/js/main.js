/**
 * Pet Store Premium Template
 * Main JavaScript File
 * Handles: Dark Mode, RTL, Mobile Menu, and UI Interactions
 */

// ==========================================
// DARK MODE TOGGLE
// ==========================================
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
const htmlElement = document.documentElement;

const updateDarkModeButtons = (isDarkMode) => {
  if (darkModeToggle) {
    darkModeToggle.innerHTML = isDarkMode
      ? '<i class="fas fa-sun text-yellow-400"></i>'
      : '<i class="fas fa-moon dark:hidden"></i><i class="fas fa-sun hidden dark:block text-yellow-400"></i>';
  }

  if (darkModeToggleMobile) {
    darkModeToggleMobile.innerHTML = isDarkMode ? '☀ Light Mode' : '🌙 Dark Mode';
  }
};

// Check for saved preference or system preference
if (localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  htmlElement.classList.add('dark');
}

updateDarkModeButtons(htmlElement.classList.contains('dark'));

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('darkMode', htmlElement.classList.contains('dark'));
    updateDarkModeButtons(htmlElement.classList.contains('dark'));
  });
}

if (darkModeToggleMobile) {
  darkModeToggleMobile.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('darkMode', htmlElement.classList.contains('dark'));
    updateDarkModeButtons(htmlElement.classList.contains('dark'));
  });
}

// ==========================================
// RTL TOGGLE
// ==========================================
const rtlToggle = document.getElementById('rtlToggle');
const rtlToggleMobile = document.getElementById('rtlToggleMobile');
const isRtlEnabled = localStorage.getItem('rtl') === 'true';

const updateRtlButtons = (isRtlMode) => {
  if (rtlToggle) {
    rtlToggle.innerHTML = isRtlMode ? '🌐 LTR' : '🌍 RTL';
  }

  if (rtlToggleMobile) {
    rtlToggleMobile.innerHTML = isRtlMode ? '🌐 LTR Toggle' : '🌍 RTL Toggle';
  }
};

if (isRtlEnabled) {
  htmlElement.setAttribute('dir', 'rtl');
}

updateRtlButtons(isRtlEnabled);

if (rtlToggle) {
  rtlToggle.addEventListener('click', () => {
    const currentDir = htmlElement.getAttribute('dir');
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    htmlElement.setAttribute('dir', newDir);
    localStorage.setItem('rtl', newDir === 'rtl');
    updateRtlButtons(newDir === 'rtl');
  });
}

if (rtlToggleMobile) {
  rtlToggleMobile.addEventListener('click', () => {
    const currentDir = htmlElement.getAttribute('dir');
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    htmlElement.setAttribute('dir', newDir);
    localStorage.setItem('rtl', newDir === 'rtl');
    updateRtlButtons(newDir === 'rtl');
  });
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobileMenu = document.getElementById('closeMobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

if (closeMobileMenu && mobileMenu) {
  closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
}

if (mobileMenu) {
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (mobileMenu && mobileMenu.classList.contains('active')) {
    if (!mobileMenu.contains(e.target) && (!mobileMenuBtn || !mobileMenuBtn.contains(e.target))) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// ==========================================
// STICKY NAVBAR ON SCROLL
// ==========================================
const navbar = document.querySelector('.navbar-sticky');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
}

// ==========================================
// ACTIVE NAV LINK HIGHLIGHTING
// ==========================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const normalizeHref = (href) => (href || '')
  .split('?')[0]
  .split('#')[0]
  .replace(/^\.\//, '')
  .replace(/^\/+/, '');

const activeLinkClasses = ['text-purple-600', 'font-semibold'];
const activeMobileLinkClasses = ['bg-purple-50', 'dark:bg-purple-900/30'];
const activeButtonClasses = ['text-purple-600', 'font-semibold', 'bg-purple-50', 'dark:bg-purple-900/30'];

document.querySelectorAll('nav a[href], #mobileMenu a[href]').forEach(link => {
  if (link.textContent.includes('PetStore')) {
    return;
  }

  if (normalizeHref(link.getAttribute('href')) === currentPage) {
    link.classList.add(...activeLinkClasses);
    link.setAttribute('aria-current', 'page');

    if (link.closest('#mobileMenu')) {
      link.classList.add(...activeMobileLinkClasses);
    }
  }
});

document.querySelectorAll('.dropdown').forEach(dropdown => {
  const dropdownLinks = Array.from(dropdown.querySelectorAll('a[href]'));
  const isCurrentDropdown = dropdownLinks.some(link => normalizeHref(link.getAttribute('href')) === currentPage);

  if (isCurrentDropdown) {
    const button = dropdown.querySelector('button');
    if (button) {
      button.classList.add(...activeButtonClasses);
      button.setAttribute('aria-current', 'page');
    }
  }
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const suffix = element.getAttribute('data-suffix') || '';
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = `${target}${suffix}`;
      clearInterval(timer);
    } else {
      element.textContent = `${Math.floor(start)}${suffix}`;
    }
  }, 16);
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = parseInt(counter.getAttribute('data-target'));
      animateCounter(counter, target);
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => {
  counterObserver.observe(counter);
});

// ==========================================
// PRODUCT FILTER FUNCTIONALITY
// ==========================================
const filterButtons = document.querySelectorAll('.filter-tag');
const productGrid = document.getElementById('productGrid');

if (filterButtons.length > 0 && productGrid) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      const products = productGrid.querySelectorAll('.product-item');
      
      products.forEach(product => {
        if (filter === 'all' || product.getAttribute('data-category') === filter) {
          product.style.display = 'block';
          setTimeout(() => {
            product.style.opacity = '1';
            product.style.transform = 'scale(1)';
          }, 10);
        } else {
          product.style.opacity = '0';
          product.style.transform = 'scale(0.8)';
          setTimeout(() => {
            product.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchInput && searchResults) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const items = searchResults.querySelectorAll('.searchable-item');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

// ==========================================
// WISHLIST FUNCTIONALITY
// ==========================================
const wishlistButtons = document.querySelectorAll('.wishlist-btn');

wishlistButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    button.classList.toggle('active');
    
    // Show notification
    showNotification(
      button.classList.contains('active') ? 'Added to wishlist!' : 'Removed from wishlist',
      button.classList.contains('active') ? 'success' : 'info'
    );
  });
});

// ==========================================
// ADD TO CART FUNCTIONALITY
// ==========================================
const addToCartButtons = document.querySelectorAll('button.add-to-cart-btn');

addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Animation feedback
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.classList.add('bg-green-600');
    
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
      button.classList.remove('bg-green-600');
    }, 2000);
    
    showNotification('Product added to cart!', 'success');
  });
});

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
  
  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white'
  };
  
  notification.classList.add(...colors[type].split(' '));
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Animate out and remove
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// ==========================================
// MODAL FUNCTIONALITY
// ==========================================
const modalTriggers = document.querySelectorAll('[data-modal]');
const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

modalTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const modalId = trigger.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

modalCloseButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal-overlay');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ==========================================
// FORM VALIDATION
// ==========================================
const forms = document.querySelectorAll('form[data-validate]');

forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('border-red-500');
        
        // Show error message
        let errorMsg = input.parentElement.querySelector('.error-message');
        if (!errorMsg) {
          errorMsg = document.createElement('p');
          errorMsg.className = 'error-message text-red-500 text-sm mt-1';
          input.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = 'This field is required';
      } else {
        input.classList.remove('border-red-500');
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.remove();
        }
      }
    });
    
    if (isValid) {
      showNotification('Form submitted successfully!', 'success');
      form.reset();
    } else {
      showNotification('Please fill in all required fields', 'error');
    }
  });
});

// ==========================================
// IMAGE GALLERY (for product details)
// ==========================================
const galleryThumbnails = document.querySelectorAll('.gallery-thumbnail');
const mainImage = document.getElementById('mainImage');

if (galleryThumbnails.length > 0 && mainImage) {
  galleryThumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Remove active class from all thumbnails
      galleryThumbnails.forEach(t => t.classList.remove('ring-2', 'ring-purple-500'));
      // Add active class to clicked thumbnail
      thumb.classList.add('ring-2', 'ring-purple-500');
      
      // Update main image
      mainImage.src = thumb.getAttribute('data-image');
    });
  });
}

// ==========================================
// COUNTDOWN TIMER (for offers/coming soon)
// ==========================================
function updateCountdown(endDate, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    if (distance < 0) {
      clearInterval(interval);
      container.innerHTML = '<div class="text-center text-2xl font-bold">Offer Expired!</div>';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    container.innerHTML = `
      <div class="countdown-item">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${hours}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${minutes}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">${seconds}</span>
        <span class="countdown-label">Seconds</span>
      </div>
    `;
  }, 1000);
}

// Example usage for countdown (uncomment and set date when needed)
// const offerEndDate = new Date('2026-04-30T23:59:59').getTime();
// updateCountdown(offerEndDate, 'countdownTimer');

// ==========================================
// TESTIMONIAL SLIDER
// ==========================================
let currentTestimonial = 0;
const testimonialSlides = document.querySelectorAll('.testimonial-slide');

function showTestimonial(index) {
  testimonialSlides.forEach((slide, i) => {
    slide.style.display = i === index ? 'block' : 'none';
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
  showTestimonial(currentTestimonial);
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
  showTestimonial(currentTestimonial);
}

// Auto-rotate testimonials every 5 seconds
if (testimonialSlides.length > 0) {
  showTestimonial(0);
  setInterval(nextTestimonial, 5000);
}

// ==========================================
// NEWSLETTER SUBSCRIPTION
// ==========================================
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (email) {
      showNotification('Thank you for subscribing!', 'success');
      newsletterForm.reset();
    }
  });
}

// ==========================================
// LAZY LOADING IMAGES
// ==========================================
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove('opacity-0', 'invisible');
      backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
      backToTopBtn.classList.add('opacity-0', 'invisible');
      backToTopBtn.classList.remove('opacity-100', 'visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==========================================
// PRICE RANGE FILTER
// ==========================================
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

if (priceRange && priceValue) {
  priceRange.addEventListener('input', (e) => {
    priceValue.textContent = `$${e.target.value}`;
  });
}

// ==========================================
// TAB SWITCHING
// ==========================================
const tabButtons = document.querySelectorAll('[data-tab]');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab');
    
    // Remove active class from all buttons and contents
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.classList.remove('active', 'border-purple-600', 'text-purple-600');
    });
    document.querySelectorAll('[data-tab-content]').forEach(content => {
      content.classList.add('hidden');
    });
    
    // Add active class to clicked button and corresponding content
    button.classList.add('active', 'border-purple-600', 'text-purple-600');
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
      tabContent.classList.remove('hidden');
    }
  });
});

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Pet Store Template Loaded Successfully! 🐾');
  
  // Initialize any additional components here
});
