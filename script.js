document.getElementById("year").textContent = new Date().getFullYear();

const animatedBlocks = document.querySelectorAll(
  ".section, .card, .mini-card, .project, .skill-group, .quick-metrics, .contact-strip"
);

animatedBlocks.forEach((el) => el.classList.add("reveal-target"));

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  animatedBlocks.forEach((el) => observer.observe(el));
} else {
  animatedBlocks.forEach((el) => el.classList.add("revealed"));
}
