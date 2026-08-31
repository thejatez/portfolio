
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-item');
  const navObserverOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => item.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          // Smoothly scroll the pill-nav horizontally to keep the active link in view
          activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    });
  }, navObserverOptions);
  sections.forEach(section => navObserver.observe(section));
  const fadeUpElements = document.querySelectorAll('.fade-up');
  const fadeObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); 
      }
    });
  }, fadeObserverOptions);
  fadeUpElements.forEach(el => fadeObserver.observe(el));
  const typingTextElement = document.getElementById("typing-text");
  if (typingTextElement) {
    const words = [
      "Hanuma Teja",
      "Backend Developer",
      "Full-Stack Developer"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    function typeEffect() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = (wordIndex === 0) ? 4000 : 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500; 
      }
      setTimeout(typeEffect, typingSpeed);
    }
    setTimeout(typeEffect, 2000); 
  }
  const pageLoader = document.getElementById('page-loader');
  const loaderTypingElement = document.getElementById('loader-typing');
  if (pageLoader && loaderTypingElement) {
    const loaderText = "Please don't play with the cat...";
    let i = 0;
    document.body.style.overflow = 'hidden';
    function typeLoader() {
      if (i < loaderText.length) {
        loaderTypingElement.textContent += loaderText.charAt(i);
        i++;
        setTimeout(typeLoader, 80); 
      } else {
        setTimeout(() => {
          pageLoader.style.opacity = '0';
          setTimeout(() => {
            pageLoader.remove();
            document.body.style.overflow = ''; 
          }, 800);
        }, 1200);
      }
    }
    setTimeout(typeLoader, 400);
  }
});
