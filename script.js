// Interactions pour le portfolio

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Apparition progressive des éléments présents dans le HTML
const revealElements = document.querySelectorAll(
  '.hero-intro, .hero h1, .hero-description, .discover, .section-label, ' +
  '.skills-circle, .projects-heading, .project-card, .about-banner, ' +
  '.about-intro, .about-card'
);

revealElements.forEach((element) => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(24px)';
  element.style.transition = 'opacity 700ms ease, transform 700ms ease';
  element.style.willChange = 'opacity, transform';
});

const revealElement = (element) => {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
};

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(revealElement);
}

// Défilement fluide pour les ancres internes
if (!prefersReducedMotion) {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      if (!selector) return;

      const target = document.querySelector(selector);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Effet d'écriture sur l'introduction
const introduction = document.querySelector('.hero-intro');

if (introduction && !prefersReducedMotion) {
  const text = introduction.textContent.trim();
  let index = 0;

  introduction.textContent = '';
  introduction.setAttribute('aria-label', text);

  const type = () => {
    introduction.textContent += text[index] ?? '';
    index += 1;

    if (index < text.length) {
      window.setTimeout(type, 55 + Math.random() * 45);
    }
  };

  window.setTimeout(type, 350);
}

// Effet lumineux qui suit la souris
if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
  const glow = document.createElement('div');

  Object.assign(glow.style, {
    position: 'fixed',
    left: '-200px',
    top: '-200px',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '-1',
    transform: 'translate(-50%, -50%)',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.09), transparent 68%)'
  });

  document.body.appendChild(glow);

  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

// Mise en valeur des cartes au survol
document.querySelectorAll('.project-card, .about-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.transform = `translateY(-4px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// Mise en valeur de la section actuellement visible
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    });
  }, { rootMargin: '-35% 0px -55%' });

  sections.forEach((section) => sectionObserver.observe(section));
}
