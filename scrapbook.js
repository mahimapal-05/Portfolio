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

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log('Form submission received:', { name, email, message });

    // Show custom green sticky note toast
    toast.classList.add('show');

    // Reset Form fields
    contactForm.reset();

    // Hide Toast after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
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
