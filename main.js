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
    const fills = document.querySelectorAll('.progress-fill');
    
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Reset all progress fills
    fills.forEach((fill, i) => {
        fill.style.width = i < currentSlide ? '100%' : '0%';
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
        
        // Track progress
        const updateProgress = () => {
            if (currentSlide === Array.from(slides).indexOf(activeSlide) && !video.paused) {
                const progress = (video.currentTime / video.duration) * 100;
                const fill = document.querySelectorAll('.progress-fill')[currentSlide];
                if (fill) fill.style.width = `${progress}%`;
                requestAnimationFrame(updateProgress);
            }
        };
        requestAnimationFrame(updateProgress);
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
                if (event.data === YT.PlayerState.PLAYING) {
                    updateYTProgress();
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

function updateYTProgress() {
    if (showcasePlayer && showcasePlayer.getPlayerState() === YT.PlayerState.PLAYING && currentSlide === 2) {
        const currentTime = showcasePlayer.getCurrentTime();
        const start = 2404;
        const end = 2492;
        const progress = ((currentTime - start) / (end - start)) * 100;
        const fills = document.querySelectorAll('.progress-fill');
        if (fills[2]) {
            fills[2].style.width = `${Math.min(100, Math.max(0, progress))}%`;
            requestAnimationFrame(updateYTProgress);
        }
    }
}
