(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var bgm = document.getElementById('bgm');
  var musicBtn = document.getElementById('musicBtn');
  var current = 1;
  var p6Timer = null;
  var musicOn = false;

  function pageEl(n) { return document.getElementById('p' + n); }

  function show(n) {
    n = Math.max(1, Math.min(pages.length, n));
    clearTimeout(p6Timer);
    pages.forEach(function (p) { p.classList.remove('active'); });
    var el = pageEl(n);
    el.classList.add('active');
    current = n;
    if (history.replaceState) {
      history.replaceState(null, '', '#page-' + n);
    } else {
      location.hash = 'page-' + n;
    }
    if (n === 6) {
      p6Timer = setTimeout(function () {
        if (current === 6) show(7);
      }, 6500);
    }
    if (n === pages.length) {
      startSprinkle(el);
    } else {
      stopSprinkle();
    }
  }

  var sprinkleTimer = null;
  var livePieces = 0;
  var SP_COLORS = ['#EC5C8D', '#FF9FC6', '#F7F2E4', '#FFD34D', '#A62B4C', '#FFFFFF', '#FF6F91', '#C4527C'];

  function spawnSprinkle(el) {
    if (livePieces > 170) return;
    var d = document.createElement('i');
    var circ = Math.random() < 0.28;
    var w = circ ? 6 + Math.random() * 6 : 5 + Math.random() * 5;
    var h = circ ? w : 11 + Math.random() * 12;
    var color = SP_COLORS[(Math.random() * SP_COLORS.length) | 0];
    d.style.cssText =
      'position:absolute;z-index:9;pointer-events:none;left:' + Math.random() * 100 + '%;top:-32px;' +
      'width:' + w + 'px;height:' + h + 'px;background:' + color + ';' +
      'border-radius:' + (circ ? '50%' : w / 2 + 'px') + ';opacity:0.95;';
    el.appendChild(d);
    livePieces++;
    var drift = (Math.random() - 0.5) * 160;
    var dist = el.offsetHeight + 60;
    var rot = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720);
    var dur = 3200 + Math.random() * 3200;
    var a = d.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + drift * 0.35 + 'px,' + dist * 0.55 + 'px) rotate(' + rot * 0.5 + 'deg)', opacity: 1, offset: 0.55 },
      { transform: 'translate(' + drift + 'px,' + dist + 'px) rotate(' + rot + 'deg)', opacity: 0.9, offset: 0.94 },
      { transform: 'translate(' + drift + 'px,' + (dist + 20) + 'px) rotate(' + rot + 'deg)', opacity: 0 }
    ], { duration: dur, fill: 'forwards', easing: 'linear' });
    a.onfinish = function () { d.remove(); livePieces--; };
  }

  function startSprinkle(el) {
    if (sprinkleTimer) return;
    for (var i = 0; i < 55; i++) {
      (function (i) { setTimeout(function () { spawnSprinkle(el); }, i * 50); })(i);
    }
    sprinkleTimer = setInterval(function () { spawnSprinkle(el); }, 125);
  }

  function stopSprinkle() {
    clearInterval(sprinkleTimer);
    sprinkleTimer = null;
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('#envBtn')) {
      startMusic();
      show(6);
      return;
    }
    var t = e.target.closest('[data-go]');
    if (t) {
      startMusic();
      show(parseInt(t.getAttribute('data-go'), 10));
      return;
    }
    if (e.target.closest('#musicBtn')) {
      toggleMusic();
      return;
    }
    startMusic();
    var p6 = document.getElementById('p6');
    if (p6.classList.contains('active') && e.target.closest('#p6')) {
      show(7);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  function startMusic() {
    if (musicOn) return;
    musicOn = true;
    bgm.volume = 0.55;
    var p = bgm.play();
    if (p && p.catch) p.catch(function () { musicOn = false; });
    musicBtn.innerHTML = '&#128266;';
  }

  function toggleMusic() {
    if (bgm.paused) {
      musicOn = true;
      bgm.play();
      musicBtn.innerHTML = '&#128266;';
    } else {
      musicOn = false;
      bgm.pause();
      musicBtn.innerHTML = '&#128264;';
    }
  }

  var start = 1;
  var h = (location.hash || '').match(/page-(\d+)/);
  if (h) start = parseInt(h[1], 10);
  show(start);
})();
