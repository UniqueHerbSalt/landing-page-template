/* =========================================================
   공용 인터랙션 — goldenrecords.kr 분석 결과의 바닐라 이식
   (framer-motion 컴포넌트의 바닐라 포트 원본 파라미터 유지)
   ========================================================= */
(function(){
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 스파크 필드: 시드 랜덤 별 + 유성 ---------- */
  function initSparkField(){
    var field = document.getElementById('spark-field');
    if (!field || reduced) return;
    function rnd(i){ var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 90; i++){
      var s = document.createElement('div');
      s.style.cssText = 'position:absolute;border-radius:50%;background:#E8D9BE;'
        + 'top:' + (rnd(i) * 100).toFixed(1) + '%;left:' + (rnd(i + 200) * 100).toFixed(1) + '%;'
        + 'width:' + (1 + rnd(i + 400) * 1.6).toFixed(1) + 'px;height:' + (1 + rnd(i + 400) * 1.6).toFixed(1) + 'px;'
        + 'animation:fx-twinkle ' + (2.5 + rnd(i + 600) * 4).toFixed(1) + 's ease-in-out -' + (rnd(i + 800) * 6).toFixed(1) + 's infinite';
      frag.appendChild(s);
    }
    [['12%','78%','7s','0s'],['34%','40%','9s','3.2s'],['8%','55%','11s','6.5s']].forEach(function(ss){
      var d = document.createElement('div');
      d.style.cssText = 'position:absolute;width:160px;height:2px;opacity:0;'
        + 'background:linear-gradient(90deg,rgba(232,217,190,0),rgba(232,217,190,.5) 70%,#E8D9BE);'
        + 'box-shadow:0 0 6px rgba(232,217,190,.35);'
        + 'top:' + ss[0] + ';left:' + ss[1] + ';animation:fx-shoot ' + ss[2] + ' linear ' + ss[3] + ' infinite';
      frag.appendChild(d);
    });
    field.appendChild(frag);
  }

  /* ---------- 2. 스크롤 리빌 (+ 앵커 점프 시 통과 섹션 보정) ---------- */
  function initReveal(){
    var els = [].slice.call(document.querySelectorAll('.reveal'));
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || reduced){
      els.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach(function(el){ io.observe(el); });
    /* 앵커 점프로 뷰포트 위를 "통과"한 섹션은 IO가 교차를 못 본다 —
       스크롤 정지 시(debounce 120ms) 위로 지나간 미공개 요소를 일괄 공개 */
    var t = null;
    window.addEventListener('scroll', function(){
      clearTimeout(t);
      t = setTimeout(function(){
        els.forEach(function(el){
          if (!el.classList.contains('in') && el.getBoundingClientRect().bottom < 0){
            el.classList.add('in'); io.unobserve(el);
          }
        });
      }, 120);
    }, { passive: true });
  }

  /* ---------- 3. 숫자 티커: 오도미터 + 스프링 물리 ---------- */
  var STIFF = 60, DAMP = 20, MASS = 0.8, DURATION = 1.5;
  function setStrip(dg, cur){ dg.strip.style.transform = 'translateY(' + (-cur) + 'em)'; }
  function buildTicker(el, cardIndex){
    var value    = parseFloat(el.getAttribute('data-value'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix   = el.getAttribute('data-prefix') || '';
    var suffix   = el.getAttribute('data-suffix') || '';
    var delay    = el.hasAttribute('data-delay') ? parseFloat(el.getAttribute('data-delay')) : cardIndex * 0.15;
    var fixed = value.toFixed(decimals);
    var sp = fixed.split('.'), whole = sp[0], dec = sp[1];
    var withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var formatted = dec ? withCommas + '.' + dec : withCommas;
    var chars = formatted.split('');
    var digitCount = chars.filter(function(c){ return /\d/.test(c); }).length;
    el.textContent = '';
    if (prefix){ var pe = document.createElement('span'); pe.textContent = prefix; el.appendChild(pe); }
    var digits = [], digitIndex = 0;
    chars.forEach(function(ch){
      if (/\d/.test(ch)){
        var stagger = delay + (digitIndex / digitCount) * DURATION * 0.6;
        digitIndex++;
        var win = document.createElement('span'); win.className = 'gr-dig';
        var strip = document.createElement('span'); strip.className = 'gr-strip';
        for (var n = 0; n < 10; n++){ var d = document.createElement('span'); d.textContent = n; strip.appendChild(d); }
        win.appendChild(strip); el.appendChild(win);
        var dg = { strip: strip, target: parseInt(ch, 10), stagger: stagger, p: 0, v: 0, done: false };
        setStrip(dg, 0);
        digits.push(dg);
      } else {
        var se = document.createElement('span'); se.textContent = ch; el.appendChild(se);
      }
    });
    if (suffix){ var sf = document.createElement('span'); sf.textContent = suffix; el.appendChild(sf); }
    return digits;
  }
  function animateTicker(digits){
    var start = null, last = null;
    function frame(t){
      if (start === null) start = t;
      var dtReal = last === null ? 0 : (t - last) / 1000; last = t;
      var elapsed = (t - start) / 1000;
      var allDone = true;
      for (var i = 0; i < digits.length; i++){
        var dg = digits[i];
        if (dg.done) continue;
        allDone = false;
        if (elapsed < dg.stagger) continue;
        var dt = Math.min(dtReal, 0.25);
        var steps = Math.max(1, Math.ceil(dt / (1/120)));
        var h = dt / steps;
        for (var s = 0; s < steps; s++){
          var force = -STIFF * (dg.p - dg.target) - DAMP * dg.v;
          dg.v += (force / MASS) * h;
          dg.p += dg.v * h;
        }
        if (Math.abs(dg.p - dg.target) < 0.01 && Math.abs(dg.v) < 0.05){
          dg.done = true; setStrip(dg, ((dg.target % 10) + 10) % 10);
        } else {
          setStrip(dg, ((dg.p % 10) + 10) % 10);
        }
      }
      if (!allDone) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function initTickers(){
    var els = [].slice.call(document.querySelectorAll('.gr-ticker[data-value]'));
    els.forEach(function(el, idx){
      if (reduced){
        /* 모션 최소화: 최종 수치를 즉시 표시 */
        var v = parseFloat(el.getAttribute('data-value'));
        var dm = parseInt(el.getAttribute('data-decimals') || '0', 10);
        el.textContent = (el.getAttribute('data-prefix') || '')
          + v.toFixed(dm).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          + (el.getAttribute('data-suffix') || '');
        return;
      }
      var digits = buildTicker(el, idx);
      if (!('IntersectionObserver' in window)){ animateTicker(digits); return; }
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if (e.isIntersecting){ io.disconnect(); animateTicker(digits); } });
      }, { rootMargin: '-50px', threshold: 0 });
      io.observe(el);
    });
  }

  /* ---------- 4. 무한 마퀴: 목록 복제로 -50% 루프 완성 ---------- */
  function initMarquees(){
    [].slice.call(document.querySelectorAll('.marquee-track')).forEach(function(track){
      var items = [].slice.call(track.children);
      items.forEach(function(it){ track.appendChild(it.cloneNode(true)); });
    });
  }

  /* ---------- 5. 네비 스크롤 스파이 ---------- */
  function initScrollSpy(){
    var BEIGE = (getComputedStyle(document.documentElement).getPropertyValue('--beige') || '#E8D9BE').trim();
    var items = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!items.length) return;
    var map = {};
    items.forEach(function(a){ var h = a.getAttribute('href'); if (h.length > 1) map[h.slice(1)] = a; });
    var activeItem = null, hoverItem = null;
    function paint(){ items.forEach(function(x){ x.style.color = (x === activeItem || x === hoverItem) ? BEIGE : ''; }); }
    function setActive(a){ activeItem = a; paint(); }
    items.forEach(function(a){
      a.addEventListener('click', function(){ setActive(a); });
      a.addEventListener('mouseenter', function(){ hoverItem = a; paint(); });
      a.addEventListener('mouseleave', function(){ hoverItem = null; paint(); });
    });
    var secs = Object.keys(map).map(function(id){ return document.getElementById(id); }).filter(Boolean);
    if ('IntersectionObserver' in window && secs.length){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if (e.isIntersecting) setActive(map[e.target.id]); });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      secs.forEach(function(s){ io.observe(s); });
    }
  }

  /* ---------- 6. 필터 등장 애니메이션 헬퍼 ---------- */
  window.fxFilterAppear = function(cards){
    [].slice.call(cards).forEach(function(el, i){
      el.classList.remove('appearing');
      void el.offsetWidth;   /* reflow로 애니메이션 재시작 */
      el.style.animationDelay = (i * 0.06) + 's';
      el.classList.add('appearing');
    });
  };

  document.addEventListener('DOMContentLoaded', function(){
    initSparkField();
    initReveal();
    initTickers();
    initMarquees();
    initScrollSpy();
  });
})();
