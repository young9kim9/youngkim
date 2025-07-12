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
  