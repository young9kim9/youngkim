// (function () {
//     const lens = document.querySelector('.cursor-lens');
//     let raf, lastX = 0, lastY = 0, visible = false;

//     // Only show lens over the main viewport area
//     const showLens = () => { if (!visible) { lens.style.opacity = 1; visible = true; } };
//     const hideLens = () => { lens.style.opacity = 0; visible = false; };

//     // Smooth follow
//     const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
//     const pos = { x: target.x, y: target.y };

//     function animate() {
//       pos.x += (target.x - pos.x) * 0.18;
//       pos.y += (target.y - pos.y) * 0.18;
//       lens.style.transform = `translate(${pos.x - 0.5 * lens.offsetWidth}px, ${pos.y - 0.5 * lens.offsetHeight}px)`;
//       raf = requestAnimationFrame(animate);
//     }
//     animate();

//     // Track mouse
//     window.addEventListener('mousemove', (e) => {
//       target.x = e.clientX;
//       target.y = e.clientY;
//       showLens();

//       // Add quick “moving” class to reduce transition lag
//       lens.classList.add('is-moving');
//       clearTimeout(lens._t);
//       lens._t = setTimeout(() => lens.classList.remove('is-moving'), 120);
//     });

//     // Hide when leaving window
//     window.addEventListener('mouseleave', hideLens);

//     // Optional: make lens a bit bigger/smaller over the left/center/right zones
//     // If you already have .slide-zone.left/.center/.right:
//     ['left','center','right'].forEach(zone => {
//       const el = document.querySelector(`.slide-zone.${zone}`);
//       if (!el) return;
//       el.addEventListener('mouseenter', () => {
//         lens.style.width = zone === 'center' ? '400px' : '400px';
//         lens.style.height = lens.style.width;
//       });
//     });
//   })();

window.addEventListener('DOMContentLoaded', function () {
  /* =========================
   *  PASSWORD GATE
   * ========================= */
  (function initPasswordGate() {
    const modal  = document.getElementById('pw-modal');
    const input  = document.getElementById('pw-input');
    const error  = document.getElementById('pw-error');
    const locked = document.querySelector('[data-locked="true"]');
    if (!modal || !locked) return;

    const PASS = 'youngkim000';
    let dest   = locked.href;

    locked.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      input.value = '';
      error.classList.remove('visible');
      setTimeout(() => input.focus(), 50);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (input.value === PASS) {
          modal.classList.remove('active');
          window.location.href = dest;
        } else {
          error.classList.add('visible');
          input.value = '';
        }
      }
      if (e.key === 'Escape') {
        modal.classList.remove('active');
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  })();

  /* =========================
   *  THUMBNAIL TILT ON HOVER
   * ========================= */
  (function initTilt() {
    const items = document.querySelectorAll('.list-container li');
    if (!items.length) return;

    const MAX_TILT = 10;

    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.willChange = 'transform';
        item.style.transition = 'transform 0.15s ease';
      });

      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const dx   = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
        const dy   = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
        const rotY =  dx * MAX_TILT;
        const rotX = -dy * MAX_TILT;
        item.style.transition = 'transform 0.08s ease';
        item.style.transform  = `perspective(600px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.03)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transition = 'transform 0.5s ease';
        item.style.transform  = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
        setTimeout(() => { item.style.willChange = 'auto'; }, 500);
      });
    });
  })();

  /* =========================
   *  HEADER SCROLL BEHAVIOUR
   * ========================= */
  (function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  })();

  /* =========================
   *  MAIN PAGE SLIDESHOW + TOOLTIP
   * ========================= */
  (function initSlideshow() {
    const slides     = document.querySelectorAll('.slideshow-container img');
    const tooltip    = document.querySelector('.slide-tooltip');
    const centerZone = document.querySelector('.slide-zone.center');
    const leftZone   = document.querySelector('.slide-zone.left');
    const rightZone  = document.querySelector('.slide-zone.right');

    // If these don't exist, this isn't the slideshow page — bail.
    if (!slides.length || !tooltip || !centerZone || !leftZone || !rightZone) return;

    // Per-slide tooltip colors
    const tooltipFontColors = ['#000000', '#ffffff', '#f5f6ce', '#000000', '#f18523'];
    const tooltipBgColors   = ['#fff000', '#5ead52', '#248bc6', '#ffffff', '#f6eeec'];

    function updateTooltipColors(index) {
      tooltip.style.setProperty('--tt-fg', tooltipFontColors[index]);
      tooltip.style.setProperty('--tt-bg', tooltipBgColors[index]);
      // If you’re not using CSS vars, uncomment:
      // tooltip.style.color = tooltipFontColors[index];
      // tooltip.style.backgroundColor = tooltipBgColors[index];
    }

    // Slideshow state
    let current  = 0;
    let interval = null;

    const activeIndex = Array.from(slides).findIndex(s => s.classList.contains('active'));
    current = activeIndex >= 0 ? activeIndex : 0;
    if (activeIndex < 0) slides[0].classList.add('active');

    // Set initial tooltip colors
    updateTooltipColors(current);

    function showSlide(idx) {
      slides[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      updateTooltipColors(current);
    }

    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }

    function startAuto()  { interval = setInterval(nextSlide, 6000); }
    function resetAuto()  { clearInterval(interval); startAuto(); }

    leftZone.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); resetAuto(); });
    rightZone.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); resetAuto(); });

    centerZone.addEventListener('mousemove', (e) => {
      const desc = slides[current].dataset.desc || '';
      const link = slides[current].dataset.link || '#';
      tooltip.textContent = desc;
      tooltip.href = link;
      tooltip.classList.add('show');
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top  = `${e.clientY}px`;
      // colors already synced in showSlide/updateTooltipColors
    });

    centerZone.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });

    centerZone.addEventListener('click', () => {
      const link = slides[current].dataset.link;
      if (link) window.open(link, '_blank', 'noopener');
    });

    startAuto();
  })();

  /* =========================
   *  INFO PAGE: FLOATING PHOTO ON HOVER
   * ========================= */
  (function initHoverPhoto() {
    const hoverName = document.querySelector('.hover-name');
    if (!hoverName) return; // Only run on pages that have the name span

    // Create once
    const cursorImg = document.createElement('img');
    cursorImg.src = 'img/profile.jpg'; // <- your image path
    cursorImg.alt = 'Profile photo';
    cursorImg.className = 'cursor-photo';
    // Ensure it's hidden initially (in case CSS missing)
    cursorImg.style.opacity = '0';
    cursorImg.style.pointerEvents = 'none';
    cursorImg.style.position = 'fixed';
    cursorImg.style.top = '0';
    cursorImg.style.left = '0';
    cursorImg.style.transform = 'translate(-50%, -50%)';
    cursorImg.style.zIndex = '9999';
    document.body.appendChild(cursorImg);

    // Optional offset from cursor
    const OFFSET_X = 120;
    const OFFSET_Y = 120;

    function show() { cursorImg.style.opacity = '1'; }
    function hide() { cursorImg.style.opacity = '0'; }
    function move(e) {
      cursorImg.style.top  = `${e.clientY + OFFSET_Y}px`;
      cursorImg.style.left = `${e.clientX + OFFSET_X}px`;
    }

    hoverName.addEventListener('mouseenter', show);
    hoverName.addEventListener('mouseleave', hide);
    hoverName.addEventListener('mousemove', move);

    // Safety: hide on window leave
    window.addEventListener('mouseleave', hide);
  })();
});







