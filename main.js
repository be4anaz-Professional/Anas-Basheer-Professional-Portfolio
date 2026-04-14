// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    animatedElements.forEach(el => observer.observe(el));
    
    // Initialize Video Slider
    initSlider();
    
    // Initialize Job Reports Mini-Slider
    initJobReportsSlider();
});

// Toggle CV Embed
function toggleCV() {
    const cvSection = document.getElementById('cv-section');
    if (cvSection.style.display === 'none' || cvSection.style.display === '') {
        cvSection.style.display = 'block';
        setTimeout(() => { cvSection.style.opacity = '1'; }, 10);
        cvSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        cvSection.style.opacity = '0';
        setTimeout(() => { cvSection.style.display = 'none'; }, 500);
    }
}

// Google Form Submission Logic
let submitted = false;

function showContactSuccess() {
    document.getElementById('contactForm').reset();
    const popup = document.getElementById('successPopup');
    popup.style.display = 'flex';
    setTimeout(() => { popup.classList.add('active'); }, 10);
    submitted = false;
}

function closePopup() {
    const popup = document.getElementById('successPopup');
    popup.classList.remove('active');
    setTimeout(() => { popup.style.display = 'none'; }, 300);
}

// Side Tabs Logic for Events Section
function openTab(evt, tabId) {
    const tabPanes = document.getElementsByClassName("tab-pane");
    for (let i = 0; i < tabPanes.length; i++) {
        tabPanes[i].classList.remove("active");
    }
    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// --- VIDEO SLIDER LOGIC (Instagram-Style) ---
let currentSlide = 0;
let showcasePlayer;
let ytApiReady = false;

function initSlider() {
    const slides = document.querySelectorAll('.video-slide');
    if (!slides.length) return;
    updateSlider();
}

function updateSlider() {
    const slider = document.getElementById('main-video-slider');
    const dots = document.querySelectorAll('.bullet-dot');
    
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
    
    playCurrentSlide();
}

function playCurrentSlide() {
    const slides = document.querySelectorAll('.video-slide');
    const activeSlide = slides[currentSlide];
    if (!activeSlide) return;

    const type = activeSlide.getAttribute('data-type');
    
    // Pause all native videos
    document.querySelectorAll('.slider-video').forEach(vid => {
        vid.pause();
        vid.currentTime = 0;
    });

    if (type === 'native') {
        const video = activeSlide.querySelector('.slider-video');
        video.play().catch(e => console.log("Autoplay blocked or failed", e));
        video.onended = () => moveSlide(1);
    } else if (type === 'youtube') {
        if (showcasePlayer && showcasePlayer.playVideo) {
            showcasePlayer.seekTo(2404);
            showcasePlayer.playVideo();
        }
    }
}

function moveSlide(direction) {
    const slides = document.querySelectorAll('.video-slide');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// --- JOB REPORTS MINI-SLIDER LOGIC ---
let jobReportCurrentSlide = 0;

function initJobReportsSlider() {
    const slides = document.querySelectorAll('#job-reports-slider .video-slide');
    if (!slides.length) return;
    updateJobReportsSlider();
}

function updateJobReportsSlider() {
    const slider = document.getElementById('job-reports-slider');
    const dots = document.querySelectorAll('#job-reports-bullets .bullet-dot');
    
    if (!slider) return;
    slider.style.transform = `translateX(-${jobReportCurrentSlide * 100}%)`;
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === jobReportCurrentSlide);
    });
}

function moveJobReportSlide(direction) {
    const sliderContainer = document.getElementById('job-reports-slider');
    const slides = sliderContainer.querySelectorAll('.video-slide');
    if (!slides.length) return;
    jobReportCurrentSlide = (jobReportCurrentSlide + direction + slides.length) % slides.length;
    updateJobReportsSlider();
}

function goToJobReportSlide(index) {
    jobReportCurrentSlide = index;
    updateJobReportsSlider();
}

// --- YOUTUBE API INTEGRATION ---
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let ytPlayer; // Background Player

function onYouTubeIframeAPIReady() {
    ytApiReady = true;

    // 1. Background Player (Hero)
    ytPlayer = new YT.Player('youtube-player', {
        width: '100%',
        height: '100%',
        videoId: 'CM86ikow2hM',
        playerVars: {
            'autoplay': 1, 'controls': 0, 'mute': 1, 'showinfo': 0,
            'rel': 0, 'modestbranding': 1, 'playsinline': 1, 'start': 24
        },
        events: {
            'onReady': (e) => e.target.playVideo()
        }
    });

    // 2. Showcase Slider Player
    showcasePlayer = new YT.Player('showcase-player', {
        width: '100%',
        height: '100%',
        videoId: 'd1MAPn05Aw8',
        playerVars: {
            'autoplay': 0, 'controls': 0, 'mute': 1, 'showinfo': 0,
            'rel': 0, 'modestbranding': 1, 'playsinline': 1,
            'start': 2404, 'end': 2492
        },
        events: {
            'onStateChange': (event) => {
                if (event.data === YT.PlayerState.ENDED) {
                    moveSlide(1);
                }
            }
        }
    });
    
    // Background Player Loop Logic
    setInterval(() => {
        if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
            let time = ytPlayer.getCurrentTime();
            if (time >= 80 || time < 24) {
                ytPlayer.seekTo(24);
                ytPlayer.playVideo();
            }
        }
    }, 500);
}
