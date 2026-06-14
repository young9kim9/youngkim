(function () {
  var DELAY = 30000;
  var PIXELATE_DURATION = 2500;
  var MAX_BLOCK = 10;

  var timer = null;
  var active = false;
  var capturing = false;
  var animId = null;
  var overlay = null;

  function loadLib(cb) {
    if (window.html2canvas) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = cb;
    s.onerror = function () { capturing = false; };
    document.head.appendChild(s);
  }

  function start() {
    if (active || capturing) return;
    capturing = true;
    loadLib(function () {
      if (!capturing) return;
      html2canvas(document.documentElement, {
        useCORS: true,
        allowTaint: true,
        x: window.scrollX || 0,
        y: window.scrollY || 0,
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        logging: false
      }).then(function (shot) {
        if (!capturing) return;
        capturing = false;
        show(shot);
      }).catch(function () { capturing = false; });
    });
  }

  function show(src) {
    var W = window.innerWidth;
    var H = window.innerHeight;

    // Canvas overlay sits on top — does not affect DOM layout or fixed positioning
    overlay = document.createElement('canvas');
    overlay.width = W;
    overlay.height = H;
    overlay.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;cursor:none;image-rendering:pixelated;';
    document.body.appendChild(overlay);
    active = true;

    var ctx = overlay.getContext('2d');
    var tmp = document.createElement('canvas');
    var t0 = performance.now();

    function frame(now) {
      if (!active) return;
      var p = Math.min((now - t0) / PIXELATE_DURATION, 1);
      var ease = p * p;
      var blockSize = Math.max(1, Math.round(1 + (MAX_BLOCK - 1) * ease));

      // Step 1: smooth downsample — each small pixel = average color of one block area
      var tw = Math.max(1, Math.ceil(W / blockSize));
      var th = Math.max(1, Math.ceil(H / blockSize));
      tmp.width = tw;
      tmp.height = th;
      var tc = tmp.getContext('2d');
      tc.imageSmoothingEnabled = true;
      tc.drawImage(src, 0, 0, tw, th);

      // Step 2: nearest-neighbor upsample — each averaged pixel becomes a sharp tile block
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(tmp, 0, 0, tw, th, 0, 0, W, H);

      if (p < 1) {
        animId = requestAnimationFrame(frame);
      }
    }

    animId = requestAnimationFrame(frame);
  }

  function dismiss() {
    active = false;
    capturing = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (overlay) { overlay.remove(); overlay = null; }
    resetTimer();
  }

  function resetTimer() {
    clearTimeout(timer);
    if (!active) timer = setTimeout(start, DELAY);
  }

  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click', 'wheel'].forEach(function (e) {
    document.addEventListener(e, function () {
      if (active) { dismiss(); } else { resetTimer(); }
    }, { passive: true });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resetTimer);
  } else {
    resetTimer();
  }
})();
