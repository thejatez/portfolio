// Force scroll to top on refresh/load
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);



  // Fade Up Animation Observer
  const fadeUpElements = document.querySelectorAll('.fade-up');
  const fadeObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, fadeObserverOptions);

  fadeUpElements.forEach((el, index) => {
    // Add slight stagger to fade ups
    el.style.transitionDelay = `${index * 0.05}s`;
    fadeObserver.observe(el);
  });

  // Expandable Sections (See More) Toggle Logic
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);

      if (targetContent) {
        targetContent.classList.toggle('expanded');
        btn.classList.toggle('toggled');

        // Update button text
        const isExpanded = targetContent.classList.contains('expanded');
        btn.innerHTML = `${isExpanded ? 'See less' : 'See more'} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
      }
    });
  });


  // Back to Top Click Handler
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Rotating Role Titles Transition
  const roleElement = document.getElementById('role-text');
  if (roleElement) {
    const roles = [
      "Backend developer",
      "Applied AI Engineer"
    ];
    let roleIndex = 0;
    setInterval(() => {
      roleElement.classList.add('slide-out');
      setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleElement.textContent = roles[roleIndex];
        roleElement.classList.remove('slide-out');
        roleElement.classList.add('slide-in');
        requestAnimationFrame(() => {
          setTimeout(() => {
            roleElement.classList.remove('slide-in');
          }, 20);
        });
      }, 350);
    }, 3200);
  }

  // Interactive Avatar Spin & Toggle on Badge Click
  const avatarBadge = document.querySelector('.avatar-badge');
  const avatarImg = document.querySelector('.avatar');
  if (avatarBadge && avatarImg) {
    const defaultAvatarSrc = 'github-avatar.png';
    const logoAvatarSrc = 'favicon.png';

    // Preload both images for instant transition
    const p1 = new Image(); p1.src = defaultAvatarSrc;
    const p2 = new Image(); p2.src = logoAvatarSrc;

    let rotation = 0;
    let isShowingGitHub = true;

    avatarBadge.addEventListener('click', () => {
      rotation += 360;
      avatarImg.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      avatarImg.style.transform = `rotate(${rotation}deg)`;
      const svg = avatarBadge.querySelector('svg');
      if (svg) {
        svg.style.transition = 'transform 0.6s ease';
        svg.style.transform = `rotate(${rotation}deg)`;
      }

      // Toggle image source halfway through spin
      setTimeout(() => {
        isShowingGitHub = !isShowingGitHub;
        avatarImg.src = isShowingGitHub ? defaultAvatarSrc : logoAvatarSrc;
      }, 250);
    });
  }
});
