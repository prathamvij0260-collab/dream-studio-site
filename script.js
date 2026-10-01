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
    const smoothstep = (t) => {
      t = clamp(t);
      return t * t * (3 - 2 * t);
    };
    const easeInOutCubic = (t) => {
      t = clamp(t);
      return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    let targetIntroProgress = 0;
    let currentIntroProgress = 0;
    let introAnimating = false;

    const readIntroProgress = () => {
      const rect = intro.getBoundingClientRect();
      const maxScroll = Math.max(1, intro.offsetHeight - window.innerHeight);
      targetIntroProgress = clamp(-rect.top / maxScroll);
    };

    const paintIntro = (p) => {
      // Keep the complete logo on screen first, then fade it gradually.
      const brandFade = smoothstep(range(p, .13, .34));
      brandScene.style.opacity = String(1 - brandFade);
      brandScene.style.transform =
        `translate3d(-50%,-50%,0) scale(${1 - brandFade * .025})`;

      // Stand first, then walk. The two motions never fight each other.
      const standRaw = range(p, .15, .50);
      const standPhase = easeInOutCubic(standRaw);
      const walkRaw = range(p, .50, .86);
      const walkPhase = easeInOutCubic(walkRaw);

      const startY = window.innerWidth <= 820 ? 3 : 1;
      const standLift = -8 * standPhase;
      const walkBob = walkRaw > 0 && walkRaw < 1
        ? Math.sin(walkRaw * Math.PI * 8) * .45
        : 0;
      const travelX = (window.innerWidth <= 820 ? -34 : -40) * walkPhase;

      const charIn = smoothstep(range(p, .11, .19));
      const charOut = smoothstep(range(p, .89, .98));
      character.style.opacity = String(charIn * (1 - charOut));
      character.style.transform =
        `translate3d(calc(-50% + ${travelX}vw), calc(-50% + ${startY + standLift + walkBob}vh), 0)`;

      // Continuous pose blending — no hard frame switching.
      sit.style.opacity = '0';
      rise.style.opacity = '0';
      stand.style.opacity = '0';
      walkA.style.opacity = '0';
      walkB.style.opacity = '0';

      if (p < .24) {
        sit.style.opacity = '1';
      } else if (p < .36) {
        const t = smoothstep(range(p, .24, .36));
        sit.style.opacity = String(1 - t);
        rise.style.opacity = String(t);
      } else if (p < .49) {
        const t = smoothstep(range(p, .36, .49));
        rise.style.opacity = String(1 - t);
        stand.style.opacity = String(t);
      } else if (p < .54) {
        const t = smoothstep(range(p, .49, .54));
        stand.style.opacity = String(1 - t);
        walkA.style.opacity = String(t);
      } else if (p < .88) {
        const walking = range(p, .54, .88);
        // Sine blend keeps one walking frame flowing into the next.
        const blend = .5 - .5 * Math.cos(walking * Math.PI * 8);
        walkA.style.opacity = String(1 - blend);
        walkB.style.opacity = String(blend);
      } else {
        walkB.style.opacity = '1';
      }

      // Gradual scale change keeps the body from popping between pose sizes.
      const poseScale = .82 + standPhase * .18;
      character.style.setProperty('--character-scale', String(poseScale));

      const copyIn = smoothstep(range(p, .68, .86));
      copy.style.opacity = String(copyIn);
      if (window.innerWidth > 820) {
        copy.style.transform = `translate3d(0,calc(-46% + ${(1 - copyIn) * 22}px),0)`;
      } else {
        copy.style.transform = `translate3d(0,${(1 - copyIn) * 16}px,0)`;
      }

      hint.style.opacity = String(1 - smoothstep(range(p, 0, .13)));
    };

    const animateIntro = () => {
      if (reduced.matches) {
        introAnimating = false;
        return;
      }

      // Damp the scroll input. This removes mouse-wheel/trackpad jumps.
      currentIntroProgress += (targetIntroProgress - currentIntroProgress) * .10;

      if (Math.abs(targetIntroProgress - currentIntroProgress) < .00035) {
        currentIntroProgress = targetIntroProgress;
      }

      paintIntro(currentIntroProgress);

      if (currentIntroProgress !== targetIntroProgress) {
        requestAnimationFrame(animateIntro);
      } else {
        introAnimating = false;
      }
    };

    const queueIntro = () => {
      readIntroProgress();
      if (!introAnimating) {
        introAnimating = true;
        requestAnimationFrame(animateIntro);
      }
    };

    window.addEventListener('scroll', queueIntro, {passive:true});
    window.addEventListener('resize', queueIntro);
    readIntroProgress();
    currentIntroProgress = targetIntroProgress;
    paintIntro(currentIntroProgress);

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

    let targetPrintProgress = 0;
    let currentPrintProgress = 0;
    let printAnimating = false;

    const readPrintProgress = () => {
      const rect = printScene.getBoundingClientRect();
      const maxScroll = Math.max(1, printScene.offsetHeight - window.innerHeight);
      targetPrintProgress = clamp(-rect.top / maxScroll);
    };

    const paintPrint = (p) => {
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

      // Finish text only arrives once the sheet is almost fully printed.
      const finishIn = range(p, .84, .96);
      printFinish.style.opacity = String(finishIn);

      if (window.innerWidth > 820) {
        printFinish.style.transform = `translateY(${(1 - finishIn) * 10}px)`;
      }
    };

    const animatePrint = () => {
      if (reduced.matches) {
        printAnimating = false;
        return;
      }

      // Gentle damping makes mouse-wheel/trackpad scroll feel continuous.
      currentPrintProgress += (targetPrintProgress - currentPrintProgress) * .16;

      if (Math.abs(targetPrintProgress - currentPrintProgress) < .0006) {
        currentPrintProgress = targetPrintProgress;
      }

      paintPrint(currentPrintProgress);

      if (currentPrintProgress !== targetPrintProgress) {
        requestAnimationFrame(animatePrint);
      } else {
        printAnimating = false;
      }
    };

    const queuePrint = () => {
      readPrintProgress();
      if (!printAnimating) {
        printAnimating = true;
        requestAnimationFrame(animatePrint);
      }
    };

    window.addEventListener('scroll', queuePrint, {passive:true});
    window.addEventListener('resize', queuePrint);
    readPrintProgress();
    currentPrintProgress = targetPrintProgress;
    paintPrint(currentPrintProgress);
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
