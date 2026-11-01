/* ============================================================
   Felix — page behaviour
   Graphics are static end states for now (the "graphics first"
   round, 2026-10-01). Subtle motion is the next round; one-shot
   timelines will register in window.__felixOnce so captures can
   settle them with progress(1).
   ============================================================ */
(function () {
  'use strict';
  window.__felixOnce = window.__felixOnce || [];

  // Nav: shadow once the page has scrolled
  var nav = document.getElementById('felix-nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Buttons and nav links: wrap each label so hover can roll it (CSS draws the copy)
  Array.prototype.forEach.call(document.querySelectorAll('.btn, .nav-link'), function (b) {
    Array.prototype.slice.call(b.childNodes).forEach(function (n) {
      var txt = n.nodeType === 3 && n.nodeValue.trim();
      if (!txt) return;
      var outer = document.createElement('span'), inner = document.createElement('span');
      outer.className = 'btn-t'; inner.textContent = txt; inner.setAttribute('data-t', txt);
      outer.appendChild(inner); b.replaceChild(outer, n);
    });
  });

  // FAQ: one open at a time, height eased both ways (interruptible)
  var faqs = Array.prototype.slice.call(document.querySelectorAll('#faq details'));
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setOpen(d, open) {
    if (d._want === open || (d._want === undefined && d.open === open)) return;
    d._want = open;
    var sum = d.querySelector('summary'), body = d.querySelector('summary ~ *');
    if (still) { d.open = open; d._want = undefined; return; }
    var from = d.offsetHeight;
    if (d._anim) d._anim.cancel();
    d.open = true;                                   // measure with the answer in
    var closed = sum.offsetHeight + parseFloat(getComputedStyle(d).borderBottomWidth);
    var to = open ? d.offsetHeight : closed;
    d.style.overflow = 'hidden';
    d.classList.toggle('is-open', open);
    d._anim = d.animate({ height: [from + 'px', to + 'px'] },
                        { duration: open ? 360 : 280, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
    if (body && open) body.animate({ opacity: [0, 1], transform: ['translateY(-6px)', 'none'] },
                                   { duration: 320, delay: 60, easing: 'ease-out', fill: 'backwards' });
    d._anim.onfinish = function () {
      d.open = open; d.style.overflow = ''; d._anim = null; d._want = undefined;
    };
  }
  faqs.forEach(function (d) {
    d.classList.toggle('is-open', d.open);
    d.querySelector('summary').addEventListener('click', function (e) {
      e.preventDefault();
      var open = d._want !== undefined ? !d._want : !d.open;
      if (open) faqs.forEach(function (o) { if (o !== d) setOpen(o, false); });
      setOpen(d, open);
    });
  });
})();

/* Hero connectors: one measured SVG overlay so the wires meet the cards.
   Incoming → Felix (solid green), Felix → trunk → three outcomes
   (solid green to the lit Resolve card, dashed to the rest). */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var stage = document.getElementById('triage');
  if (!stage) return;
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'triage-links');
  svg.setAttribute('aria-hidden', 'true');
  stage.insertBefore(svg, stage.firstChild);

  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    svg.appendChild(n); return n;
  }
  function box(node) {
    var r = node.getBoundingClientRect(), b = stage.getBoundingClientRect();
    return { l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top, cy: (r.top + r.bottom) / 2 - b.top };
  }
  // square terminals, to match the page's square geometry
  function end(x, y, on, k) { el('rect', { 'class': (on ? 'end on ' : 'end ') + k, x: x - 3, y: y - 3, width: 6, height: 6 }); }
  // a pulse of current riding a live wire: soft halo under a bright core
  function spark(d, k) {
    var g = el('path', { 'class': 'spark-glow ' + k, d: d });
    var len = Math.round(g.getTotalLength()) + 'px';
    g.style.setProperty('--len', len);
    el('path', { 'class': 'spark ' + k, d: d }).style.setProperty('--len', len);
  }
  function draw() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (window.innerWidth <= 960) return;
    var inC = document.getElementById('inCard'), fx = document.getElementById('felixCard');
    var outs = stage.querySelectorAll('.out-card');
    if (!inC || !fx || !outs.length) return;
    var a = box(inC), f = box(fx);
    var o = Array.prototype.map.call(outs, box);
    var gapR = (f.r + o[0].l) / 2;
    // incoming → felix
    var y0 = Math.min(a.cy, f.t + 30);
    var dIn = 'M' + a.r + ' ' + y0 + ' H' + f.l;
    el('path', { 'class': 'wire on w-in', d: dIn, pathLength: 1 });
    spark(dIn, 's-in');
    end(a.r, y0, true, 'e-in'); end(f.l, y0, true, 'e-in');
    // felix → trunk → outcomes
    var yF = f.t + 30, trunk = gapR, bot = o[o.length - 1].cy;
    el('path', { 'class': 'wire', d: 'M' + trunk + ' ' + Math.min(yF, o[0].cy) + ' V' + bot });
    var dOut = 'M' + f.r + ' ' + yF + ' H' + trunk + ' V' + (o[0].t + 30) + ' H' + o[0].l;
    el('path', { 'class': 'wire on w-out', d: dOut, pathLength: 1 });
    spark(dOut, 's-out');
    end(f.r, yF, true, 'e-out'); end(o[0].l, o[0].t + 30, true, 'e-out');
    for (var i = 1; i < o.length; i++) {
      el('path', { 'class': 'wire', d: 'M' + trunk + ' ' + o[i].cy + ' H' + o[i].l });
      end(o[i].l, o[i].cy, false, 'e-out');
    }
  }
  draw();
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(draw, 80); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  window.addEventListener('load', draw);
})();

/* Hero triage sequence: plays once as the curtain lifts (CSS holds the
   timeline in transition-delays), then Felix's reply types itself. */
(function () {
  'use strict';
  var stage = document.getElementById('triage');
  if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var voice = stage.querySelector('.out-card.is-on .felix-voice');
  var cursor = voice && voice.querySelector('.cursor');
  var full = voice ? voice.firstChild.nodeValue : '';
  stage.classList.add('anim');
  if (voice) voice.firstChild.nodeValue = '';

  // Hero copy enters first: each heading word rises out of its own mask
  var hero = document.getElementById('hero'), h1 = hero && hero.querySelector('.h1');
  if (h1) {
    h1.setAttribute('aria-label', h1.textContent.trim());
    var n = 0;
    function mask(inner) {
      var w = document.createElement('span');
      w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      inner.style.setProperty('--i', n++);
      w.appendChild(inner); return w;
    }
    Array.prototype.slice.call(h1.childNodes).forEach(function (node) {
      if (node.nodeType === 1) { h1.replaceChild(mask(node.cloneNode(true)), node); return; }
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement('span'); s.textContent = part;
        frag.appendChild(mask(s));
      });
      h1.replaceChild(frag, node);
    });
    hero.classList.add('hero-anim');
  }

  function type() {
    if (!voice) return;
    var i = 0, node = voice.firstChild;
    var t = setInterval(function () {
      node.nodeValue = full.slice(0, ++i);
      if (i >= full.length) clearInterval(t);
    }, 26);
  }
  function play() {
    stage.getBoundingClientRect();           // commit the hidden state first
    if (hero) hero.classList.add('hero-in');
    setTimeout(function () {                 // the stage follows the copy
      stage.classList.add('play');
      setTimeout(type, 2700);
    }, 450);
  }
  window.__felixOnce.push({ progress: function () {   // captures: jump to the end
    if (hero) hero.classList.add('hero-in');
    stage.classList.add('play'); if (voice) voice.firstChild.nodeValue = full;
  } });
  var curtain = document.getElementById('felixCurtain');
  if (!curtain) { requestAnimationFrame(play); return; }
  // start as the curtain lifts (it is removed at ~4.5s)
  new MutationObserver(function (m, obs) {
    if (!document.body.contains(curtain)) { obs.disconnect(); play(); }
  }).observe(document.body, { childList: true, subtree: true });
})();

/* Page cards: rise in as they enter the viewport, staggered per row */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cards = document.querySelectorAll('.pcol, .card, .tier, .strip-cell, .band-row > *, .domains > li');
  Array.prototype.forEach.call(document.querySelectorAll('.pcol .iso .hi-o'), function (p) { p.setAttribute('pathLength', 1); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  Array.prototype.forEach.call(cards, function (c) {
    var i = Array.prototype.indexOf.call(c.parentNode.children, c);
    c.style.transitionDelay = Math.min(i, 7) * 70 + 'ms';
    c.classList.add('rv');
    io.observe(c);
  });
})();

/* Close section: staggered entrance, numeric stats count up, then idle loops (CSS) */
(function () {
  'use strict';
  var sec = document.getElementById('working-together');
  if (!sec || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var stats = sec.querySelectorAll('.stats > div');
  Array.prototype.forEach.call(stats, function (s, i) { s.style.setProperty('--i', i); });
  sec.classList.add('anim');
  function count(b, delay) {
    var to = parseFloat(b.textContent), dp = (b.textContent.split('.')[1] || '').length, t0 = null;
    if (isNaN(to)) return;
    b.textContent = (0).toFixed(dp);
    // timer-driven (not rAF) so the count always lands on the real value, even in a background tab
    setTimeout(function step() {
      var now = performance.now();
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - p, 3);
      b.textContent = (to * e).toFixed(dp);
      if (p < 1) setTimeout(step, 30);
    }, delay);
  }
  var io = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    sec.classList.add('play');
    Array.prototype.forEach.call(stats, function (s, i) { count(s.querySelector('b'), 600 + i * 80); });
  }, { rootMargin: '0px 0px -20% 0px' });
  io.observe(sec);
})();

/* Page ruler: five ticks per section (one major, four minor). The section
   under the reading line lights its major tick, fills its minors as you
   read through it, and names itself beside the ruler. */
(function () {
  'use strict';
  var ruler = document.getElementById('ruler');
  if (!ruler) return;
  var NAMES = { hero: 'Intro', architecture: 'Stack', paths: 'Paths', problem: 'Problem', details: 'Anatomy',
                roadmap: 'Roadmap', faq: 'FAQ', 'working-together': 'Contact' };
  var PER = 5, band = document.getElementById('problem');
  var secs = Array.prototype.filter.call(document.querySelectorAll('main > section[id]'), function (s) { return NAMES[s.id]; });
  if (!secs.length) return;
  var ticks = [];
  secs.forEach(function () {
    for (var j = 0; j < PER; j++) {
      var t = document.createElement('i');
      if (!j) t.className = 'maj';
      ruler.appendChild(t); ticks.push(t);
    }
  });
  var end = document.createElement('i'); end.className = 'maj'; ruler.appendChild(end); ticks.push(end);
  var label = document.createElement('span'); label.className = 'ruler-label'; ruler.appendChild(label);

  var last = -1, queued = false;
  function update() {
    queued = false;
    var mid = window.innerHeight * 0.4, k = 0, p = 0;
    var atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    for (var i = 0; i < secs.length; i++) {
      var r = secs[i].getBoundingClientRect();
      if (r.top <= mid) { k = i; p = Math.min(1, (mid - r.top) / r.height); }
    }
    if (atEnd) { k = secs.length - 1; p = 1; }
    var lit = k * PER + Math.floor(p * PER);
    ticks.forEach(function (t, n) {
      t.classList.toggle('past', n < k * PER);
      t.classList.toggle('on', n >= k * PER && n <= lit);
      t.classList.toggle('cur', n === k * PER);
    });
    end.classList.toggle('on', atEnd);
    if (k !== last) {
      last = k;
      label.innerHTML = '<b>' + ('0' + (k + 1)).slice(-2) + '</b>' + NAMES[secs[k].id];
      label.style.top = ticks[k * PER].offsetTop + 'px';
    }
    // over the rust band, ink just the ticks that sit on it
    var b = band ? band.getBoundingClientRect() : null, y0 = ruler.getBoundingClientRect().top;
    function over(y) { return !!b && y >= b.top && y <= b.bottom; }
    ticks.forEach(function (t) { t.classList.toggle('ink', over(y0 + t.offsetTop)); });
    label.classList.toggle('ink', over(y0 + label.offsetTop));
  }
  function onScroll() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

/* Pixel trail (hero and closing section): the mouse leaves a few rust pixels
   on an 18px grid that fade out behind the copy. Mouse pointers only; off
   for reduced motion. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  // rust in the hero; green in the close section to match its dot field
  [['hero', '214,105,47'], ['working-together', '91,199,122']].forEach(function (s) {
    var sec = document.getElementById(s[0]);
    if (sec) trail(sec, sec.querySelector(':scope > .wrap'), s[1]);
  });

function trail(hero, before, rgb) {
  var CELL = 18, LIFE = 650, cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  cv.className = 'hero-trail'; cv.setAttribute('aria-hidden', 'true');
  hero.insertBefore(cv, before || hero.firstChild);

  var cells = new Map(), last = null, running = false, dpr = 1;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = hero.clientWidth * dpr; cv.height = hero.clientHeight * dpr;
  }
  function mark(x, y, a, delay) {
    var k = Math.floor(x / CELL) + ',' + Math.floor(y / CELL);
    var c = cells.get(k), t = performance.now() + (delay || 0);
    if (!c || c.a < a || c.t < t - LIFE / 2) cells.set(k, { a: a, t: t });
  }
  function frame(now) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, hero.clientWidth, hero.clientHeight);
    cells.forEach(function (c, k) {
      if (now < c.t) return;   // scheduled by a burst, not lit yet
      var life = 1 - (now - c.t) / LIFE;
      if (life <= 0) { cells.delete(k); return; }
      var p = k.split(',');
      ctx.fillStyle = 'rgba(' + rgb + ',' + (c.a * life * life).toFixed(3) + ')';
      ctx.fillRect(p[0] * CELL + 1, p[1] * CELL + 1, CELL - 2, CELL - 2);
    });
    if (cells.size) requestAnimationFrame(frame); else running = false;
  }
  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    // fill the gap since the last event so fast moves still leave a line
    var steps = last ? Math.min(24, Math.ceil(Math.hypot(x - last.x, y - last.y) / CELL)) : 1;
    for (var i = 1; i <= steps; i++) {
      var px = last ? last.x + (x - last.x) * i / steps : x, py = last ? last.y + (y - last.y) * i / steps : y;
      mark(px, py, 0.32);
      if (Math.random() < 0.25) mark(px + (Math.random() < 0.5 ? -CELL : CELL), py + (Math.random() < 0.5 ? -CELL : CELL), 0.14);
    }
    last = { x: x, y: y };
    if (!running) { running = true; requestAnimationFrame(frame); }
  });
  hero.addEventListener('pointerleave', function () { last = null; });
  // click on empty space: a small ring of pixels bursts outward from the cursor
  hero.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('a, button, summary, input, h1, h2, p, .hero-actions, .triage-col, .close-box, .stats')) return;
    var r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    var cx = Math.floor(x / CELL), cy = Math.floor(y / CELL), R = 5;
    for (var dx = -R; dx <= R; dx++) for (var dy = -R; dy <= R; dy++) {
      var d = Math.hypot(dx, dy);
      if (d > R + 0.4) continue;
      // dense near the centre, sparse at the rim; each ring lights a beat after the last
      if (d > 1 && Math.random() > 1.15 - d / R) continue;
      mark((cx + dx + 0.5) * CELL, (cy + dy + 0.5) * CELL, 0.42 * (1 - d / (R + 1.5)), d * 38);
    }
    if (!running) { running = true; requestAnimationFrame(frame); }
  });
  size();
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(hero);
  else window.addEventListener('resize', size);
}
})();
