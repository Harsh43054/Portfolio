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
