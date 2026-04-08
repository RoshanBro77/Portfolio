// ===== Cursor Glow Effect =====
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Hide cursor glow on mobile
if ('ontouchstart' in window) {
    cursorGlow.style.display = 'none';
}

// ===== Navigation Scroll Effect =====
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Theme Toggle =====
// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
const profileImage = document.getElementById('profileImage');

if (currentTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    profileImage.src = 'assets/profile-light.jpg';
}

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
    
    if (document.documentElement.classList.contains('light-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        profileImage.src = 'assets/profile-light.jpg';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        profileImage.src = 'assets/profile-dark.jpg';
        localStorage.setItem('theme', 'dark');
    }
});

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Card Mouse Tracking for Glow Effect =====
document.querySelectorAll('.skill-category, .project-card, .education-card, .timeline-content, .contact-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
});

// ===== Fade In Animation on Scroll =====
// Add fade-in classes to elements
const fadeElements = document.querySelectorAll(
    '.skill-category, .timeline-item, .project-card, .education-card, .contact-item, .about-text, .stat-item'
);

fadeElements.forEach(el => {
    el.classList.add('fade-in');
});

// Add stagger delays to grid items
document.querySelectorAll('.skills-grid .skill-category').forEach((el, i) => {
    el.classList.add(`stagger-${i + 1}`);
});

document.querySelectorAll('.projects-grid .project-card').forEach((el, i) => {
    el.classList.add(`stagger-${i + 1}`);
});

document.querySelectorAll('.education-grid .education-card').forEach((el, i) => {
    el.classList.add(`stagger-${i + 1}`);
});

// Add left/right animations to timeline
document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'fade-in-left' : 'fade-in-right');
    el.classList.remove('fade-in');
});

// Add scale animation to stats
document.querySelectorAll('.stat-item').forEach((el, i) => {
    el.classList.add('scale-in');
    el.classList.add(`stagger-${i + 1}`);
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

fadeElements.forEach(el => {
    observer.observe(el);
});

// ===== Active Navigation Link Highlight =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

function setActiveNav() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Observe stats for counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ===== Typing Effect for Hero (Optional Enhancement) =====
const heroRole = document.querySelector('.hero-role');
const roles = [
    'Data Analyst & System Engineer',
    'Python & SQL Developer',
    'Data Science Student',
    'System Infrastructure Specialist'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        heroRole.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        heroRole.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before next word
    }
    
    setTimeout(typeRole, typeSpeed);
}

// Start typing effect after page load
setTimeout(typeRole, 1000);

// ===== Smooth Parallax Effect =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroVisual = document.querySelector('.hero-visual');
    const heroText = document.querySelector('.hero-text');
    
    if (heroVisual && scrolled < 600) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    if (heroText && scrolled < 600) {
        heroText.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
});

// ===== Hide scroll indicator on scroll =====
const scrollIndicator = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transition = 'opacity 0.3s';
    } else {
        scrollIndicator.style.opacity = '1';
    }
});

// ===== Add subtle parallax effect to hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && scrolled < 600) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});
