document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // LENIS SMOOTH SCROLL INITIALIZATION
  // ==========================================
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium exponential easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }
  }

  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ==========================================
  // CUSTOM SCRAPBOOK CURSOR (Ink Dot & Spring Follower)
  // ==========================================
  const cursorDot = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('custom-cursor-follower');

  if (cursorDot && cursorFollower && typeof gsap !== 'undefined') {
    const dotX = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3.out" });
    const followerX = gsap.quickTo(cursorFollower, "x", { duration: 0.35, ease: "power2.out" });
    const followerY = gsap.quickTo(cursorFollower, "y", { duration: 0.35, ease: "power2.out" });

    window.addEventListener('mousemove', (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      followerX(e.clientX);
      followerY(e.clientY);
    });

    // Magnetic / Hover Expansion on Interactive Elements
    const interactiveEls = document.querySelectorAll('a, button, .index-card, .sticky-note, .tab-btn, .skill-pill, .modal-close-btn');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('cursor-hover');
        gsap.to(cursorDot, { scale: 1.6, duration: 0.2 });
      });
      el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('cursor-hover');
        gsap.to(cursorDot, { scale: 1, duration: 0.2 });
      });
    });

    // Click Ripple
    window.addEventListener('mousedown', () => {
      gsap.to(cursorFollower, { scale: 0.75, duration: 0.15 });
    });
    window.addEventListener('mouseup', () => {
      gsap.to(cursorFollower, { scale: 1, duration: 0.25, ease: "back.out(2)" });
    });
  }

  // ==========================================
  // HERO INTRO ENTRANCE ANIMATION (Page Load)
  // ==========================================
  if (typeof gsap !== 'undefined') {
    const introTl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    introTl
      .from(".header", {
        y: -70,
        opacity: 0,
        duration: 0.8
      })
      .from(".hero-path", {
        opacity: 0,
        x: -25,
        duration: 0.6
      }, "-=0.4")
      .from(".hero-title", {
        y: 35,
        opacity: 0,
        duration: 0.85
      }, "-=0.4")
      .from(".hero-desc", {
        y: 25,
        opacity: 0,
        duration: 0.75
      }, "-=0.5")
      .from(".audience-tabs-container", {
        y: 25,
        opacity: 0,
        duration: 0.75
      }, "-=0.4")
      .from(".hero-svg-card", {
        scale: 0.92,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.2)"
      }, "-=0.7");
  }

  // ==========================================
  // HERO AMBIENT & 3D PARALLAX ANIMATIONS (GSAP)
  // ==========================================
  if (typeof gsap !== 'undefined') {
    // 1. Hero 3D Card Tilt on Mouse Move
    const heroCard = document.querySelector('.hero-svg-card');
    const heroSection = document.querySelector('.hero-section');
    if (heroCard && heroSection) {
      gsap.set(heroCard, { transformPerspective: 1000, transformStyle: "preserve-3d" });
      const xTo = gsap.quickTo(heroCard, "rotationY", { duration: 0.6, ease: "power2.out" });
      const yTo = gsap.quickTo(heroCard, "rotationX", { duration: 0.6, ease: "power2.out" });

      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        xTo(relX * 14);
        yTo(-relY * 14);
      });

      heroSection.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    }

    // 2. Coffee steam loop
    if (document.getElementById('coffee-steam')) {
      gsap.to('#coffee-steam', {
        y: -6,
        opacity: 0.2,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // 3. Laptop glow breathing
    if (document.getElementById('laptop-glow')) {
      gsap.to('#laptop-glow', {
        opacity: 0.45,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // 4. Code screen lines dynamic wave
    if (document.querySelectorAll('#screen-lines rect').length > 0) {
      gsap.to('#screen-lines rect', {
        scaleX: 0.85,
        transformOrigin: "left center",
        duration: 1.4,
        stagger: {
          each: 0.18,
          repeat: -1,
          yoyo: true
        },
        ease: "power1.inOut"
      });
    }

    // 5. Starry background floating stars
    document.querySelectorAll('.starry-bg .star').forEach((star, idx) => {
      gsap.to(star, {
        y: idx % 2 === 0 ? -10 : 10,
        x: idx % 3 === 0 ? 6 : -6,
        duration: 2.8 + (idx * 0.4),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: idx * 0.2
      });
    });

    // 6. Shooting Star Animation (Hero Sky)
    const shootingStar = document.getElementById('shooting-star');
    if (shootingStar) {
      const launchShootingStar = () => {
        gsap.set(shootingStar, { x: 0, y: 0, opacity: 0 });
        gsap.timeline()
          .to(shootingStar, {
            opacity: 0.85,
            duration: 0.2,
            ease: "power1.out"
          })
          .to(shootingStar, {
            x: -250,
            y: 180,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in"
          });
      };

      // Initial shoot and periodic interval
      setTimeout(launchShootingStar, 2500);
      setInterval(launchShootingStar, 7000);
    }

    // 7. Interactive Hero Click Surprises
    const heroSvg = document.getElementById('hero-svg');
    if (heroSvg) {
      heroSvg.addEventListener('click', (e) => {
        // Playful bounce on SVG card
        gsap.fromTo('.hero-svg-card',
          { scale: 0.98 },
          { scale: 1, duration: 0.4, ease: "elastic.out(1.2, 0.4)" }
        );

        // Extra steam puff
        if (document.getElementById('coffee-steam')) {
          gsap.fromTo('#coffee-steam',
            { scale: 1, opacity: 1, y: 0 },
            { scale: 1.8, opacity: 0, y: -20, duration: 0.8, ease: "power2.out" }
          );
        }
      });
    }

    // 8. Side handwritten notes gentle breathing
    document.querySelectorAll('.side-comment').forEach((comment, idx) => {
      gsap.to(comment, {
        y: idx % 2 === 0 ? "-=6" : "+=6",
        duration: 2.4 + (idx * 0.3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  // ==========================================
  // SCROLL-DRIVEN HERO ZOOM & THEME SWITCHER
  // ==========================================
  const heroOuter = document.querySelector('.hero-sticky-outer');
  const sidebarPath = document.getElementById('sidebar-path');
  
  let hasTyped = false;
  const pathText = "← ~/mahima/projects";

  const triggerTyping = () => {
    if (hasTyped || !sidebarPath) return;
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
    }, 60);
  };

  if (heroOuter && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-sticky-outer",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          if (self.progress >= 0.75) {
            document.body.classList.add('in-workspace');
            triggerTyping();
          } else {
            document.body.classList.remove('in-workspace');
          }
        }
      }
    });

    heroTl
      .to("#hero-svg", {
        scale: 16,
        ease: "power1.inOut",
        duration: 1
      }, 0)
      .to(".hero-details", {
        opacity: 0,
        y: -40,
        ease: "power1.out",
        duration: 0.4
      }, 0)
      .to("#starry-bg", {
        opacity: 0,
        ease: "power1.out",
        duration: 0.4
      }, 0)
      .to("#screen-lines", {
        opacity: 0,
        ease: "power1.out",
        duration: 0.35
      }, 0.25);
  }

  // ==========================================
  // SCROLL-TRIGGERED REVEAL ANIMATIONS (Self-Completing)
  // ==========================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

    // 1. Workspace Separator Ruler
    if (document.querySelector(".desk-ruler")) {
      gsap.from(".desk-ruler", {
        scrollTrigger: {
          trigger: ".workspace-ruler-divider",
          start: "top 90%",
          toggleActions: "play none none reverse"
        },
        scaleX: 0.85,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity"
      });
    }

    // 2. Sidebar Title & Animated Drawing of Red Ink Circle
    if (document.querySelector(".workspace-sidebar")) {
      gsap.from(".sidebar-title, .sticky-note", {
        scrollTrigger: {
          trigger: ".workspace-grid",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: "power3.out",
        clearProps: "opacity"
      });

      // Animate drawing the handdrawn red oval
      const redCircle = document.getElementById('sidebar-red-circle');
      if (redCircle) {
        const totalLen = redCircle.getTotalLength ? redCircle.getTotalLength() : 650;
        gsap.set(redCircle, { strokeDasharray: totalLen, strokeDashoffset: totalLen });

        gsap.to(redCircle, {
          scrollTrigger: {
            trigger: ".workspace-sidebar",
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          strokeDashoffset: 0,
          duration: 1.2,
          delay: 0.3,
          ease: "power2.out"
        });
      }
    }

    // 3. Work Cards Staggered Entrance & Arrow Drawing
    const workCards = document.querySelectorAll(".work-card-wrapper");
    workCards.forEach((card) => {
      const indexCard = card.querySelector(".index-card");
      const tapes = card.querySelectorAll(".tape-top-left, .tape-top-right, .paperclip");
      const comment = card.querySelector(".side-comment");
      const arrowPath = card.querySelector(".draw-arrow");

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      if (indexCard) {
        cardTl.from(indexCard, {
          y: 45,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "transform,opacity"
        });
      }

      if (tapes.length > 0) {
        cardTl.from(tapes, {
          y: -15,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.7)",
          clearProps: "transform,opacity"
        }, "-=0.4");
      }

      if (comment) {
        cardTl.from(comment, {
          scale: 0.85,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "transform,opacity"
        }, "-=0.3");
      }

      if (arrowPath) {
        const arrLen = arrowPath.getTotalLength ? arrowPath.getTotalLength() : 100;
        gsap.set(arrowPath, { strokeDasharray: arrLen, strokeDashoffset: arrLen });
        cardTl.to(arrowPath, {
          strokeDashoffset: 0,
          duration: 0.7,
          ease: "power2.out"
        }, "-=0.3");
      }
    });

    // 4. Skills Section Folder & Pills
    if (document.querySelector(".skills-section")) {
      gsap.from(".skills-section .desk-folder", {
        scrollTrigger: {
          trigger: ".skills-section",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 45,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity"
      });

      gsap.from(".skill-pill", {
        scrollTrigger: {
          trigger: ".skills-section",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        scale: 0.85,
        opacity: 0,
        duration: 0.45,
        stagger: 0.025,
        ease: "back.out(1.5)",
        clearProps: "transform,opacity"
      });
    }

    // 5. Experience Section Log Entries
    if (document.querySelector(".experience-section")) {
      gsap.from(".experience-section .desk-folder, .log-entry", {
        scrollTrigger: {
          trigger: ".experience-section",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 45,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
        clearProps: "transform,opacity"
      });

      gsap.from(".log-bullets li", {
        scrollTrigger: {
          trigger: ".log-bullets",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "transform,opacity"
      });
    }

    // 6. Academia & Credentials Section
    if (document.querySelector(".academia-certs-section")) {
      gsap.from(".academia-certs-section .work-card-wrapper, .academia-certs-section .index-card", {
        scrollTrigger: {
          trigger: ".academia-certs-section",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: "power3.out",
        clearProps: "transform,opacity"
      });
    }

    // 7. Contact Legal Pad Section
    if (document.querySelector(".contact-section")) {
      gsap.from(".legal-pad-container", {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        clearProps: "transform,opacity"
      });

      gsap.from(".contact-card-list li, .legal-pad-input-group, .legal-pad-form-area .btn-brutal", {
        scrollTrigger: {
          trigger: ".legal-pad-container",
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 25,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform,opacity"
      });
    }
  }

  // ==========================================
  // INTERACTIVE TACTILE PHYSICS (GSAP Micro-Interactions)
  // ==========================================
  if (typeof gsap !== 'undefined') {

    // 1. Sticky Notes Paper Wobble & Spring
    const stickyNotes = document.querySelectorAll('.sticky-note');
    stickyNotes.forEach(note => {
      const isTerracotta = note.classList.contains('terracotta');
      const baseRot = isTerracotta ? 3 : -2;

      note.addEventListener('mouseenter', () => {
        gsap.to(note, {
          y: -10,
          rotation: isTerracotta ? 6 : -5,
          scale: 1.03,
          boxShadow: "8px 8px 0px var(--workspace-border)",
          duration: 0.35,
          ease: "back.out(2)"
        });
      });

      note.addEventListener('click', () => {
        gsap.fromTo(note,
          { rotation: baseRot - 8 },
          { rotation: baseRot, duration: 0.6, ease: "elastic.out(1.2, 0.3)" }
        );
      });

      note.addEventListener('mouseleave', () => {
        gsap.to(note, {
          y: 0,
          rotation: baseRot,
          scale: 1,
          boxShadow: "3px 3px 0px var(--workspace-border)",
          duration: 0.4,
          ease: "power2.out"
        });
      });
    });

    // 2. Project Index Cards 3D Interactive Parallax & Wobble
    const workCardWrappers = document.querySelectorAll('.work-card-wrapper');
    workCardWrappers.forEach(wrapper => {
      const card = wrapper.querySelector('.index-card');
      const paperclip = wrapper.querySelector('.paperclip');
      const tapes = wrapper.querySelectorAll('.tape-top-left, .tape-top-right');

      if (card) {
        gsap.set(card, { transformPerspective: 800, transformStyle: "preserve-3d" });
        const cardXTo = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power2.out" });
        const cardYTo = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power2.out" });

        wrapper.addEventListener('mousemove', (e) => {
          const rect = wrapper.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          cardXTo(relX * 6);
          cardYTo(-relY * 6);
        });

        wrapper.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -7,
            boxShadow: "10px 10px 0px var(--workspace-border)",
            duration: 0.32,
            ease: "power2.out"
          });
          if (paperclip) {
            gsap.to(paperclip, {
              rotation: 14,
              y: -5,
              duration: 0.3,
              ease: "back.out(2)"
            });
          }
          if (tapes.length > 0) {
            gsap.to(tapes, {
              y: -3,
              duration: 0.3,
              ease: "power1.out"
            });
          }
        });

        wrapper.addEventListener('mouseleave', () => {
          cardXTo(0);
          cardYTo(0);
          gsap.to(card, {
            y: 0,
            boxShadow: "6px 6px 0px var(--workspace-border)",
            duration: 0.38,
            ease: "power2.out"
          });
          if (paperclip) {
            gsap.to(paperclip, {
              rotation: 5,
              y: 0,
              duration: 0.35,
              ease: "power2.out"
            });
          }
          if (tapes.length > 0) {
            gsap.to(tapes, {
              y: 0,
              duration: 0.35,
              ease: "power2.out"
            });
          }
        });
      }
    });

    // 3. Skill Pills Spring Hover & Click Ripple
    const skillPills = document.querySelectorAll('.skill-pill');
    skillPills.forEach(pill => {
      pill.addEventListener('mouseenter', () => {
        gsap.to(pill, {
          scale: 1.1,
          y: -4,
          boxShadow: "4px 4px 0px var(--workspace-border)",
          backgroundColor: "var(--workspace-accent-light)",
          duration: 0.25,
          ease: "back.out(2.5)"
        });
      });
      pill.addEventListener('mouseleave', () => {
        gsap.to(pill, {
          scale: 1,
          y: 0,
          boxShadow: "2px 2px 0px var(--workspace-border)",
          backgroundColor: "var(--workspace-bg)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
      pill.addEventListener('click', () => {
        gsap.fromTo(pill,
          { scale: 1.2, backgroundColor: "#fef08a" },
          { scale: 1.1, backgroundColor: "var(--workspace-accent-light)", duration: 0.3, ease: "back.out(2)" }
        );
      });
    });

    // 4. Brutal Buttons Interactive Nudge
    const brutalButtons = document.querySelectorAll('.btn-brutal');
    brutalButtons.forEach(btn => {
      const arrow = btn.querySelector('svg');
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          x: -2,
          y: -2,
          boxShadow: "5px 5px 0px var(--workspace-border)",
          duration: 0.2,
          ease: "power2.out"
        });
        if (arrow) {
          gsap.to(arrow, {
            x: 4,
            duration: 0.25,
            ease: "back.out(2)"
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          boxShadow: "3px 3px 0px var(--workspace-border)",
          duration: 0.25,
          ease: "power2.out"
        });
        if (arrow) {
          gsap.to(arrow, {
            x: 0,
            duration: 0.25,
            ease: "power2.out"
          });
        }
      });
    });
  }

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
      tabButtons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const audience = btn.getAttribute('data-audience');
      const message = audienceMessages[audience] || '';

      if (audienceText) {
        if (typeof gsap !== 'undefined') {
          gsap.to(audienceText, {
            opacity: 0,
            y: -5,
            duration: 0.15,
            onComplete: () => {
              audienceText.textContent = message;
              gsap.to(audienceText, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: "power2.out"
              });
            }
          });
        } else {
          audienceText.style.opacity = '0';
          setTimeout(() => {
            audienceText.textContent = message;
            audienceText.style.opacity = '1';
          }, 150);
        }
      }
    });
  });

  // ==========================================
  // PROJECT CASE STUDY MODALS (GSAP Smooth Dialog)
  // ==========================================
  const projectCards = document.querySelectorAll('.index-card:not(.academic-card)');
  const modalOverlays = document.querySelectorAll('.brutal-modal-overlay');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  const openModal = (modal) => {
    if (!modal) return;
    const modalBox = modal.querySelector('.brutal-modal');
    modal.style.display = 'flex';
    
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modal, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      if (modalBox) {
        gsap.fromTo(modalBox, 
          { scale: 0.9, y: 30, opacity: 0 }, 
          { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }
        );
      }
    } else {
      setTimeout(() => modal.classList.add('show'), 10);
    }
    
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    const modalBox = modal.querySelector('.brutal-modal');
    
    if (typeof gsap !== 'undefined') {
      if (modalBox) {
        gsap.to(modalBox, { scale: 0.92, y: 20, opacity: 0, duration: 0.25, ease: "power2.in" });
      }
      gsap.to(modal, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          modal.style.display = 'none';
          document.body.style.overflow = '';
          if (lenis) lenis.start();
        }
      });
    } else {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
      if (lenis) lenis.start();
    }
  };

  // Open Modal
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectKey = card.getAttribute('data-project');
      if (projectKey) {
        const targetModal = document.getElementById(`modal-${projectKey}`);
        openModal(targetModal);
      }
    });
  });

  // Close Modal (Clicking close button)
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.brutal-modal-overlay');
      closeModal(parentModal);
    });
  });

  // Close Modal (Clicking backdrop area)
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Close Modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.brutal-modal-overlay[style*="display: flex"], .brutal-modal-overlay.show');
      if (activeModal) closeModal(activeModal);
    }
  });

  // ==========================================
  // MOBILE NAVIGATION TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // ==========================================
  // SMOOTH ANCHOR NAVIGATION
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ==========================================
  // CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm && toast) {
    const toastText = toast.querySelector('span');
    const toastSvgPath = toast.querySelector('svg path');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalSubmitHtml = submitBtn.innerHTML;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

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
          toast.classList.remove('error');
          if (toastSvgPath) toastSvgPath.setAttribute('d', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z');
          if (toastText) toastText.textContent = 'Message sent! 📌';
          contactForm.reset();
        } else {
          toast.classList.add('error');
          if (toastSvgPath) toastSvgPath.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
          if (toastText) toastText.textContent = data.message || 'Something went wrong. ❌';
        }
      })
      .catch((error) => {
        console.error(error);
        toast.classList.add('error');
        if (toastSvgPath) toastSvgPath.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        if (toastText) toastText.textContent = 'Network error. Please try again. ❌';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalSubmitHtml;

        toast.classList.add('show');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(toast,
            { y: 60, opacity: 0, rotation: 5 },
            { y: 0, opacity: 1, rotation: 2, duration: 0.4, ease: "back.out(2)" }
          );
        }
        setTimeout(() => {
          if (typeof gsap !== 'undefined') {
            gsap.to(toast, {
              y: 60,
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
              onComplete: () => toast.classList.remove('show')
            });
          } else {
            toast.classList.remove('show');
          }
        }, 4000);
      });
    });
  }

  // ==========================================
  // BACK TO TOP
  // ==========================================
  const backToTopBtn = document.getElementById('btn-back-to-top');

  if (backToTopBtn) {
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

    backToTopBtn.style.transition = 'opacity 0.25s, visibility 0.25s, transform 0.25s';
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.visibility = 'hidden';
    backToTopBtn.style.transform = 'translateY(10px)';

    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // ==========================================
  // REFRESH SCROLLTRIGGER AFTER ASSETS LOAD
  // ==========================================
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

});
