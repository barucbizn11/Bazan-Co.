
document.addEventListener('DOMContentLoaded', () => {
  initRevealAnimations();
  initParticles();
  initCounterAnimation();
  initMobileMenu();
  initNavbarScroll();
  initSmoothScroll();
  initContactForm();
  initWhatsAppButton();
  initCookieBanner();
  initPrivacyModal();
});


function initRevealAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (entry.target.classList.contains('reveal-child')) {
        const parent = entry.target.parentElement;
        const siblings = parent.querySelectorAll('.reveal-child');
        const idx = Array.from(siblings).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, idx * 150);
      } else {
        entry.target.classList.add('is-visible');
      }

      observer.unobserve(entry.target);
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-child').forEach((el) => {
    observer.observe(el);
  });
}


function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const PARTICLE_COUNT = 15;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 6 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `-${size}px`;
    particle.style.animationDuration = `${Math.random() * 15 + 12}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;

    container.appendChild(particle);
  }
}


function initCounterAnimation() {
  const statElements = document.querySelectorAll('.stat__number[data-target]');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateAllCounters(statElements);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  const statsContainer = statElements[0].closest('.hero__stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  }
}

function animateAllCounters(elements) {
  elements.forEach((el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}


function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    iconOpen.style.display = isOpen ? 'none' : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
    menuBtn.setAttribute('aria-expanded', isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      iconOpen.style.display = 'block';
      iconClose.style.display = 'none';
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}


function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          navbar.classList.add('navbar--scrolled');
        } else {
          navbar.classList.remove('navbar--scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}


function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccess = document.getElementById('form-success');

  if (!form || !submitBtn) return;

  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/1ihBrpBzapDpQGtarTRNpLzeK0KEvMLZJlrN3gcMbx_M/formResponse';
  const ENTRIES = {
    name: 'entry.1439802834',
    email: 'entry.1264921441',
    service: 'entry.860358949',
    message: 'entry.345199843'
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Enviando...
    `;

    const formData = new URLSearchParams();
    formData.append(ENTRIES.name, document.getElementById('name').value);
    formData.append(ENTRIES.email, document.getElementById('email').value);
    formData.append(ENTRIES.service, document.getElementById('service').value);
    formData.append(ENTRIES.message, document.getElementById('message').value);

    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })
      .then(() => {
        form.querySelectorAll('.form__group, .form__grid').forEach((el) => {
          el.style.display = 'none';
        });
        submitBtn.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('is-visible');
      })
      .catch((error) => {
        console.error('Error al enviar formulario:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
      });
  });
}


function initWhatsAppButton() {
  const fab = document.getElementById('whatsapp-fab');
  if (!fab) return;

  let visible = false;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400 && !visible) {
      fab.classList.add('is-visible');
      visible = true;
    } else if (window.scrollY <= 400 && visible) {
      fab.classList.remove('is-visible');
      visible = false;
    }
  });
}


function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies-btn');
  
  if (!banner || !acceptBtn) return;
  
  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
      banner.classList.add('is-visible');
      banner.setAttribute('aria-hidden', 'false');
    }, 500);
  }
  
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
      banner.style.display = 'none';
    }, 300);
  });
}


function initPrivacyModal() {
  const modal = document.getElementById('privacy-modal');
  const openLink = document.getElementById('open-privacy-link');
  const closeBtn = document.getElementById('close-privacy-btn');
  const modalContent = modal?.querySelector('.privacy-modal__content');
  
  if (!modal || !openLink || !closeBtn) return;
  
  const openModal = (e) => {
    e.preventDefault();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  
  openLink.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (modalContent && !modalContent.contains(e.target)) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}
