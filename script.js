(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  const form = document.getElementById('quote-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const button = form.querySelector('button[type="submit"]');
      const data = Object.fromEntries(new FormData(form).entries());
      if (data.website) return;

      button.disabled = true;
      button.textContent = 'Sending…';
      status.textContent = 'Sending your quote request securely…';

      try {
        const response = await fetch('/api/quote', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Unable to send your request.');

        form.reset();
        status.textContent = 'Thanks — your quote request was sent to Dream Studio. We’ll get back to you as soon as possible.';
      } catch (error) {
        status.textContent = 'We could not send the form right now. Please email dreamstudio194@gmail.com or call 438-337-9508.';
      } finally {
        button.disabled = false;
        button.textContent = 'Send Quote Request';
      }
    });
  }

  const banner = document.getElementById('cookie-banner');
  const accepted = localStorage.getItem('dreamstudio_analytics');
  const loadAnalytics = () => {
    if (document.querySelector('script[data-ds-analytics]')) return;
    const script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    script.setAttribute('data-ds-analytics', 'true');
    document.head.appendChild(script);
  };
  if (banner) {
    if (!accepted) {
      banner.hidden = false;
    } else if (accepted === 'yes') {
      loadAnalytics();
    }
    document.getElementById('analytics-accept')?.addEventListener('click', () => {
      localStorage.setItem('dreamstudio_analytics', 'yes');
      banner.hidden = true;
      loadAnalytics();
    });
    document.getElementById('analytics-decline')?.addEventListener('click', () => {
      localStorage.setItem('dreamstudio_analytics', 'no');
      banner.hidden = true;
    });
  }
})();
