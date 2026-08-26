document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // SCROLL-DRIVEN ZOOM & THEME SWITCHER
  // ==========================================
  const heroOuter = document.querySelector('.hero-sticky-outer');
  const heroSvg = document.getElementById('hero-svg');
  const screenLines = document.getElementById('screen-lines');
  const heroDetails = document.querySelector('.hero-details');
  const starryBg = document.getElementById('starry-bg');
  const sidebarPath = document.getElementById('sidebar-path');
  
  let hasTyped = false;
  const pathText = "← ~/mahima/projects";

  const triggerTyping = () => {
    if (hasTyped) return;
    hasTyped = true;
    sidebarPath.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < pathText.length) {
        sidebarPath.textContent += pathText.charAt(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 70);
  };

  const handleScrollEffects = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const outerHeight = heroOuter.offsetHeight;
    const stickyHeight = window.innerHeight;
    const maxScroll = outerHeight - stickyHeight;
    
    // Calculate scroll percentage through the sticky zone
    const scrollRatio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    
    // 1. Camera zoom effect on SVG
    // Scales from 1.0 to 16.0
    const scale = 1 + scrollRatio * 15;
    heroSvg.style.transform = `scale(${scale})`;
    
    // 2. Opacity fades for hero elements
    const heroOpacity = Math.max(1 - scrollRatio * 1.8, 0);
    heroDetails.style.opacity = heroOpacity;
    starryBg.style.opacity = heroOpacity * 0.7; // 0.7 is initial CSS opacity
    
    // 3. Screen lines fade out as screen expands
    if (scrollRatio > 0.4) {
      const linesOpacity = Math.max(1 - (scrollRatio - 0.4) * 2.5, 0);
      screenLines.style.opacity = linesOpacity;
    } else {
      screenLines.style.opacity = 1;
    }
    
    // 4. Section transition / body state
    if (scrollRatio >= 0.85) {
      document.body.classList.add('in-workspace');
      triggerTyping();
    } else {
      document.body.classList.remove('in-workspace');
    }
  };

  window.addEventListener('scroll', handleScrollEffects);
  handleScrollEffects(); // Run on initial load


  // ==========================================
  // AUDIENCE SELECTOR TABS
  // ==========================================
  const audienceMessages = {
    'recruiters': 'Looking for an engineer who builds production-ready multi-agent flows and sub-200ms latency APIs? Scroll down.',
    'founders': 'Have an ambitious idea in document AI, LLMs, or backend APIs? I build prototypes that scale. Let\'s build.',
    'developers': 'I love designing clean abstractions, structured data parsers, and custom event streams. Check out my stack below.',
    'ai-teams': 'Optimizing prompt templates, testing routing accuracy, and managing vector DB pipelines are my core focus. Let\'s align.'
  };

  const tabButtons = document.querySelectorAll('.tab-btn');
  const audienceText = document.getElementById('audience-text');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all tabs
      tabButtons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      });

      // Activate clicked tab
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const audience = btn.getAttribute('data-audience');
      const message = audienceMessages[audience] || '';

      // Fade animation transition
      audienceText.style.opacity = '0';
      setTimeout(() => {
        audienceText.textContent = message;
        audienceText.style.opacity = '1';
      }, 150);
    });
  });


  // ==========================================
  // PROJECT CASE STUDY MODALS
  // ==========================================
  const projectCards = document.querySelectorAll('.index-card');
  const modalOverlays = document.querySelectorAll('.brutal-modal-overlay');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  // Open Modal
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectKey = card.getAttribute('data-project');
      const targetModal = document.getElementById(`modal-${projectKey}`);
      if (targetModal) {
        targetModal.style.display = 'flex';
        // Add class slightly after to allow transition trigger
        setTimeout(() => {
          targetModal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      }
    });
  });

  // Close Modal (Clicking close button)
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.brutal-modal-overlay');
      if (parentModal) {
        parentModal.classList.remove('show');
        setTimeout(() => {
          parentModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = ''; // Restore background scrolling
      }
    });
  });

  // Close Modal (Clicking backdrop area)
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      // Only close if user clicked directly on the overlay outer wrapper, not the inner modal card
      if (e.target === overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
      }
    });
  });


  // ==========================================
  // CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastText = toast.querySelector('span');
  const toastSvgPath = toast.querySelector('svg path');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalSubmitHtml = submitBtn.innerHTML;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'SENDING...';

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      const data = await response.json();
      if (response.status === 200 && data.success) {
        // Success: checkmark icon, green toast
        toast.classList.remove('error');
        toastSvgPath.setAttribute('d', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z');
        toastText.textContent = 'Message sent! 📌';
        contactForm.reset();
      } else {
        // API level error: cross icon, red toast
        toast.classList.add('error');
        toastSvgPath.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        toastText.textContent = data.message || 'Something went wrong. ❌';
      }
    })
    .catch((error) => {
      console.error(error);
      toast.classList.add('error');
      toastSvgPath.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
      toastText.textContent = 'Network error. Please try again. ❌';
    })
    .finally(() => {
      // Re-enable button and restore original state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalSubmitHtml;

      // Show the toast
      toast.classList.add('show');

      // Hide toast after 4 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    });
  });


  // ==========================================
  // BACK TO TOP
  // ==========================================
  const backToTopBtn = document.getElementById('btn-back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollPos > 600) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.visibility = 'visible';
      backToTopBtn.style.transform = 'translateY(0)';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
      backToTopBtn.style.transform = 'translateY(10px)';
    }
  });

  // Init styled transition parameters on back to top button
  backToTopBtn.style.transition = 'opacity 0.25s, visibility 0.25s, transform 0.25s';
  backToTopBtn.style.opacity = '0';
  backToTopBtn.style.visibility = 'hidden';
  backToTopBtn.style.transform = 'translateY(10px)';

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

});
