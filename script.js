(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
  const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const year=$('#year'); if(year) year.textContent=new Date().getFullYear();

  const header=$('#site-header'), headerBrand=$('#header-brand'), opening=$('.opening'), title=$('#opening-title'), hint=$('.opening-hint');
  const printer=$('.printer-section'), sheet=$('.printer-sheet'), printHead=$('.print-head'), printCopy=$('.printer-copy'), finish=$('.print-finish');

  let openingTarget=0;
  let openingCurrent=null;
  let openingAnimating=false;

  function applyOpening(p){
    if(!opening || !title) return;
    const vh=Math.max(innerHeight,1), vw=Math.max(innerWidth,1);

    if(!reduceMotion){
      const naturalW=Math.max(title.offsetWidth,1);
      const target=headerBrand?.getBoundingClientRect();
      const scale=target?clamp(target.width/naturalW,.09,.22):.14;
      const titleOffset=parseFloat(getComputedStyle(title).top)||0;
      const startX=vw/2, startY=vh/2+titleOffset;
      const targetX=target?target.left+target.width/2:70;
      const targetY=target?target.top+target.height/2:34;

      // Spread the movement across almost the entire opening section.
      const move=smooth(.02,.96,p);
      const tx=(targetX-startX)*move;
      const ty=(targetY-startY)*move;
      const sc=1-(1-scale)*move;
      title.style.transform=`translate3d(${tx}px,${ty}px,0) scale(${sc})`;
      title.style.opacity=String(1-smooth(.90,1,p));
      if(hint) hint.style.opacity=String(1-smooth(.04,.24,p));
    }

    if(header){
      const o=smooth(.89,1,p);
      header.style.opacity=String(o);
      header.classList.toggle('ready',o>.45);
    }
  }

  function animateOpening(){
    if(openingCurrent===null) openingCurrent=openingTarget;
    const delta=openingTarget-openingCurrent;
    // Damped interpolation removes the jittery direct scroll-to-transform feel.
    openingCurrent += delta*.085;
    if(Math.abs(delta)<.00045) openingCurrent=openingTarget;
    applyOpening(openingCurrent);

    if(Math.abs(openingTarget-openingCurrent)>.00045){
      requestAnimationFrame(animateOpening);
    }else{
      openingAnimating=false;
    }
  }

  function renderScroll(){
    const vh=Math.max(innerHeight,1);

    if(opening && title){
      const rect=opening.getBoundingClientRect();
      const distance=Math.max(opening.offsetHeight-vh,1);
      openingTarget=clamp(-rect.top/distance);
      if(openingCurrent===null) openingCurrent=openingTarget;

      if(reduceMotion){
        openingCurrent=openingTarget;
        applyOpening(openingCurrent);
      }else if(!openingAnimating){
        openingAnimating=true;
        requestAnimationFrame(animateOpening);
      }
    }

    if(printer && !reduceMotion){
      const rect=printer.getBoundingClientRect(), distance=Math.max(printer.offsetHeight-vh,1), p=clamp(-rect.top/distance);
      const paper=clamp((p-.08)/.64), y=-62+paper*88;
      if(sheet) sheet.style.transform=`translate3d(-50%,${y}%,0)`;
      const ci=clamp((p-.05)/.20); if(printCopy){printCopy.style.opacity=String(ci);printCopy.style.transform=`translateY(${(1-ci)*24}px)`}
      const hp=clamp((p-.08)/.60), hx=-72+hp*144; if(printHead){printHead.style.transform=`translateX(${hx}%)`;printHead.style.opacity=String(hp>0&&hp<1?1:.25)}
      const fi=smooth(.60,.76,p); if(finish){finish.style.opacity=String(fi); if(innerWidth>900) finish.style.transform=`translateY(${(1-fi)*16}px)`}
    }
  }

  let tick=false;
  addEventListener('scroll',()=>{
    if(!tick){
      tick=true;
      requestAnimationFrame(()=>{renderScroll();tick=false});
    }
  },{passive:true});
  addEventListener('resize',()=>{openingCurrent=null;renderScroll()});
  renderScroll();

  const menuButton=$('#menu-button'), menuPanel=$('#menu-panel');
  const closeMenu=()=>{menuPanel?.classList.remove('open');menuPanel?.setAttribute('aria-hidden','true');menuButton?.setAttribute('aria-expanded','false');if(menuButton)menuButton.textContent='Menu';document.body.classList.remove('menu-open')};
  menuButton?.addEventListener('click',()=>{const open=!menuPanel.classList.contains('open'); if(open){menuPanel.classList.add('open');menuPanel.setAttribute('aria-hidden','false');menuButton.setAttribute('aria-expanded','true');menuButton.textContent='Close';document.body.classList.add('menu-open')}else closeMenu()});
  $$('#menu-panel a').forEach(a=>a.addEventListener('click',closeMenu));

  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.14}); $$('.project-row').forEach(r=>io.observe(r));

  const products={
    'business-cards':{number:'01 / Business Cards',title:'Business Cards',tagline:'Small format. Strong first impression.',heading:'Five different views of how business cards can feel premium.',description:'A mix of black, cream, textured and foil-led concepts shows how stock, edge weight, contrast and finishing can completely change the character of a card.',hero:'portfolio-business-cards.webp',gallery:['business-cards.webp','portfolio-business-cards-2.webp','portfolio-business-cards-3.webp','portfolio-business-cards-4.webp'],specs:['14 pt standard','16 pt matte / gloss','20 pt / 32 pt premium','Foil & specialty finishes']},
    flyers:{number:'02 / Flyers & Brochures',title:'Flyers & Brochures',tagline:'Different campaigns should not look like the same template.',heading:'Promotional pieces with their own visual voice.',description:'Restaurant promotions, café brochures and editorial handouts are presented with different colour, composition and photography so the category feels broad rather than repetitive.',hero:'portfolio-flyers.webp',gallery:['flyers.webp','portfolio-flyers-2.webp','portfolio-flyers-3.webp','portfolio-flyers-4.webp'],specs:['Single-sheet flyers','Bi-fold & tri-fold','Promotional cards','Campaign handouts']},
    stationery:{number:'03 / Stationery',title:'Stationery',tagline:'Consistency across every piece on the desk.',heading:'A quieter, tactile system built around paper and detail.',description:'Letterheads, envelopes, note cards and supporting pieces use a softer editorial presentation, natural light and restrained materials to separate this collection from the louder promotional work.',hero:'portfolio-stationery.webp',gallery:['stationery.webp','portfolio-stationery-2.webp','portfolio-stationery-3.webp','portfolio-stationery-4.webp'],specs:['Letterheads','Envelopes','Note cards','Coordinated brand sets']},
    wedding:{number:'04 / Wedding Stationery',title:'Wedding Stationery',tagline:'Soft materials. Personal details. Formal finish.',heading:'Invitation suites designed to feel special before the event begins.',description:'Deckled paper, envelopes, RSVP cards, wax seals and premium finishing create a warmer and more delicate visual direction than the commercial print collections.',hero:'portfolio-wedding.webp',gallery:['portfolio-wedding-2.webp','finishes.webp','finishes-detail-1.webp','finishes-detail-2.webp'],specs:['Invitations','RSVP & detail cards','Envelopes & liners','Foil / emboss / wax details']},
    'real-estate':{number:'05 / Real Estate',title:'Real Estate',tagline:'Property marketing that feels as considered as the listing.',heading:'Brochures, cards and large-format pieces for premium property presentation.',description:'Cool coastal photography, architectural layouts and larger display formats give the real-estate collection a completely different visual rhythm from the tabletop product work.',hero:'portfolio-real-estate.webp',gallery:['signage.webp','signage-detail-1.webp','signage-detail-2.webp','portfolio-real-estate-2.webp'],specs:['Property brochures','Feature sheets','Presentation cards','Signs & display graphics']},
    postcards:{number:'06 / Postcards',title:'Postcards',tagline:'A compact format with room for a strong image.',heading:'Travel, direct-mail and promotional cards built to be noticed quickly.',description:'This collection moves into brighter, more graphic territory with travel photography, compact card formats and promotional compositions that feel deliberately different from stationery and business cards.',hero:'portfolio-postcards.webp',gallery:['portfolio-postcards-2.webp','portfolio-postcards-3.webp','portfolio-postcards-4.webp','portfolio-postcards-5.webp'],specs:['Postcards','Direct mail cards','Promo cards','Short-run campaigns']},
    'magazine-books':{number:'07 / Magazine & Books',title:'Magazine & Books',tagline:'Long-form print deserves room to breathe.',heading:'Editorial layouts, bound pieces and publication-style print.',description:'Large spreads, architectural brochures, menu books and editorial covers show how image sequencing, typography and binding can turn print into a fuller reading experience.',hero:'portfolio-magazine-books.webp',gallery:['portfolio-magazine-books-2.webp','portfolio-magazine-books-3.webp','portfolio-magazine-books-4.webp','menus.webp'],specs:['Magazines','Booklets','Catalogues','Perfect / saddle-stitch binding']}
  };
  const viewer=$('#product-viewer'), shell=$('#viewer-shell'), close=$('#viewer-close'), hero=$('#viewer-hero-image'), num=$('#viewer-number'), vt=$('#viewer-title'), tag=$('#viewer-tagline'), vh=$('#viewer-heading'), desc=$('#viewer-description'), specs=$('#viewer-specs'), gallery=$('#viewer-gallery'), quoteLink=$('#viewer-quote-link'); let active=null;
  function populate(k){
    const p=products[k]; if(!p)return false;
    viewer.dataset.product=k;
    hero.src=p.hero; hero.alt=`${p.title} showcase cover`;
    num.textContent=p.number; vt.textContent=p.title; tag.textContent=p.tagline; vh.textContent=p.heading; desc.textContent=p.description;
    specs.innerHTML=p.specs.map((s,i)=>`<div class="spec-card"><span>0${i+1}</span><strong>${s}</strong></div>`).join('');
    gallery.className=`viewer-gallery gallery-${k}`;
    gallery.innerHTML=p.gallery.map((src,i)=>`<figure><img src="${src}" alt="${p.title} product example ${i+2}" loading="lazy"></figure>`).join('');
    return true
  }
  function show(k,push=true){if(!populate(k))return;viewer.classList.add('open');viewer.setAttribute('aria-hidden','false');shell.scrollTop=0;document.body.classList.add('viewer-open');if(push)history.pushState({product:k},'',`#${k}`);setTimeout(()=>close.focus(),80)}
  function animate(card,k){const img=$('img',card);if(!img||reduceMotion){show(k);return}const r=img.getBoundingClientRect(),clone=img.cloneNode(true);clone.className='transition-clone';Object.assign(clone.style,{top:`${r.top}px`,left:`${r.left}px`,width:`${r.width}px`,height:`${r.height}px`});document.body.appendChild(clone);document.body.classList.add('viewer-open');requestAnimationFrame(()=>requestAnimationFrame(()=>Object.assign(clone.style,{top:'0px',left:'0px',width:'100vw',height:'100vh',borderRadius:'0px'})));setTimeout(()=>{show(k);clone.style.opacity='0';setTimeout(()=>clone.remove(),180)},650)}
  function closeViewer(update=true){if(!viewer?.classList.contains('open'))return;viewer.classList.remove('open');viewer.setAttribute('aria-hidden','true');document.body.classList.remove('viewer-open');if(update&&products[location.hash.slice(1)])history.replaceState({},'',location.pathname+location.search);active?.focus?.();active=null}
  $$('.project-card').forEach(card=>card.addEventListener('click',()=>{const k=card.closest('.project-row')?.dataset.product;if(k){active=card;animate(card,k)}})); close?.addEventListener('click',()=>closeViewer()); quoteLink?.addEventListener('click',e=>{e.preventDefault();closeViewer();setTimeout(()=>$('#quote')?.scrollIntoView({behavior:reduceMotion?'auto':'smooth'}),100)}); addEventListener('popstate',()=>{const k=location.hash.slice(1);products[k]?show(k,false):closeViewer(false)}); const initial=location.hash.slice(1);if(products[initial])setTimeout(()=>show(initial,false),50);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(viewer?.classList.contains('open'))closeViewer();else closeMenu()}});

  const form=$('#quote-form'), status=$('#form-status'); form?.addEventListener('submit',async e=>{e.preventDefault();const b=$('.submit-button',form),data=Object.fromEntries(new FormData(form).entries());if(!data.name||!data.email||!data.location||!data.service||!data.message){status.textContent='Please complete all required fields.';return}b.disabled=true;status.textContent='Sending your request…';try{const res=await fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const payload=await res.json().catch(()=>({}));if(!res.ok)throw new Error(payload.error||'Unable to send the quote request.');form.reset();status.textContent='Thanks — your quote request has been sent.'}catch(err){status.textContent=err.message||'Unable to send right now. Please email dreamstudio194@gmail.com.'}finally{b.disabled=false}});

  const banner=$('#cookie-banner'), accept=$('#analytics-accept'), decline=$('#analytics-decline'), key='dsp-analytics-choice-v1'; const get=()=>{try{return localStorage.getItem(key)}catch{return null}}, set=v=>{try{localStorage.setItem(key,v)}catch{}}; if(banner){banner.hidden=Boolean(get());accept?.addEventListener('click',()=>{set('accepted');banner.hidden=true});decline?.addEventListener('click',()=>{set('essential');banner.hidden=true})}
})();
