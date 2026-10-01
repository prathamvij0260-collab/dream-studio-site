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
    intro.className = 'intro-scroll intro-scroll-v3';
    intro.setAttribute('aria-label', 'Dream Studio Print introduction');
    intro.innerHTML = `
      <div class="intro-stage intro-stage-v3">
        <div class="intro-brand-scene" aria-label="Dream Studio Print">
          <img class="intro-logo-art" src="logo-mark.png" alt="">
          <div class="intro-brand-name">
            <strong>Dream Studio Print</strong>
            <span>Make it happen.</span>
          </div>
        </div>

        <div class="intro-character" aria-hidden="true">
          <img class="char-frame char-sit" src="person-sit.png" alt="">
          <img class="char-frame char-rise" src="person-rise.png" alt="">
          <img class="char-frame char-stand" src="person-stand.png" alt="">
          <img class="char-frame char-walk-a" src="person-walk-a.png" alt="">
          <img class="char-frame char-walk-b" src="person-walk-b.png" alt="">
        </div>

        <div class="intro-copy intro-copy-v3">
          <p class="eyebrow">Printing · Packaging · Branding</p>
          <p class="intro-title">Make it <span>happen.</span></p>
          <p class="intro-subtitle">From an idea on screen to something people can hold.</p>
        </div>

        <span class="intro-scroll-hint" aria-hidden="true">Scroll to bring it to life <i></i></span>
      </div>`;

    header.before(intro);

    const brandScene = intro.querySelector('.intro-brand-scene');
    const character = intro.querySelector('.intro-character');
    const sit = intro.querySelector('.char-sit');
    const rise = intro.querySelector('.char-rise');
    const stand = intro.querySelector('.char-stand');
    const walkA = intro.querySelector('.char-walk-a');
    const walkB = intro.querySelector('.char-walk-b');
    const copy = intro.querySelector('.intro-copy-v3');
    const hint = intro.querySelector('.intro-scroll-hint');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const range = (p, from, to) => clamp((p - from) / (to - from));
    const fadeWindow = (p, inA, inB, outA, outB) =>
      Math.min(range(p, inA, inB), 1 - range(p, outA, outB));

    let ticking = false;

    const render = () => {
      ticking = false;
      if (reduced.matches) return;

      const rect = intro.getBoundingClientRect();
      const maxScroll = Math.max(1, intro.offsetHeight - window.innerHeight);
      const p = clamp(-rect.top / maxScroll);

      // 1) Full logo holds long enough to register.
      // 2) The exact seated silhouette separates from it.
      const brandFade = range(p, 0.12, 0.29);
      brandScene.style.opacity = String(1 - brandFade);
      brandScene.style.transform = `translate(-50%,-50%) scale(${1 - brandFade * .035})`;

      // Character stays in roughly the same place while standing.
      const standPhase = range(p, 0.14, 0.48);
      const walkPhase = range(p, 0.48, 0.82);
      const startY = window.innerWidth <= 820 ? 3 : 1;
      const standLift = -8 * standPhase;
      const travelX = (window.innerWidth <= 820 ? -34 : -40) * walkPhase;

      character.style.opacity = String(range(p, 0.12, 0.18) * (1 - range(p, .88, .97)));
      character.style.transform =
        `translate3d(calc(-50% + ${travelX}vw), calc(-50% + ${startY + standLift}vh), 0)`;

      // Pose crossfades make the real seated person visibly lean, rise, stand and then walk.
      sit.style.opacity = String(fadeWindow(p, .12, .17, .23, .31));
      rise.style.opacity = String(fadeWindow(p, .23, .30, .35, .43));
      stand.style.opacity = String(fadeWindow(p, .35, .42, .48, .55));

      const walking = range(p, .48, .82);
      if (walking > 0 && walking < 1) {
        const step = (Math.floor(walking * 10) % 2) === 0;
        walkA.style.opacity = step ? '1' : '0';
        walkB.style.opacity = step ? '0' : '1';
      } else {
        walkA.style.opacity = '0';
        walkB.style.opacity = '0';
      }

      // Let the silhouette grow naturally from seated to standing scale.
      const poseScale = .82 + standPhase * .18;
      character.style.setProperty('--character-scale', String(poseScale));

      const copyIn = range(p, .66, .82);
      copy.style.opacity = String(copyIn);
      if (window.innerWidth > 820) {
        copy.style.transform = `translateY(calc(-46% + ${(1 - copyIn) * 24}px))`;
      } else {
        copy.style.transform = `translateY(${(1 - copyIn) * 18}px)`;
      }

      hint.style.opacity = String(1 - range(p, 0, .12));
    };

    const queue = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(render);
    };

    window.addEventListener('scroll', queue, {passive: true});
    window.addEventListener('resize', queue);
    render();

    // Keep the print animation directly after the living-logo sequence.
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

      const paper = range(p, .08, .72);
      const y = -62 + (paper * 88);
      sheet.style.transform = `translate3d(-50%,${y}%,0)`;

      const copyIn = range(p, .05, .25);
      printCopy.style.opacity = String(copyIn);
      printCopy.style.transform = `translateY(${(1 - copyIn) * 24}px)`;

      const headProgress = range(p, .08, .68);
      const headX = -72 + (headProgress * 144);
      printHead.style.transform = `translateX(${headX}%)`;
      printHead.style.opacity = String(headProgress > 0 && headProgress < 1 ? 1 : .25);

      const finishIn = range(p, .73, .91);
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
