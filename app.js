/**
 * IndiBlue Solutions LLP — Clean Glassmorphism & Floating Nav Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDropdown = document.getElementById('mobileDropdown');

  if (mobileMenuBtn && mobileDropdown) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDropdown.classList.toggle('open');
    });

    const mobileLinks = mobileDropdown.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDropdown.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mobileDropdown.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileDropdown.classList.remove('open');
      }
    });
  }

  // Ensure Footer Background Video Autoplays smoothly
  const footerBgVideo = document.querySelector('.footer-bg-video');
  if (footerBgVideo) {
    footerBgVideo.muted = true;
    const playPromise = footerBgVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy handled gracefully
      });
    }
  }
});

