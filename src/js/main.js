import AOS from 'aos';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false
});

// Header show/hide, transparency, and mobile menu
const initHeader = () => {
  const header     = document.getElementById('header');
  const hamburger  = document.querySelector('.hamburger');
  const navLinks   = document.querySelector('.nav-links');
  let lastScrollTop = 0;

  // Toggle mobile nav
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Scroll behaviors
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Transparent at top
    if (scrollTop < 50) {
      header.classList.add('transparent');
    } else {
      header.classList.remove('transparent');
    }

    // Hide on scroll down, show on scroll up
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    lastScrollTop = Math.max(scrollTop, 0);
  });

  // Initial transparent state
  if (window.pageYOffset < 50) {
    header.classList.add('transparent');
  }
};

// Gallery swiper/carousel
const initGallerySwiper = () => {
  new Swiper('.gallery-swiper', {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      480:  { slidesPerView: 1, centeredSlides: false },
      768:  { slidesPerView: 2, centeredSlides: false },
      1024: { slidesPerView: 3, centeredSlides: false }
    }
  });
};

const initContactForm = () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const payload = {
      name:      document.getElementById('name').value,
      email:     document.getElementById('email').value,
      phone:     document.getElementById('phone').value,
      message:   document.getElementById('message').value,
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch(
        'https://script.google.com/macros/s/AKfycbwzX1bs_GPe4DEmQfsfut6BZENqcrXd_ih3DWm5DfxsqBVdFqWnydvHLRMIoXHN5P_r/exec',
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)    // default mode is 'cors'
        }
      );

      const result = await res.json();
      if (result.status === 'success') {
        alert(`Thanks, ${payload.name}! We received your message.`);
        form.reset();
      } else {
        console.error('Server error:', result.error);
        alert('Server error—please try again later.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Network error—check your connection and try again.');
    }
  });
};


// Initialize everything once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initGallerySwiper();
  initContactForm();
});
