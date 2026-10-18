(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = document.getElementById('progress'), ticking = false;
  function update(){
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(scrollY / h, 1) : 0) + ')';
    ticking = false;
  }
  addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive:true});
  update();

  function count(el){
    var end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '';
    if(reduce){ el.textContent = end.toFixed(dec) + suf; return; }
    var t0 = performance.now(), dur = 1400;
    (function step(t){
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec) + suf;
      if(p < 1) requestAnimationFrame(step);
    })(t0);
  }

  var items = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        en.target.classList.add('in');
        var c = en.target.querySelector('[data-count]');
        if(c) count(c);
        io.unobserve(en.target);
      });
    }, {threshold:.15});
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('in'); var c = el.querySelector('[data-count]'); if(c) count(c); });
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();

(function(){
  const toggle=document.getElementById('theme-toggle');
  function applyTheme(theme){document.documentElement.dataset.theme=theme;toggle.setAttribute('aria-label','Switch to '+(theme==='light'?'dark':'light')+' theme');}
  try{applyTheme(localStorage.getItem('portfolio-theme')==='light'?'light':'dark');}catch{applyTheme('dark');}
  toggle.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';applyTheme(next);try{localStorage.setItem('portfolio-theme',next);}catch{}});
  const cards=[...document.querySelectorAll('.proj[data-category]')];
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let shown=0;cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)shown++;});
    document.getElementById('filter-status').textContent=shown+' project'+(shown===1?'':'s')+' shown';
  }));
  if('IntersectionObserver' in window){const nav=[...document.querySelectorAll('.nav nav a')];const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;nav.forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -60% 0px',threshold:0});document.querySelectorAll('main>section[id]').forEach(section=>observer.observe(section));}
})();
