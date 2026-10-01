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
        status.textContent = 'Thanks — your quote request was sent to Dream Studio Print. We’ll get back to you as soon as possible.';
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

(() => {
  const brandReplace = (value) =>
    typeof value === 'string' ? value.replace(/Dream Studio(?! Print)/g, 'Dream Studio Print') : value;

  document.title = brandReplace(document.title);

  document.querySelectorAll('meta[name="description"],meta[property="og:title"],meta[property="og:description"]').forEach(meta => {
    meta.content = brandReplace(meta.content);
  });

  document.querySelectorAll('[aria-label],[alt],[title]').forEach(el => {
    for (const attr of ['aria-label', 'alt', 'title']) {
      if (el.hasAttribute(attr)) el.setAttribute(attr, brandReplace(el.getAttribute(attr)));
    }
  });

  const walkerText = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walkerText.nextNode()) textNodes.push(walkerText.currentNode);
  textNodes.forEach(node => {
    if (node.parentElement && !['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) {
      node.nodeValue = brandReplace(node.nodeValue);
    }
  });

  document.querySelectorAll('script[type="application/ld+json"]').forEach(node => {
    node.textContent = brandReplace(node.textContent);
  });

  document.querySelectorAll('.brand img').forEach(img => img.remove());
  document.querySelectorAll('.brand span').forEach(span => span.textContent = 'Dream Studio Print');

  const aboutLogo = document.querySelector('.about-logo');
  if (aboutLogo) {
    aboutLogo.innerHTML = `
      <div class="about-brand-card">
        <span class="about-brand-kicker">Dream Studio Print</span>
        <strong>Ideas made<br>visible.</strong>
        <span>Printing · Packaging · Branding</span>
      </div>`;
  }

  const isHome = document.querySelector('.hero') && document.querySelector('#work');
  if (!isHome) return;

  if (!document.querySelector('link[href="experience.css"],link[data-ds-experience]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'experience.css';
    stylesheet.dataset.dsExperience = 'true';
    document.head.appendChild(stylesheet);
  }

  const icon = `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z"/>
      <path d="M8.2 8.1c.3 4.2 3.5 7.2 7.7 7.6"/>
      <path d="M8.4 8.2l1.5-.7 1.2 2.3-1.1.9"/>
      <path d="M13.5 14l.9-1.1 2.3 1.2-.6 1.5"/>
    </svg>`;

  const whatsappUrl =
    'https://wa.me/14383379508?text=' +
    encodeURIComponent("Hi Dream Studio Print, I'd like to discuss a printing project.");

  const header = document.querySelector('.site-header');

  if (header && !document.querySelector('.intro-scroll')) {
    const intro = document.createElement('section');
    intro.className = 'intro-scroll';
    intro.setAttribute('aria-label', 'Dream Studio Print introduction');
    intro.innerHTML = `
      <div class="intro-stage">
        <div class="intro-orbit intro-orbit-a" aria-hidden="true"></div>
        <div class="intro-orbit intro-orbit-b" aria-hidden="true"></div>

        <div class="intro-logo" aria-label="Dream Studio Print">
          <img src="favicon.png" alt="">
          <div class="intro-wordmark">
            <strong>Dream Studio</strong>
            <span>Print</span>
          </div>
        </div>

        <div class="intro-walker" aria-hidden="true">
          <svg viewBox="0 0 120 160">
            <g class="walker-body" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="61" cy="26" r="13" fill="currentColor" stroke="none"/>
              <path d="M60 45 58 93"/>
              <path class="arm-a" d="M58 57 29 78"/>
              <path class="arm-b" d="M60 58 91 72"/>
              <path class="leg-a" d="M58 92 36 139"/>
              <path class="leg-b" d="M58 92 83 137"/>
            </g>
          </svg>
        </div>

        <div class="intro-copy">
          <p class="eyebrow">Printing · Packaging · Branding</p>
          <p class="intro-title">Make it <span>happen.</span></p>
          <p class="intro-subtitle">Ideas move. We turn them into something people can hold, see and remember.</p>
        </div>

        <span class="intro-scroll-hint" aria-hidden="true">Scroll to explore <i></i></span>
      </div>`;

    header.before(intro);

    const logo = intro.querySelector('.intro-logo');
    const walker = intro.querySelector('.intro-walker');
    const copy = intro.querySelector('.intro-copy');
    const hint = intro.querySelector('.intro-scroll-hint');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    let ticking = false;

    const render = () => {
      ticking = false;
      if (reduced.matches) return;

      const rect = intro.getBoundingClientRect();
      const maxScroll = Math.max(1, intro.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / maxScroll);

      const logoExit = clamp((progress - 0.12) / 0.34);
      const logoScale = 1 - (0.18 * logoExit);
      logo.style.opacity = String(1 - logoExit);
      logo.style.transform = `translate(-50%,-50%) scale(${logoScale})`;

      const walk = clamp((progress - 0.28) / 0.48);
      const walkerFade = clamp((progress - 0.22) / 0.12);
      const moveVw = (window.innerWidth <= 820 ? -31 : -36) * walk;
      walker.style.opacity = String(walkerFade);
      walker.style.transform = `translate3d(calc(-50% + ${moveVw}vw),0,0)`;
      walker.classList.toggle('is-walking', walk > 0.02 && walk < 0.98);

      const copyIn = clamp((progress - 0.56) / 0.22);
      copy.style.opacity = String(copyIn);
      if (window.innerWidth > 820) {
        copy.style.transform = `translateY(calc(-42% + ${(1 - copyIn) * 22}px))`;
      } else {
        copy.style.transform = `translateY(${(1 - copyIn) * 18}px)`;
      }

      hint.style.opacity = String(1 - clamp(progress / 0.18));
    };

    const queue = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(render);
    };

    window.addEventListener('scroll', queue, {passive: true});
    window.addEventListener('resize', queue);
    render();

    const printScene = document.createElement('section');
    printScene.className = 'print-scroll';
    printScene.setAttribute('aria-label', 'Print production animation');
    printScene.innerHTML = `
      <div class="print-stage">
        <div class="print-copy">
          <p class="eyebrow">From screen to print</p>
          <h2>Watch the idea<br>come off the press.</h2>
        </div>

        <div class="printer-wrap" aria-hidden="true">
          <div class="printer-back"></div>
          <div class="printer-sheet">
            <div class="sheet-inner">
              <span class="sheet-small">DREAM STUDIO PRINT</span>
              <strong>MAKE IT<br>HAPPEN.</strong>
              <div class="sheet-spectrum"></div>
              <p>PRINTING · PACKAGING · BRANDING</p>
              <div class="sheet-grid">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <div class="printer-body">
            <div class="printer-name">DREAM STUDIO PRINT</div>
            <div class="printer-panel"><i></i><i></i><i></i></div>
            <div class="printer-slot"></div>
            <div class="print-head"></div>
          </div>
          <div class="printer-stand"><i></i><i></i></div>
        </div>

        <p class="print-finish">Designed. Printed. Finished.</p>
      </div>`;
    intro.after(printScene);

    const sheet = printScene.querySelector('.printer-sheet');
    const printHead = printScene.querySelector('.print-head');
    const printCopy = printScene.querySelector('.print-copy');
    const printFinish = printScene.querySelector('.print-finish');
    let printTicking = false;

    const renderPrint = () => {
      printTicking = false;
      if (reduced.matches) return;

      const rect = printScene.getBoundingClientRect();
      const maxScroll = Math.max(1, printScene.offsetHeight - window.innerHeight);
      const p = clamp(-rect.top / maxScroll);

      const paper = clamp((p - 0.08) / 0.64);
      const y = -62 + (paper * 88);
      sheet.style.transform = `translate3d(-50%,${y}%,0)`;

      const copyIn = clamp((p - 0.05) / 0.20);
      printCopy.style.opacity = String(copyIn);
      printCopy.style.transform = `translateY(${(1 - copyIn) * 24}px)`;

      const headProgress = clamp((p - 0.08) / 0.60);
      const headX = -72 + (headProgress * 144);
      printHead.style.transform = `translateX(${headX}%)`;
      printHead.style.opacity = String(headProgress > 0 && headProgress < 1 ? 1 : .25);

      const finishIn = clamp((p - 0.73) / 0.18);
      printFinish.style.opacity = String(finishIn);
      printFinish.style.transform = `translateY(${(1 - finishIn) * 16}px)`;
    };

    const queuePrint = () => {
      if (printTicking) return;
      printTicking = true;
      requestAnimationFrame(renderPrint);
    };

    window.addEventListener('scroll', queuePrint, {passive:true});
    window.addEventListener('resize', queuePrint);
    renderPrint();
  }

  if (!document.querySelector('.whatsapp-float')) {
    const floating = document.createElement('a');
    floating.className = 'whatsapp-float';
    floating.href = whatsappUrl;
    floating.target = '_blank';
    floating.rel = 'noopener noreferrer';
    floating.setAttribute('aria-label', 'Message Dream Studio Print on WhatsApp');
    floating.innerHTML = `${icon}<span>WhatsApp</span>`;
    document.body.appendChild(floating);
  }

  const contactStack = document.querySelector('.quote-copy .contact-stack');
  if (contactStack && !document.querySelector('.whatsapp-quote')) {
    const quoteWhatsApp = document.createElement('a');
    quoteWhatsApp.className = 'whatsapp-quote';
    quoteWhatsApp.href = whatsappUrl;
    quoteWhatsApp.target = '_blank';
    quoteWhatsApp.rel = 'noopener noreferrer';
    quoteWhatsApp.innerHTML = `${icon}<span>Message us on WhatsApp</span>`;
    contactStack.after(quoteWhatsApp);
  }
})();
