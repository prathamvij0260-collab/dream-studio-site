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

  document.getElementById('year').textContent = new Date().getFullYear();

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
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get('website')) return;
      const subject = `Dream Studio quote request — ${data.get('business') || data.get('name')}`;
      const lines = [
        `Name: ${data.get('name')}`,
        `Business: ${data.get('business') || 'Not provided'}`,
        `Email: ${data.get('email')}`,
        `Phone: ${data.get('phone') || 'Not provided'}`,
        `Location: ${data.get('location')}`,
        `Service: ${data.get('service')}`,
        `Estimated quantity: ${data.get('quantity') || 'Not provided'}`,
        `Preferred timing: ${data.get('timing') || 'Not provided'}`,
        '',
        'Project details:',
        data.get('message'),
        '',
        'Please attach any artwork or reference files to this email before sending.'
      ];
      const href = `mailto:dreamstudio194@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      status.textContent = 'Opening your email app with the quote details prepared…';
      window.location.href = href;
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
})();
