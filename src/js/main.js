// Navigation bar logic
window.addEventListener('scroll', () => {
    // Navigation resizing
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    const screenHeight = window.innerHeight;
    const screenCenter = window.scrollY + screenHeight / 2;
    let currentSection = null;

    // Find the section that contains the center of the screen
    for (const section of document.querySelectorAll('section')) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.scrollY == 0) {
            break;
        }
        if (sectionTop <= screenCenter && screenCenter <= sectionBottom) {
            currentSection = section.id;
            break; // No need to check further sections once one is found
        }
    }

    // Highlight the corresponding link in the navigation bar
    navLinks.forEach(link => {
        const targetSectionId = link.getAttribute('href').substring(1); // Remove the "#" symbol
        if (targetSectionId === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});


const navLinks = document.querySelectorAll('nav a[href^="#"]');
const navbar = document.querySelector('header');

// Scroll to section when navbar link is clicked
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Get the computed style of the navbar's height
        const computedStyles = getComputedStyle(navbar);
        const navbarHeight = parseInt(computedStyles.height, 10);

        const sectionTop = section.offsetTop - navbarHeight; // Offset by navbar height
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Smooth scroll animation when clicking on navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSectionId = link.getAttribute('href').substring(1); // Remove the "#" symbol
        scrollToSection(targetSectionId);
    });
});


const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentSlide = 0;

function showSlide(slideIndex) {
    slides.forEach((slide) => {
        slide.style.transform = `translateX(-${100 * (slideIndex)}%)`;
    });
}

prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
    } else {
        // If the current slide is the first slide, loop back to the last slide
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
});

nextButton.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
    } else {
        // If the current slide is the last slide, loop back to the first slide
        currentSlide = 0;
    }
    showSlide(currentSlide);
});

// Show the initial slide
showSlide(currentSlide);

// JavaScript to handle modal functionality

const modalButtons = document.querySelectorAll('.modal-button');
modalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetModalId = button.getAttribute('data-target');
        const targetModal = document.getElementById(targetModalId);

        // Disable scrolling of the website content
        document.body.style.overflow = 'hidden';

        targetModal.style.display = 'block';
        scrollToSection("Portfolio");
    });
});

// Close modals when clicking outside or on close buttons
const modals = document.querySelectorAll('.modal');
modals.forEach(modal => {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';

            // Enable scrolling of the website content
            document.body.style.overflow = 'visible';
        }
    });

    const closeButton = modal.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';

            // Enable scrolling of the website content
            document.body.style.overflow = 'visible';
        });
    }
});
