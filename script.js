(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = $('#site-header');
  const opening = $('.opening');
  const openingTitle = $('#opening-title');
  const printer = $('.printer-section');
  const paper = $('.paper-sheet');
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

  function onScroll() {
    const y = window.scrollY;
    const vh = Math.max(window.innerHeight, 1);

    if (header) header.classList.toggle('visible', y > vh * 0.72);

    if (opening && openingTitle && !reduceMotion) {
      const p = clamp(y / (vh * 0.9));
      openingTitle.style.transform = `translate3d(0,${-p * 38}px,0) scale(${1 - p * 0.12})`;
      openingTitle.style.opacity = String(1 - p * 0.88);
    }

    if (printer && paper && !reduceMotion) {
      const rect = printer.getBoundingClientRect();
      const distance = Math.max(printer.offsetHeight - vh, 1);
      const p = clamp(-rect.top / distance);
      const start = -58;
      const end = 55;
      const yPct = start + (end - start) * p;
      paper.style.transform = `translate3d(-50%,${yPct}%,0)`;
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    }
  }, { passive: true });
  onScroll();

  // Mobile / fullscreen menu
  const menuButton = $('#menu-button');
  const menuPanel = $('#menu-panel');
  function closeMenu() {
    if (!menuPanel || !menuButton) return;
    menuPanel.classList.remove('open');
    menuPanel.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
    document.body.classList.remove('menu-open');
  }
  function openMenu() {
    if (!menuPanel || !menuButton) return;
    menuPanel.classList.add('open');
    menuPanel.setAttribute('aria-hidden', 'false');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.textContent = 'Close';
    document.body.classList.add('menu-open');
  }
  menuButton?.addEventListener('click', () => menuPanel.classList.contains('open') ? closeMenu() : openMenu());
  $$('#menu-panel a').forEach(a => a.addEventListener('click', closeMenu));

  // Reveal project rows as they enter the viewport.
  const rows = $$('.project-row');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.18 });
  rows.forEach(row => io.observe(row));

  const products = {
    'business-cards': {
      number: '01 / Business Cards',
      title: 'Business Cards',
      tagline: 'Small format. Strong first impression.',
      heading: 'From everyday cards to premium pieces worth keeping.',
      description: 'Choose a practical standard stock or push the finish further with lamination, thicker cards, foil and specialty details. Artwork can be supplied or prepared by Dream Studio Print.',
      hero: 'business-cards.webp',
      gallery: ['business-cards-alt.webp', 'branding-alt.webp'],
      specs: ['14 pt standard', '16 pt matte / gloss', '20 pt / 32 pt premium', 'Foil & specialty finishes']
    },
    menus: {
      number: '02 / Menus',
      title: 'Menus',
      tagline: 'Designed to be read, handled and remembered.',
      heading: 'Menus that carry the restaurant brand all the way to the table.',
      description: 'Dine-in menus, takeout menus, folded formats and premium menu presentation. Layout, hierarchy and finishing are built around how the menu will actually be used.',
      hero: 'menus.webp',
      gallery: ['menus-alt.webp', 'branding.webp'],
      specs: ['Dine-in menus', 'Takeout menus', 'Folded & multi-panel', 'Premium menu covers']
    },
    flyers: {
      number: '03 / Flyers & Brochures',
      title: 'Flyers & Brochures',
      tagline: 'Get the message into someone’s hands.',
      heading: 'Promotional print with a clear job to do.',
      description: 'From a single event flyer to multi-panel brochures and promotional handouts, the focus stays on hierarchy, readability and a finish that fits the campaign.',
      hero: 'flyers.webp',
      gallery: ['flyers-alt.webp', 'labels-alt.webp'],
      specs: ['Single-sheet flyers', 'Bi-fold & tri-fold', 'Promotional cards', 'Posters & handouts']
    },
    labels: {
      number: '04 / Stickers & Labels',
      title: 'Stickers & Labels',
      tagline: 'Brand the surface. Keep the identity moving.',
      heading: 'Labels and stickers made for products, packaging and promotion.',
      description: 'Custom shapes, product labels, promotional stickers and branded seals. We can help prepare artwork so the final cut, bleed and finish work cleanly.',
      hero: 'labels.webp',
      gallery: ['labels-alt.webp', 'packaging-alt.webp'],
      specs: ['Die-cut stickers', 'Product labels', 'Roll labels', 'Custom shapes & sizes']
    },
    packaging: {
      number: '05 / Packaging & Bags',
      title: 'Packaging & Bags',
      tagline: 'The brand should still feel like the brand after checkout.',
      heading: 'Packaging that keeps the experience consistent.',
      description: 'Branded bags, boxes, sleeves and supporting printed pieces can be developed as one coordinated system instead of unrelated items.',
      hero: 'packaging.webp',
      gallery: ['packaging-alt.webp', 'branding-alt.webp'],
      specs: ['Paper bags', 'Custom boxes', 'Sleeves & inserts', 'Branded tissue & cards']
    },
    signage: {
      number: '06 / Signage & Large Format',
      title: 'Signage & Large Format',
      tagline: 'Make the message work from across the room — or across the street.',
      heading: 'Large-format pieces built for storefronts, events and promotions.',
      description: 'Roll-up banners, window graphics, decals, vinyl and display pieces that stay readable at scale and hold together with the rest of the brand.',
      hero: 'signage.webp',
      gallery: ['signage-alt.webp', 'flyers.webp'],
      specs: ['Roll-up banners', 'Window graphics', 'Vinyl & decals', 'Event & display graphics']
    },
    branding: {
      number: '07 / Branding',
      title: 'Branding',
      tagline: 'Build the system before you print the pieces.',
      heading: 'A visual direction that can move from screen to print without falling apart.',
      description: 'Logo development, brand refreshes, campaign artwork and print-ready systems. The goal is practical consistency across the things customers actually see.',
      hero: 'branding.webp',
      gallery: ['branding-alt.webp', 'packaging.webp'],
      specs: ['Logo & identity', 'Brand refresh', 'Campaign artwork', 'Print-ready design systems']
    },
    finishes: {
      number: '08 / Premium Finishes',
      title: 'Premium Finishes',
      tagline: 'The details people notice when they pick it up.',
      heading: 'Use finish, texture and weight to make print feel intentional.',
      description: 'Lamination, foil, embossing and heavier stocks can turn a standard printed piece into something that feels more considered and more premium.',
      hero: 'finishes.webp',
      gallery: ['finishes-alt.webp', 'business-cards.webp'],
      specs: ['Matte & gloss lamination', 'Foil options', 'Emboss / deboss', 'Heavy premium stocks']
    }
  };

  const viewer = $('#product-viewer');
  const viewerShell = $('#viewer-shell');
  const closeButton = $('#viewer-close');
  const heroImage = $('#viewer-hero-image');
  const viewerNumber = $('#viewer-number');
  const viewerTitle = $('#viewer-title');
  const viewerTagline = $('#viewer-tagline');
  const viewerHeading = $('#viewer-heading');
  const viewerDescription = $('#viewer-description');
  const viewerSpecs = $('#viewer-specs');
  const gallery1 = $('#viewer-gallery-1');
  const gallery2 = $('#viewer-gallery-2');
  const quoteLink = $('#viewer-quote-link');
  let activeTrigger = null;

  function populateViewer(key) {
    const p = products[key];
    if (!p) return false;
    heroImage.src = p.hero;
    heroImage.alt = `${p.title} showcase`;
    viewerNumber.textContent = p.number;
    viewerTitle.textContent = p.title;
    viewerTagline.textContent = p.tagline;
    viewerHeading.textContent = p.heading;
    viewerDescription.textContent = p.description;
    gallery1.src = p.gallery[0];
    gallery1.alt = `${p.title} sample detail`;
    gallery2.src = p.gallery[1];
    gallery2.alt = `${p.title} alternate sample`;
    viewerSpecs.innerHTML = p.specs.map((s, i) => `<div class="spec-card"><span>0${i + 1}</span><strong>${s}</strong></div>`).join('');
    return true;
  }

  function showViewer(key, pushState = true) {
    if (!populateViewer(key)) return;
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden', 'false');
    viewerShell.scrollTop = 0;
    document.body.classList.add('viewer-open');
    if (pushState) history.pushState({ product: key }, '', `#${key}`);
    setTimeout(() => closeButton.focus(), 80);
  }

  function animateToViewer(card, key) {
    const img = $('img', card);
    if (!img || reduceMotion) {
      showViewer(key);
      return;
    }
    const r = img.getBoundingClientRect();
    const clone = img.cloneNode(true);
    clone.className = 'transition-clone';
    Object.assign(clone.style, {
      top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px`
    });
    document.body.appendChild(clone);
    document.body.classList.add('viewer-open');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      Object.assign(clone.style, { top: '0px', left: '0px', width: '100vw', height: '100vh', borderRadius: '0px' });
    }));
    window.setTimeout(() => {
      showViewer(key);
      clone.style.opacity = '0';
      setTimeout(() => clone.remove(), 200);
    }, 610);
  }

  function closeViewer(updateHistory = true) {
    if (!viewer.classList.contains('open')) return;
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open');
    if (updateHistory && location.hash && products[location.hash.slice(1)]) {
      history.replaceState({}, '', location.pathname + location.search);
    }
    activeTrigger?.focus?.();
    activeTrigger = null;
  }

  $$('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const row = card.closest('.project-row');
      const key = row?.dataset.product;
      if (!key) return;
      activeTrigger = card;
      animateToViewer(card, key);
    });
  });

  closeButton?.addEventListener('click', () => closeViewer());
  quoteLink?.addEventListener('click', e => {
    e.preventDefault();
    closeViewer();
    setTimeout(() => $('#quote')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 100);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (viewer?.classList.contains('open')) closeViewer();
      else if (menuPanel?.classList.contains('open')) closeMenu();
    }
  });
  window.addEventListener('popstate', () => {
    const key = location.hash.slice(1);
    if (products[key]) showViewer(key, false);
    else closeViewer(false);
  });
  const initialKey = location.hash.slice(1);
  if (products[initialKey]) setTimeout(() => showViewer(initialKey, false), 50);

  // Quote form
  const form = $('#quote-form');
  const formStatus = $('#form-status');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const button = $('.submit-button', form);
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.location || !data.service || !data.message) {
      formStatus.textContent = 'Please complete all required fields.';
      return;
    }
    button.disabled = true;
    formStatus.textContent = 'Sending your request…';
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || 'Unable to send the quote request.');
      form.reset();
      formStatus.textContent = 'Thanks — your quote request has been sent.';
    } catch (err) {
      formStatus.textContent = err.message || 'Unable to send right now. Please email dreamstudio194@gmail.com.';
    } finally {
      button.disabled = false;
    }
  });

  // Privacy preferences: once clicked, it stays dismissed on later visits.
  const cookieBanner = $('#cookie-banner');
  const accept = $('#analytics-accept');
  const decline = $('#analytics-decline');
  const storageKey = 'dsp-analytics-choice-v1';

  function safeGetPreference() {
    try { return localStorage.getItem(storageKey); }
    catch {
      try { return sessionStorage.getItem(storageKey); } catch { return null; }
    }
  }
  function safeSetPreference(value) {
    try { localStorage.setItem(storageKey, value); }
    catch {
      try { sessionStorage.setItem(storageKey, value); } catch {}
    }
  }
  function dismissPrivacy(value) {
    safeSetPreference(value);
    cookieBanner.hidden = true;
  }
  if (cookieBanner) {
    cookieBanner.hidden = Boolean(safeGetPreference());
    accept?.addEventListener('click', () => dismissPrivacy('accepted'));
    decline?.addEventListener('click', () => dismissPrivacy('essential'));
  }
})();
