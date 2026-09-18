/**
 * Mohammed Rahees CP - Portfolio JavaScript
 * Features: Theme toggle, Mobile Menu, Scroll Spy, Skills Filtering,
 * Form Validation, Toast Notifications, Smooth Interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Toggle (Dark / Light Mode)
  // ==========================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or detect system preference
  const savedTheme = localStorage.getItem('mr_portfolio_theme');
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersLight) {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('mr_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode`, 'success');
    });
  }

  // ==========================================
  // 2. Mobile Navigation Hamburger Menu
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking on any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('active')) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // 3. Header Scrolled State & Scroll Spy
  // ==========================================
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    // Header shadow on scroll
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for active navbar item
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ==========================================
  // 4. Skills Filtering Tabs
  // ==========================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ==========================================
  // 5. Contact Form Validation & Submission
  // ==========================================
  const contactForm = document.getElementById('portfolioContactForm');
  const feedbackAlert = document.getElementById('formFeedbackAlert');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddress');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const serviceCategory = document.getElementById('serviceCategory');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const clearErrors = () => {
      nameError.textContent = '';
      emailError.textContent = '';
      subjectError.textContent = '';
      messageError.textContent = '';

      document.querySelectorAll('.input-wrapper').forEach(wrapper => {
        wrapper.classList.remove('error');
      });
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameError.textContent = 'Please provide your name (at least 2 characters).';
        nameInput.closest('.input-wrapper').classList.add('error');
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        emailInput.closest('.input-wrapper').classList.add('error');
        isValid = false;
      }

      // Validate Subject
      if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
        subjectError.textContent = 'Please specify a subject.';
        subjectInput.closest('.input-wrapper').classList.add('error');
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message must be at least 10 characters long.';
        messageInput.closest('.input-wrapper').classList.add('error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please correct the highlighted errors in the form.', 'error');
        return;
      }

      // Simulated form submission state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline-block';
      submitBtn.disabled = true;

      setTimeout(() => {
        btnText.style.display = 'inline-block';
        btnSpinner.style.display = 'none';
        submitBtn.disabled = false;

        // Display feedback banner
        if (feedbackAlert) {
          feedbackAlert.style.display = 'flex';
        }

        showToast('Message sent! Mohammed Rahees will reply soon.', 'success');

        // Optional mailto fallback option for the user
        const mailtoSubject = encodeURIComponent(`[${serviceCategory.value}] ${subjectInput.value.trim()}`);
        const mailtoBody = encodeURIComponent(`Hello Mohammed Rahees,\n\n${messageInput.value.trim()}\n\nBest regards,\n${nameInput.value.trim()} (${emailInput.value.trim()})`);
        
        console.info(`Contact message from ${nameInput.value.trim()} ready: mailto:raheescp.work@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`);

        contactForm.reset();
      }, 1000);
    });
  }

  // ==========================================
  // 6. Toast Notification Helper
  // ==========================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 4000);
  }

  // ==========================================
  // 7. Dynamic Year
  // ==========================================
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 8. Animate Progress Bars On View
  // ==========================================
  const progressBars = document.querySelectorAll('.progress-fill');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 100);
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => observer.observe(bar));
  }

  // ==========================================
  // 9. Custom Interactive Cursor (Dot + Follower)
  // ==========================================
  const initCustomCursor = () => {
    // Only activate on devices with fine pointer (mouse / trackpad)
    const isTouchDevice = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    if (isTouchDevice) return;

    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    if (!cursorDot || !cursorOutline) return;

    document.body.classList.add('has-custom-cursor');

    const mouse = { x: -100, y: -100 };
    const outline = { x: -100, y: -100 };
    let isVisible = false;
    let isClicking = false;

    // Direct, zero-delay movement for precision inner dot
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      cursorDot.style.left = `${mouse.x}px`;
      cursorDot.style.top = `${mouse.y}px`;

      if (!isVisible) {
        isVisible = true;
        // Snap outline position on first move to prevent offscreen swoop
        outline.x = mouse.x;
        outline.y = mouse.y;
        cursorOutline.style.left = `${outline.x}px`;
        cursorOutline.style.top = `${outline.y}px`;

        cursorDot.classList.add('visible');
        cursorOutline.classList.add('visible');
      }
    });

    // Smooth physics-based follower loop using linear interpolation (lerp)
    const lerpFactor = 0.18;
    const animateOutline = () => {
      if (isVisible) {
        outline.x += (mouse.x - outline.x) * lerpFactor;
        outline.y += (mouse.y - outline.y) * lerpFactor;

        cursorOutline.style.left = `${outline.x}px`;
        cursorOutline.style.top = `${outline.y}px`;
      }
      requestAnimationFrame(animateOutline);
    };
    requestAnimationFrame(animateOutline);

    // Click / Press feedback
    window.addEventListener('mousedown', () => {
      isClicking = true;
      cursorOutline.classList.add('cursor-active');
      cursorDot.classList.add('cursor-active');
    });

    window.addEventListener('mouseup', () => {
      isClicking = false;
      cursorOutline.classList.remove('cursor-active');
      cursorDot.classList.remove('cursor-active');
    });

    // Handle cursor leaving and entering window
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorDot.classList.remove('visible');
      cursorOutline.classList.remove('visible');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      cursorDot.classList.add('visible');
      cursorOutline.classList.add('visible');
    });

    // Delegation for interactive element hover states
    const interactiveSelector = 'a, button, .btn, .filter-tab, .theme-toggle, .hamburger-btn, .contact-card, .skill-category-card, .service-card, .project-card, .timeline-item, .metric-card, .back-to-top, [role="button"], input[type="submit"]';
    const textSelector = 'input[type="text"], input[type="email"], textarea, select';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(textSelector)) {
        cursorOutline.classList.add('cursor-text');
        cursorDot.classList.add('cursor-text');
        cursorOutline.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      } else if (e.target.closest(interactiveSelector)) {
        cursorOutline.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
        cursorOutline.classList.remove('cursor-text');
        cursorDot.classList.remove('cursor-text');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const related = e.relatedTarget;
      if (!related || !related.closest(textSelector)) {
        cursorOutline.classList.remove('cursor-text');
        cursorDot.classList.remove('cursor-text');
      }
      if (!related || !related.closest(interactiveSelector)) {
        cursorOutline.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      }
    });
  };

  initCustomCursor();
});
