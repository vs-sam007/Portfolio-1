/* ==========================================================================
   SAMRADH SRIVASTAVA — PORTFOLIO 2026
   Motion-Primitives Feature Integration Engine
   - AnimatedTabsHover (AnimatedBackground)
   - Apple-Style Floating Dock with Fish-Eye Magnification
   - Matrix TextScramble & TextLoop
   - Interactive TransitionPanelCard
   - Magnetic Cursor Button Physics
   - Precision Animated Number Counters
   - Cross-Platform Performance & Android Touch Optimization
========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. ANIMATED TABS HOVER (AnimatedBackground sliding pill)
  // --------------------------------------------------------------------------
  const navList = document.querySelector('.ul-list');
  const navPill = document.getElementById('nav-sliding-pill');
  const navTabs = document.querySelectorAll('.ul-list li');
  const navLinks = document.querySelectorAll('.ul-list li a');
  const sections = document.querySelectorAll('section');

  function updatePill(targetLi) {
    if (!navPill || !targetLi || !navList) return;
    const navRect = navList.getBoundingClientRect();
    const liRect = targetLi.getBoundingClientRect();

    const left = liRect.left - navRect.left;
    const width = liRect.width;

    navPill.style.transform = `translateX(${left}px)`;
    navPill.style.width = `${width}px`;
    navPill.style.opacity = '1';
  }

  function getActiveTab() {
    return document.querySelector('.ul-list li.active') || navTabs[0];
  }

  // Initialize pill position
  if (navTabs.length && navPill) {
    setTimeout(() => {
      const active = getActiveTab();
      if (active) updatePill(active);
    }, 150);

    navTabs.forEach(li => {
      li.addEventListener('mouseenter', () => updatePill(li));
    });

    navList.addEventListener('mouseleave', () => {
      const active = getActiveTab();
      if (active) updatePill(active);
    });
  }

  // Smooth scroll and active state on header click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      window.scrollTo({
        top: targetSection.offsetTop - 75,
        behavior: 'smooth'
      });

      navTabs.forEach(l => l.classList.remove('active'));
      link.parentElement.classList.add('active');
      updatePill(link.parentElement);
      updateDockActive(targetId);
    });
  });

  // --------------------------------------------------------------------------
  // 2. APPLE-STYLE FLOATING DOCK (Motion-Primitives Dock)
  // --------------------------------------------------------------------------
  const dock = document.getElementById('apple-dock');
  const dockItems = document.querySelectorAll('.dock-item');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function updateDockActive(sectionId) {
    dockItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === `#${sectionId}`) {
        item.classList.add('active');
      } else if (href && href.startsWith('#')) {
        item.classList.remove('active');
      }
    });
  }

  // Desktop Fish-Eye Magnification on Hover
  if (dock && !isTouchDevice) {
    const maxScale = 1.45;
    const distanceThreshold = 140;

    dock.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;

      dockItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const dist = Math.abs(mouseX - itemCenterX);

        if (dist < distanceThreshold) {
          const factor = Math.cos((dist / distanceThreshold) * (Math.PI / 2));
          const scale = 1 + (maxScale - 1) * factor;
          item.style.transform = `scale(${scale}) translateY(-${(scale - 1) * 14}px)`;
        } else {
          item.style.transform = 'scale(1) translateY(0px)';
        }
      });
    });

    dock.addEventListener('mouseleave', () => {
      dockItems.forEach(item => {
        item.style.transform = 'scale(1) translateY(0px)';
      });
    });
  }

  // Mobile Menu Trigger Logic
  const dockTrigger = document.getElementById('dock-mobile-trigger');
  const dockTriggerIcon = document.getElementById('dock-trigger-icon');

  if (dockTrigger && dock) {
    dockTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dock.classList.toggle('mobile-open');
      dockTrigger.classList.toggle('active', isOpen);
      if (dockTriggerIcon) {
        dockTriggerIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close menu when tapping anywhere outside
    document.addEventListener('click', (e) => {
      if (dock.classList.contains('mobile-open') && !dock.contains(e.target) && !dockTrigger.contains(e.target)) {
        dock.classList.remove('mobile-open');
        dockTrigger.classList.remove('active');
        if (dockTriggerIcon) dockTriggerIcon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when scrolling
    window.addEventListener('scroll', () => {
      if (dock.classList.contains('mobile-open')) {
        dock.classList.remove('mobile-open');
        dockTrigger.classList.remove('active');
        if (dockTriggerIcon) dockTriggerIcon.className = 'fa-solid fa-bars';
      }
    }, { passive: true });
  }

  // Dock item click navigation
  dockItems.forEach(item => {
    item.addEventListener('click', e => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 75,
            behavior: 'smooth'
          });

          updateDockActive(targetId);

          // Close mobile menu if open
          if (dock && dock.classList.contains('mobile-open')) {
            dock.classList.remove('mobile-open');
            if (dockTrigger) dockTrigger.classList.remove('active');
            if (dockTriggerIcon) dockTriggerIcon.className = 'fa-solid fa-bars';
          }

          // Sync with header nav
          const activeNav = document.querySelector(`.ul-list li a[href="#${targetId}"]`);
          if (activeNav) {
            navTabs.forEach(l => l.classList.remove('active'));
            activeNav.parentElement.classList.add('active');
            updatePill(activeNav.parentElement);
          }
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. SCROLL SPY (Header Nav & Dock Sync + Back-to-Top)
  // --------------------------------------------------------------------------
  const backToTop = document.createElement('div');
  backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  backToTop.id = "back-to-top";
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTop);

  backToTop.style.cssText = `
    position: fixed;
    bottom: 96px;
    right: 28px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
  `;

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backToTop.addEventListener('mouseenter', () => backToTop.style.transform = 'scale(1.15) translateY(-3px)');
  backToTop.addEventListener('mouseleave', () => backToTop.style.transform = 'scale(1) translateY(0)');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const id = section.id;
        // Update header
        const activeLink = document.querySelector(`.ul-list li a[href="#${id}"]`);
        if (activeLink) {
          navTabs.forEach(l => l.classList.remove('active'));
          activeLink.parentElement.classList.add('active');
          updatePill(activeLink.parentElement);
        }
        // Update dock
        updateDockActive(id);
      }
    });

    if (window.scrollY > 450) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  });

  // --------------------------------------------------------------------------
  // 4. MATRIX TEXT SCRAMBLE (Motion-Primitives TextScramble)
  // --------------------------------------------------------------------------
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________010101';
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise(resolve => this.resolve = resolve);
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20);
        this.queue.push({ from, to, start, end });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = '';
      let complete = 0;

      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span style="color: var(--accent-cyan);">${char}</span>`;
        } else {
          output += from;
        }
      }

      this.el.innerHTML = output;

      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  const scrambleEl = document.querySelector('.scramble-text');
  if (scrambleEl) {
    const fx = new TextScramble(scrambleEl);
    const phrases = [
      "Full Stack Developer",
      "SEO • AEO • GEO Specialist",
      "AI Workflow Architect",
      "Growth Systems Engineer",
      "Creative Technologist"
    ];
    let counter = 0;

    const nextPhrase = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(nextPhrase, 2600);
      });
      counter = (counter + 1) % phrases.length;
    };

    setTimeout(nextPhrase, 1200);
  }

  // --------------------------------------------------------------------------
  // 5. MAGNETIC BUTTONS (Motion-Primitives Magnetic)
  // --------------------------------------------------------------------------
  if (!isTouchDevice) {
    const magneticElements = document.querySelectorAll('.magnetic, [data-magnetic]');

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.35;
        const deltaY = (e.clientY - centerY) * 0.35;

        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. INTERACTIVE TRANSITION PANEL (Motion-Primitives TransitionPanel)
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll('.transition-slide');
  const dotBtns = document.querySelectorAll('.dot-btn');
  const prevBtn = document.getElementById('panel-prev-btn');
  const nextBtn = document.getElementById('panel-next-btn');
  let currentSlide = 0;
  let isTransitioning = false;

  function showSlide(index, direction = 1) {
    if (!slides.length || isTransitioning) return;
    const targetIndex = (index + slides.length) % slides.length;
    if (targetIndex === currentSlide) return;

    isTransitioning = true;
    const prevSlide = slides[currentSlide];
    const nextSlide = slides[targetIndex];

    // Pre-position incoming slide without transition
    nextSlide.style.transition = 'none';
    nextSlide.className = `transition-slide ${direction > 0 ? 'exit-right' : 'exit-left'}`;
    nextSlide.style.visibility = 'visible';

    // Force browser reflow to register starting transform
    void nextSlide.offsetWidth;

    // Restore CSS transitions
    nextSlide.style.transition = '';
    prevSlide.style.transition = '';

    // Animate previous slide out & next slide in simultaneously
    prevSlide.className = `transition-slide ${direction > 0 ? 'exit-left' : 'exit-right'}`;
    nextSlide.className = 'transition-slide active';

    currentSlide = targetIndex;

    dotBtns.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });

    setTimeout(() => {
      slides.forEach((s, idx) => {
        if (idx !== currentSlide) {
          s.style.visibility = 'hidden';
        }
      });
      isTransitioning = false;
    }, 380);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1, -1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1, 1));

    dotBtns.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-index'));
        if (targetIndex !== currentSlide) {
          showSlide(targetIndex, targetIndex > currentSlide ? 1 : -1);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. PRECISION ANIMATED NUMBERS (Motion-Primitives AnimatedNumber)
  // --------------------------------------------------------------------------
  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endVal = parseInt(target.getAttribute('data-target'));
        const duration = 2200; // ms
        const startTime = performance.now();

        function easeOutExpo(x) {
          return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        }

        function updateNumber(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentNumber = Math.floor(easeOutExpo(progress) * endVal);

          target.innerText = currentNumber;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            target.innerText = endVal;
          }
        }

        requestAnimationFrame(updateNumber);
        metricObserver.unobserve(target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.metric-num').forEach(num => {
    metricObserver.observe(num);
  });

  // --------------------------------------------------------------------------
  // 8. CUSTOM NEON GLOW CURSOR (Desktop only)
  // --------------------------------------------------------------------------
  const cursorDot = document.querySelector("[data-cursor-dot]");
  const cursorOutline = document.querySelector("[data-cursor-outline]");

  if (!isTouchDevice && cursorDot && cursorOutline) {
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 400, fill: "forwards" });
    });

    document.querySelectorAll("a, button, .project-card, .service-card, .c1, .tech-card, .seo-card, .metric-card, .timeline-content, .dock-item").forEach(el => {
      el.addEventListener("mouseenter", () => cursorOutline.style.transform = "translate(-50%, -50%) scale(1.4)");
      el.addEventListener("mouseleave", () => cursorOutline.style.transform = "translate(-50%, -50%) scale(1)");
    });
  }

  // --------------------------------------------------------------------------
  // 9. PRELOADER ANIMATION SEQUENCE
  // --------------------------------------------------------------------------
  const loadingText = document.getElementById("loading-text");
  const mainIcon = document.querySelector(".main-icon");
  const subIcons = document.querySelectorAll(".sub-icons i");
  const designerText = document.getElementById("designer-text");
  const mainPage = document.getElementById("main-page");
  const loadingScreen = document.getElementById("loading-screen");

  function showElement(element, delay = 0) {
    if (!element) return;
    setTimeout(() => {
      element.classList.remove("hidden");
      element.classList.add("fall");
    }, delay);
  }

  if (loadingScreen) {
    showElement(loadingText, 0);
    showElement(mainIcon, 600);
    subIcons.forEach((icon, idx) => {
      showElement(icon, 1200 + idx * 300);
    });
    showElement(designerText, 2200);

    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => loadingScreen.style.display = 'none', 500);
      if (mainPage) mainPage.classList.add("visible");
      // Reveal dock buttons ONLY AFTER intro sequence finishes
      const dockContainer = document.getElementById('dock-container');
      if (dockContainer) {
        setTimeout(() => dockContainer.classList.add("visible"), 400);
      }
    }, 3200);
  } else {
    const dockContainer = document.getElementById('dock-container');
    if (dockContainer) dockContainer.classList.add("visible");
  }

  // --------------------------------------------------------------------------
  // 10. REDIRECTION CONFIRMATION MODAL & CONTACT FORM
  // --------------------------------------------------------------------------
  const redirectModal = document.getElementById('redirect-modal');
  const modalClose = document.getElementById('modal-close');
  const optWhatsapp = document.getElementById('modal-opt-whatsapp');
  const optLinkedin = document.getElementById('modal-opt-linkedin');
  const contactForm = document.getElementById('contact-form');
  const modalDescription = document.getElementById('modal-description');

  let isFormSubmission = false;
  let formData = { name: '', email: '', message: '' };

  // Intercept contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      isFormSubmission = true;
      formData.name = contactForm.elements['user_name'].value;
      formData.email = contactForm.elements['user_email'].value;
      formData.message = contactForm.elements['message'].value;

      if (modalDescription) {
        modalDescription.innerText = `Hi ${formData.name}! Would you like to send this message to Samradh directly via WhatsApp or connect on LinkedIn?`;
      }
      if (redirectModal) redirectModal.classList.add('active');
    });
  }

  // Intercept "Book a Call" or "Connect" buttons
  const bookCallButtons = document.querySelectorAll('.btn-home2');
  bookCallButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      isFormSubmission = false;
      if (modalDescription) {
        modalDescription.innerText = "Would you like to connect with Samradh via WhatsApp or LinkedIn to schedule your call?";
      }
      if (redirectModal) redirectModal.classList.add('active');
    });
  });

  // Close modal triggers
  if (modalClose && redirectModal) {
    modalClose.addEventListener('click', () => {
      redirectModal.classList.remove('active');
    });
  }

  if (redirectModal) {
    redirectModal.addEventListener('click', (e) => {
      if (e.target === redirectModal) {
        redirectModal.classList.remove('active');
      }
    });
  }

  // Handle Platform Redirect Actions
  const baseNum = "9454201939"; // Samradh's WhatsApp number

  if (optWhatsapp) {
    optWhatsapp.addEventListener('click', () => {
      let url = '';
      if (isFormSubmission) {
        const text = `Hi Samradh, my name is ${formData.name} (${formData.email}). ${formData.message}`;
        url = `https://wa.me/${baseNum}?text=${encodeURIComponent(text)}`;
      } else {
        url = `https://wa.me/${baseNum}?text=${encodeURIComponent("Hi Samradh, I saw your portfolio and would like to connect to schedule a call!")}`;
      }
      window.open(url, '_blank');
      if (redirectModal) redirectModal.classList.remove('active');
      if (isFormSubmission && contactForm) contactForm.reset();
    });
  }

  if (optLinkedin) {
    optLinkedin.addEventListener('click', () => {
      const linkedinUrl = "https://www.linkedin.com/in/samradh-vikram-srivastava-485b0631b";
      window.open(linkedinUrl, '_blank');
      if (redirectModal) redirectModal.classList.remove('active');
      if (isFormSubmission && contactForm) contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 11. AOS & VANILLA TILT INITIALIZATION
  // --------------------------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    document.querySelectorAll('.home-container').forEach(el => { el.setAttribute('data-aos', 'fade-in'); el.setAttribute('data-aos-duration', '1200'); });
    document.querySelectorAll('.about-container').forEach(el => { el.setAttribute('data-aos', 'fade-up'); el.setAttribute('data-aos-duration', '1000'); });
    document.querySelectorAll('.project-card').forEach((el, index) => { el.setAttribute('data-aos', 'fade-up'); el.setAttribute('data-aos-delay', (index * 80).toString()); });
    document.querySelectorAll('.service-card').forEach((el, index) => { el.setAttribute('data-aos', 'fade-up'); el.setAttribute('data-aos-delay', (index * 80).toString()); });
    document.querySelectorAll('.contact-info').forEach(el => { el.setAttribute('data-aos', 'fade-right'); el.setAttribute('data-aos-duration', '1000'); });
    document.querySelectorAll('.contact-form').forEach(el => { el.setAttribute('data-aos', 'fade-left'); el.setAttribute('data-aos-duration', '1000'); });
    document.querySelectorAll('.c1').forEach((el, index) => { el.setAttribute('data-aos', 'zoom-in-up'); el.setAttribute('data-aos-delay', (index * 120).toString()); });

    AOS.init({
      once: true,
      offset: 80,
    });
  }

  if (typeof VanillaTilt !== 'undefined' && !isTouchDevice) {
    VanillaTilt.init(document.querySelectorAll(".project-card, .service-card, .c1, .tech-card, .seo-card, .metric-card, .timeline-content, .exploring-card"), {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
    });
  }

});
