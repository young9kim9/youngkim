(function () {
  var DELAY = 30000;
  var PIXELATE_DURATION = 2000;
  var MAX_BLOCK = 5;

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

    var el = document.documentElement;
    var W = el.clientWidth;
    var H = el.clientHeight;
    el.style.overflow = 'hidden';

    loadLib(function () {
      if (!capturing) return;
      html2canvas(el, {
        useCORS: true,
        allowTaint: true,
        x: window.scrollX || 0,
        y: window.scrollY || 0,
        width: W,
        height: H,
        scale: 1,
        logging: false
      }).then(function (shot) {
        if (!capturing) return;
        capturing = false;
        show(shot, W, H);
      }).catch(function () {
        capturing = false;
        el.style.overflow = '';
      });
    });
  }

  function show(src, W, H) {
    overlay = document.createElement('canvas');
    overlay.width = W;
    overlay.height = H;
    overlay.style.cssText =
      'position:fixed;top:0;left:0;width:' + W + 'px;height:' + H + 'px;' +
      'z-index:99999;cursor:none;image-rendering:pixelated;';
    document.body.appendChild(overlay);
    active = true;

    var ctx = overlay.getContext('2d');
    var base = document.createElement('canvas'); // downsampled source
    var noise = document.createElement('canvas'); // per-block flicker layer
    var t0 = performance.now();
    var flickering = false;

    // Pre-draw the final pixelated base once pixelation is complete
    var tw = Math.max(1, Math.ceil(W / MAX_BLOCK));
    var th = Math.max(1, Math.ceil(H / MAX_BLOCK));

    function frame(now) {
      if (!active) return;
      var elapsed = now - t0;

      if (!flickering) {
        // Pixelation phase
        var p = Math.min(elapsed / PIXELATE_DURATION, 1);
        var blockSize = Math.max(1, Math.round(1 + (MAX_BLOCK - 1) * p * p));

        var cw = Math.max(1, Math.ceil(W / blockSize));
        var ch = Math.max(1, Math.ceil(H / blockSize));
        base.width = cw;
        base.height = ch;
        var bc = base.getContext('2d');
        bc.imageSmoothingEnabled = true;
        bc.drawImage(src, 0, 0, cw, ch);

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(base, 0, 0, cw, ch, 0, 0, W, H);

        if (p >= 1) {
          // Freeze final pixelated base at MAX_BLOCK resolution
          base.width = tw;
          base.height = th;
          var fc = base.getContext('2d');
          fc.imageSmoothingEnabled = true;
          fc.drawImage(src, 0, 0, tw, th);
          noise.width = tw;
          noise.height = th;
          flickering = true;
        }
      } else {
        // Flicker phase: redraw frozen base, then overlay random per-block brightness
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(base, 0, 0, tw, th, 0, 0, W, H);

        // Build per-block noise at block resolution
        var nc = noise.getContext('2d');
        var img = nc.createImageData(tw, th);
        var d = img.data;
        for (var i = 0; i < d.length; i += 4) {
          var v = Math.random() > 0.5 ? 255 : 0; // each block either brightens or darkens
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = Math.floor(Math.random() * 28); // 0–28 alpha ≈ max ~11% opacity
        }
        nc.putImageData(img, 0, 0);

        // Scale noise up to match overlay, blend with screen mode
        ctx.globalCompositeOperation = 'screen';
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(noise, 0, 0, tw, th, 0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over';
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);
  }

  function dismiss() {
    active = false;
    capturing = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (overlay) { overlay.remove(); overlay = null; }
    document.documentElement.style.overflow = '';
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
