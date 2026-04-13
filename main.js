const navLinks = document.querySelectorAll('.ul-list li a');
const sections = document.querySelectorAll('section');

function removeActive() {
  navLinks.forEach(link => link.parentElement.classList.remove('active'));
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    window.scrollTo({
      top: targetSection.offsetTop - 80, 
      behavior: 'smooth'
    });

    removeActive();
    link.parentElement.classList.add('active');
  });
});

window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      removeActive();
      const activeLink = document.querySelector(`.ul-list li a[href="#${section.id}"]`);
      if (activeLink) activeLink.parentElement.classList.add('active');
    }
  });

  if(window.scrollY > 500){
    backToTop.style.display = "flex";
  } else {
    backToTop.style.display = "none";
  }

});

// Configure elements for AOS before initialization
document.querySelectorAll('.home-container').forEach(el => { el.setAttribute('data-aos', 'fade-in'); el.setAttribute('data-aos-duration', '1500'); });
document.querySelectorAll('.about-container').forEach(el => { el.setAttribute('data-aos', 'fade-up'); el.setAttribute('data-aos-duration', '1200'); });
document.querySelectorAll('.project-card').forEach((el, index) => { el.setAttribute('data-aos', 'fade-up'); el.setAttribute('data-aos-delay', (index * 100).toString()); });
document.querySelectorAll('.service-card').forEach((el, index) => { el.setAttribute('data-aos', 'fade-up'); el.setAttribute('data-aos-delay', (index * 100).toString()); });
document.querySelectorAll('.contact-info').forEach(el => { el.setAttribute('data-aos', 'fade-right'); el.setAttribute('data-aos-duration', '1000'); });
document.querySelectorAll('.contact-form').forEach(el => { el.setAttribute('data-aos', 'fade-left'); el.setAttribute('data-aos-duration', '1000'); });
document.querySelectorAll('.c1').forEach((el, index) => { el.setAttribute('data-aos', 'zoom-in-up'); el.setAttribute('data-aos-delay', (index * 150).toString()); });
document.querySelectorAll('h1').forEach(el => el.setAttribute('data-aos', 'fade-up'));
document.querySelectorAll('h4, h5').forEach(el => el.setAttribute('data-aos', 'fade-right'));

// Initialize AOS (Animate on Scroll)
AOS.init({
  once: true, 
  offset: 100,
});

const backToTop = document.createElement('div');
backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
backToTop.id = "back-to-top";
document.body.appendChild(backToTop);

backToTop.style.cssText = `
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #474af0;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.3s ease;
`;

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backToTop.addEventListener('mouseover', () => backToTop.style.transform = 'scale(1.2)');
backToTop.addEventListener('mouseout', () => backToTop.style.transform = 'scale(1)');

// Initialize Vanilla Tilt
VanillaTilt.init(document.querySelectorAll(".project-card, .service-card, .c1"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
});

// Custom Cursor Logic
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

document.querySelectorAll("a, button, .project-card, .service-card").forEach(el => {
    el.addEventListener("mouseenter", () => cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)");
    el.addEventListener("mouseleave", () => cursorOutline.style.transform = "translate(-50%, -50%) scale(1)");
});

const typingElement = document.querySelector('.info-home h3'); 
const words = ["Frontend Developer", "UI/UX Designer", "Web Enthusiast", "React Developer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
    const currentWord = words[wordIndex];
    let displayedText = currentWord.substring(0, charIndex);
    
    typingElement.innerHTML = displayedText + '<span class="cursor">|</span>';

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(type, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, typingSpeed / 2);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(type, 1000);
    }
}

document.addEventListener('DOMContentLoaded', type);

document.addEventListener("DOMContentLoaded", () => {
  const loadingText = document.getElementById("loading-text");
  const mainIcon = document.querySelector(".main-icon");
  const subIcons = document.querySelectorAll(".sub-icons i");
  const designerText = document.getElementById("designer-text");
  const mainPage = document.getElementById("main-page");
  const loadingScreen = document.getElementById("loading-screen");

  function showElement(element, delay=0){
    setTimeout(() => {
      element.classList.remove("hidden");
      element.classList.add("fall");
    }, delay);
  }

  showElement(loadingText, 0);          
  showElement(mainIcon, 800);         
  subIcons.forEach((icon, idx) => {
    showElement(icon, 1600 + idx*400);  
  });
  showElement(designerText, 2800);    

  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.style.display='none', 500);
    mainPage.classList.add("visible");
  }, 4000);
});
