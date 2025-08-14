// const nameElement = document.getElementById('name');
// nameElement.addEventListener('mouseenter', () => {
//   nameElement.textContent = 'Young Kim 😉👋🏻';
// });
// nameElement.addEventListener('mouseleave', () => {
//   nameElement.textContent = 'Young Kim';
// });

// // const homeElement = document.getElementById('home');
// // homeElement.addEventListener('mouseenter', () => {
// //   homeElement.textContent = '김소영';
// // });
// // homeElement.addEventListener('mouseleave', () => {
// //   homeElement.textContent = 'Young Kim';
// // });

// const graphicElement = document.getElementById('graphic');
// graphicElement.addEventListener('mouseenter', () => {
//   graphicElement.textContent = 'graphic ✏️';
// });
// graphicElement.addEventListener('mouseleave', () => {
//   graphicElement.textContent = 'graphic';
// });

// // const uxElement = document.getElementById('ux');
// // uxElement.addEventListener('mouseenter', () => {
// //   uxElement.textContent = 'UX 📱';
// // });
// // uxElement.addEventListener('mouseleave', () => {
// //   uxElement.textContent = 'UX';
// // });

// const parsonsElement = document.getElementById('parsons');
// parsonsElement.addEventListener('mouseenter', () => {
//   parsonsElement.textContent = 'Parsons School of Design 🎓';
// });
// parsonsElement.addEventListener('mouseleave', () => {
//   parsonsElement.textContent = 'Parsons School of Design';
// });

window.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slideshow-container img');
    let current = 0;
    let interval = null;
    const tooltip = document.querySelector('.slide-tooltip');
    const centerZone = document.querySelector('.slide-zone.center');
    const leftZone = document.querySelector('.slide-zone.left');
    const rightZone = document.querySelector('.slide-zone.right');
  
    function showSlide(idx) {
      slides[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
    }
    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }
    function startAuto() { interval = setInterval(nextSlide, 6000); }
    function resetAuto() { clearInterval(interval); startAuto(); }
  
    // Cursor/click logic
    leftZone.addEventListener('click', function(e) { e.stopPropagation(); prevSlide(); resetAuto(); });
    rightZone.addEventListener('click', function(e) { e.stopPropagation(); nextSlide(); resetAuto(); });
  
    // Tooltip logic
    centerZone.addEventListener('mousemove', function(e) {
      const desc = slides[current].dataset.desc || '';
      const link = slides[current].dataset.link || '#';
      tooltip.textContent = desc;
      tooltip.href = link;
      tooltip.classList.add('show');
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top = `${e.clientY}px`;
    });
    centerZone.addEventListener('mouseleave', function() {
      tooltip.classList.remove('show');
    });
  
    // Clicking center tooltip goes to the link
    centerZone.addEventListener('click', function(e) {
      const link = slides[current].dataset.link;
      if(link) window.open(link, '_blank');
    });
  
    startAuto();
  });



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
