/**
 * IndiBlue Solutions LLP — Clean Glassmorphism & Floating Nav Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Fluid Water Bubble Loader Animation
  const sitePreloader = document.getElementById('sitePreloader');
  const waterLiquid = document.getElementById('waterLiquid');
  const waterBubbleLoader = document.querySelector('.water-bubble-loader');

  if (sitePreloader && waterLiquid) {
    // Start filling water smoothly
    setTimeout(() => {
      waterLiquid.style.height = '100%';
    }, 120);

    const finishLoading = () => {
      if (waterBubbleLoader) {
        waterBubbleLoader.classList.add('full');
      }
      setTimeout(() => {
        sitePreloader.classList.add('loaded');
        setTimeout(() => {
          sitePreloader.style.display = 'none';
        }, 550);
      }, 350);
    };

    // Keep active for fluid water flow animation (minimum 1.6s)
    const minAnimationTime = 1600;
    const startTime = Date.now();

    window.addEventListener('load', () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minAnimationTime - elapsed);
      setTimeout(finishLoading, remaining);
    });

    // Fallback safety timeout (maximum 3.5s)
    setTimeout(finishLoading, 3500);
  }

  // 1. Initialize Lenis Smooth Scroll
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
      prevent: (node) => node.hasAttribute?.('data-lenis-prevent') || !!node.closest?.('[data-lenis-prevent]')
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        if (href === '#top') {
          e.preventDefault();
          lenis.scrollTo(0, { duration: 1.2 });
        } else {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -30, duration: 1.2 });
          }
        }
      });
    });
  }

  // Floating Navbar Sticky / Fixed Scroll Position Detection
  const navbarWrapper = document.querySelector('.floating-navbar-wrapper');
  function updateNavbarScroll() {
    const scrollY = window.scrollY || window.pageYOffset || (window.lenis ? window.lenis.scroll : 0) || 0;
    if (navbarWrapper) {
      if (scrollY > 30) {
        navbarWrapper.classList.add('is-scrolled');
      } else {
        navbarWrapper.classList.remove('is-scrolled');
      }
    }
  }

  window.addEventListener('scroll', updateNavbarScroll, { passive: true });
  if (typeof window !== 'undefined' && window.lenis) {
    window.lenis.on('scroll', updateNavbarScroll);
  }
  updateNavbarScroll();

  // Mobile Hamburger Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDropdown = document.getElementById('mobileDropdown');

  if (mobileMenuBtn && mobileDropdown) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDropdown.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
    });

    const mobileLinks = mobileDropdown.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDropdown.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mobileDropdown.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileDropdown.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mobileDropdown.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }

  // Ensure Background Videos Autoplay smoothly
  const bgVideos = document.querySelectorAll('.hero-bg-video, .footer-bg-video');
  bgVideos.forEach(vid => {
    vid.muted = true;
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy handled gracefully
      });
    }
  });

  // Interactive 3D Card Hover Accent Effect (Apple / Coditas Micro-Interactions)
  const interactiveCards = document.querySelectorAll('.expert-card, .product-card, .stat-glass-bento');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Product Catalogue Modal Popup Logic
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalProductImg = document.getElementById('modalProductImg');
  const modalProductTitle = document.getElementById('modalProductTitle');
  const modalProductCategory = document.getElementById('modalProductCategory');
  const modalProductDesc = document.getElementById('modalProductDesc');
  const modalWhatsappLink = document.getElementById('modalWhatsappLink');

  if (productModal && window.PRODUCTS_DATA) {
    const openModal = (product) => {
      if (!product) return;
      modalProductImg.src = product.img;
      modalProductImg.alt = product.title;
      modalProductTitle.textContent = product.title;
      modalProductCategory.textContent = product.category || 'IndiBlue Catalogue';
      modalProductDesc.textContent = product.desc;
      
      const whatsappMsg = encodeURIComponent(`Hello IndiBlue Solutions, I am interested in inquiring about ${product.title} for institutional procurement.`);
      modalWhatsappLink.href = `https://wa.me/919599568356?text=${whatsappMsg}`;

      productModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    };

    const closeModal = () => {
      productModal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };

    // Attach click events to all catalogue cards
    const clickableCards = document.querySelectorAll('.product-item-clickable');
    clickableCards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        if (!isNaN(idx) && window.PRODUCTS_DATA[idx]) {
          openModal(window.PRODUCTS_DATA[idx]);
        }
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    productModal.addEventListener('click', (e) => {
      if (e.target === productModal || e.target.classList.contains('product-modal-container')) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && productModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Certificate Document Fullscreen Lightbox Modal
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalDownload = document.getElementById('certModalDownload');
  const certModalCloseBtn = document.getElementById('certModalCloseBtn');

  if (certModal) {
    const openCertModal = (imgSrc, title, pdfSrc) => {
      if (certModalImg) certModalImg.src = imgSrc;
      if (certModalTitle) certModalTitle.textContent = title;
      if (certModalDownload) certModalDownload.href = pdfSrc;
      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
      
      const scrollPane = certModal.querySelector('.cert-modal-scroll');
      if (scrollPane) scrollPane.scrollTop = 0;
    };

    const closeCertModal = () => {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };

    document.querySelectorAll('.cert-preview-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const img = trigger.getAttribute('data-img');
        const title = trigger.getAttribute('data-title') || 'Official Document Preview';
        const pdf = trigger.getAttribute('data-pdf') || '#';
        if (img) openCertModal(img, title, pdf);
      });
    });

    if (certModalCloseBtn) {
      certModalCloseBtn.addEventListener('click', closeCertModal);
    }

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal || e.target.classList.contains('product-modal-container')) {
        closeCertModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeCertModal();
      }
    });
  }

  // Expert Areas Auto-Scrolling Carousel (3 Cards Visible, 2s Interval, Pause on Hover)
  const expertWrapper = document.getElementById('expertCarouselWrapper');
  const expertTrack = document.getElementById('expertCarouselTrack');
  const expertPrevBtn = document.getElementById('expertPrevBtn');
  const expertNextBtn = document.getElementById('expertNextBtn');
  const expertDotsContainer = document.getElementById('expertCarouselDots');

  if (expertWrapper && expertTrack) {
    const cards = Array.from(expertTrack.querySelectorAll('.expert-carousel-card'));
    let currentIndex = 0;
    let autoPlayTimer = null;
    const intervalTime = 2000; // 2 seconds auto-scroll interval

    const getVisibleCardsCount = () => {
      const width = window.innerWidth;
      if (width <= 640) return 1;
      if (width <= 1024) return 2;
      return 3;
    };

    const getMaxIndex = () => {
      const visible = getVisibleCardsCount();
      return Math.max(0, cards.length - visible);
    };

    const createDots = () => {
      if (!expertDotsContainer) return;
      expertDotsContainer.innerHTML = '';
      const maxIdx = getMaxIndex();
      const dotCount = maxIdx + 1;

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `expert-dot ${i === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(i);
          resetAutoPlay();
        });
        expertDotsContainer.appendChild(dot);
      }
    };

    const updateDots = () => {
      if (!expertDotsContainer) return;
      const dots = expertDotsContainer.querySelectorAll('.expert-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const updateCarousel = (animate = true) => {
      if (!cards.length) return;
      const maxIdx = getMaxIndex();
      if (currentIndex > maxIdx) currentIndex = 0;
      if (currentIndex < 0) currentIndex = maxIdx;

      const card = cards[0];
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;

      // Extract current flex gap between cards
      const trackStyle = window.getComputedStyle(expertTrack);
      const gapValue = parseFloat(trackStyle.gap) || 0;
      const stepDistance = cardWidth + gapValue;
      const offset = currentIndex * stepDistance;

      expertTrack.style.transition = animate ? 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
      expertTrack.style.transform = `translateX(-${offset}px)`;

      updateDots();
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateCarousel(true);
    };

    const nextSlide = () => {
      const maxIdx = getMaxIndex();
      currentIndex = currentIndex >= maxIdx ? 0 : currentIndex + 1;
      updateCarousel(true);
    };

    const prevSlide = () => {
      const maxIdx = getMaxIndex();
      currentIndex = currentIndex <= 0 ? maxIdx : currentIndex - 1;
      updateCarousel(true);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, intervalTime);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
    };

    // Button event listeners
    if (expertNextBtn) {
      expertNextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (expertPrevBtn) {
      expertPrevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Pause auto-scroll when hovered
    expertWrapper.addEventListener('mouseenter', stopAutoPlay);
    expertWrapper.addEventListener('mouseleave', startAutoPlay);
    expertWrapper.addEventListener('pointerenter', stopAutoPlay);
    expertWrapper.addEventListener('pointerleave', startAutoPlay);

    // Pause on focus inside (for accessibility)
    expertWrapper.addEventListener('focusin', stopAutoPlay);
    expertWrapper.addEventListener('focusout', startAutoPlay);

    // Touch & Swipe gestures for mobile / tablets
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    expertTrack.addEventListener('touchstart', (e) => {
      stopAutoPlay();
      touchStartX = e.touches[0].clientX;
      isSwiping = true;
    }, { passive: true });

    expertTrack.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      touchEndX = e.touches[0].clientX;
    }, { passive: true });

    expertTrack.addEventListener('touchend', () => {
      if (!isSwiping) return;
      const swipeThreshold = 45;
      const diff = touchStartX - touchEndX;
      if (touchEndX !== 0 && Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      isSwiping = false;
      touchStartX = 0;
      touchEndX = 0;
      startAutoPlay();
    });

    // Window resize handling (recalculate layout and dots count)
    let resizeDebounce = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        createDots();
        updateCarousel(false);
      }, 150);
    });

    // Initial setup
    createDots();
    updateCarousel(false);
    startAutoPlay();
  }
});



