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
    // Reset the form
    document.getElementById('contactForm').reset();
    
    // Show the popup
    const popup = document.getElementById('successPopup');
    popup.style.display = 'flex';
    setTimeout(() => { popup.classList.add('active'); }, 10); // Small delay to allow display flex to apply before opacity transition
    
    // Reset flag
    submitted = false;
}

function closePopup() {
    const popup = document.getElementById('successPopup');
    popup.classList.remove('active');
    setTimeout(() => { popup.style.display = 'none'; }, 300);
}

// Side Tabs Logic for Events Section
function openTab(evt, tabId) {
    // Hide all tab panes
    const tabPanes = document.getElementsByClassName("tab-pane");
    for (let i = 0; i < tabPanes.length; i++) {
        tabPanes[i].classList.remove("active");
    }
    
    // Remove active class from all buttons
    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }
    
    // Show current tab and set active class
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Precise YouTube Background Loop (Slices Intro Logos Completely)
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let ytPlayer;
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        width: '100%',
        height: '100%',
        videoId: 'CM86ikow2hM', // Highly demanding, massive network simulation demo
        playerVars: {
            'autoplay': 1, 'controls': 0, 'mute': 1, 'showinfo': 0,
            'rel': 0, 'modestbranding': 1, 'playsinline': 1, 'start': 24
        },
        events: {
            'onReady': (e) => e.target.playVideo()
        }
    });
    
    // Tightly force the loop from second 24 to second 80 (pure mass-scale traffic simulation)
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
