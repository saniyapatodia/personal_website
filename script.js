// Cursor tracking and image effects
let mouseX = 0;
let mouseY = 0;
let cursorImages = [];
let activeImageIndex = 0;
let lastImageSpawn = 0;
let imageSpawnInterval = 300; // milliseconds between image spawns
let maxActiveImages = 1; // Only 1 image at a time
let lastShownImageIndex = -1; // Track last shown image to ensure different image
let lastMouseX = 0;
let lastMouseY = 0;
let mouseMoveThreshold = 50; // Minimum pixel movement to trigger new image
let lastScrollY = 0;
let scrollThreshold = 30; // Minimum scroll distance to trigger new image
let imageSequenceIndex = 0; // Track sequence for cycling through images
let cursorInteractionMode = 'follow'; // Options: 'trail', 'orbit', 'follow', 'grid', 'ahead'
let mouseVelocityX = 0;
let mouseVelocityY = 0;
let lastMouseTime = Date.now();
let popupShowCount = 0; // Track how many times popup has been shown
const maxPopupShows = 3; // Show popup only first 3 times

// Custom cursor element
let customCursor = null;

// Initialize cursor images
document.addEventListener('DOMContentLoaded', () => {
    cursorImages = document.querySelectorAll('.cursor-img');
    
    // Create additional image elements for more variety
    createAdditionalImages();
    
    // Create custom cursor
    createCustomCursor();
    
        // Update custom cursor position
        document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        const timeDelta = now - lastMouseTime;
        
        // Calculate mouse velocity for direction-based effects
        mouseVelocityX = (e.clientX - mouseX) / (timeDelta || 1) * 16;
        mouseVelocityY = (e.clientY - mouseY) / (timeDelta || 1) * 16;
        
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Calculate mouse movement distance
        const deltaX = Math.abs(mouseX - lastMouseX);
        const deltaY = Math.abs(mouseY - lastMouseY);
        const mouseDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Update custom cursor position
        if (customCursor) {
            customCursor.style.left = mouseX + 'px';
            customCursor.style.top = mouseY + 'px';
        }
        
        // Only show images on landing page and when hovering over top part
        const landing = document.getElementById('landing');
        const isLandingPage = landing && landing.style.display !== 'none' && !landing.classList.contains('hidden');
        
        // Check if cursor is in top half of landing page
        let isInTopHalf = false;
        if (isLandingPage && landing) {
            const landingRect = landing.getBoundingClientRect();
            const topHalfHeight = landingRect.height / 2;
            const relativeY = mouseY - landingRect.top;
            isInTopHalf = relativeY <= topHalfHeight;
        }
        
        // Show a different image when cursor moves significantly (only in top half of landing page)
        const activeCount = document.querySelectorAll('.cursor-img.active').length;
        
        if (isLandingPage && isInTopHalf && 
            mouseDistance > mouseMoveThreshold && 
            now - lastImageSpawn > imageSpawnInterval && 
            activeCount === 0) {
            showImageBasedOnMode();
            lastImageSpawn = now;
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        } else if (!isLandingPage || !isInTopHalf) {
            // Hide all images if not on landing page or not in top half
            document.querySelectorAll('.cursor-img.active').forEach(img => {
                // Fade out smoothly when cursor leaves
                img.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                img.style.transform = 'translate(-50%, -50%) scale(0.95)';
                img.style.opacity = '0';
                
                setTimeout(() => {
                    img.classList.remove('active');
                    img.style.transform = 'translate(0, 0) scale(0)';
                    img.style.opacity = '0';
                }, 500);
            });
        }
        
        lastMouseTime = now;
        
        // Update existing active images
        updateCursorImages();
    });
    
    // Initialize icon card interactions
    initIconCards();
    
    // Add hover effects to interactive elements
    addHoverEffects();
    
    // Draw web connections
    drawWebConnections();
    
    // Add scroll event listener for sequential image display
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Only show images on landing page when hovering over name (disable scroll trigger)
        // Scroll-based images are disabled - only hover over name triggers images
    });
    
    // Test: Show an image after a short delay to verify it's working
    setTimeout(() => {
        if (cursorImages.length > 0) {
            mouseX = window.innerWidth / 2;
            mouseY = window.innerHeight / 2;
            showRandomCursorImage();
        }
    }, 1000);
});

// Draw connecting lines between icon cards
function drawWebConnections() {
    const svg = document.querySelector('.web-connections');
    if (!svg) return;
    
    // Clear existing lines
    svg.innerHTML = '';
    
    const cards = document.querySelectorAll('.icon-card');
    const cardPositions = [];
    
    // Get positions of all cards
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const containerRect = document.querySelector('.landing-content').getBoundingClientRect();
        const x = ((rect.left + rect.width / 2 - containerRect.left) / containerRect.width) * 100;
        const y = ((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 100;
        cardPositions.push({ x, y, card });
    });
    
    // Draw lines connecting all cards to each other
    for (let i = 0; i < cardPositions.length; i++) {
        for (let j = i + 1; j < cardPositions.length; j++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'connection-line');
            line.setAttribute('x1', cardPositions[i].x);
            line.setAttribute('y1', cardPositions[i].y);
            line.setAttribute('x2', cardPositions[j].x);
            line.setAttribute('y2', cardPositions[j].y);
            line.style.transition = 'none';
            line.style.animation = 'none';
            svg.appendChild(line);
        }
    }
    
    // Update on resize (debounced)
    let resizeTimeout;
    if (!window.webConnectionsResizeHandler) {
        window.webConnectionsResizeHandler = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(drawWebConnections, 200);
        };
        window.addEventListener('resize', window.webConnectionsResizeHandler);
    }
}

// Create custom cursor
function createCustomCursor() {
    customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    document.body.appendChild(customCursor);
    
    // Update cursor size on hover
    const interactiveElements = document.querySelectorAll('a, button, .icon-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (customCursor) {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (customCursor) {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    });
}

// Add hover effects
function addHoverEffects() {
    const cards = document.querySelectorAll('.icon-card, .about-item, .goal-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Spawn multiple images on hover
            for (let i = 0; i < 2; i++) {
                setTimeout(() => showRandomCursorImage(), i * 200);
            }
        });
    });
}

// Photo paths - Your photos! (21 photos total)
const photoPaths = [
    'images/IMG_0267.jpeg',
    'images/IMG_0268.jpeg',
    'images/IMG_0637.jpeg',
    'images/IMG_1010.jpeg',
    'images/IMG_1447.jpeg',
    'images/IMG_1807.jpeg',
    'images/IMG_1815.jpeg',
    'images/IMG_1857.jpeg',
    'images/IMG_1966.jpeg',
    'images/IMG_2143.jpeg',
    'images/IMG_2319.jpeg',
    'images/IMG_2369.jpeg',
    'images/IMG_2489.jpeg',
    'images/IMG_2927.jpeg',
    'images/IMG_2929.jpeg',
    'images/IMG_3525.jpeg',
    'images/IMG_3614.jpeg',
    'images/IMG_5018.jpeg',
    'images/IMG_7422.jpeg',
    'images/IMG_9754.jpeg',
    'images/IMG_9965.jpeg'
];

// Popup message
const popupMessage = "moments from my journey";
const memoriesMessage = "some moments from journey";

// Create additional image elements
function createAdditionalImages() {
    const container = document.querySelector('.cursor-images');
    if (!container) return;
    
    // Create image elements for each photo
    for (let i = 0; i < photoPaths.length; i++) {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'cursor-img';
        imgDiv.setAttribute('data-img', (i + 1).toString());
        
        // Create img element inside
        const img = document.createElement('img');
        img.src = photoPaths[i];
        img.alt = 'Life photo';
        img.loading = 'lazy';
        
        // Fallback gradient if image fails to load
        imgDiv.style.background = 'linear-gradient(135deg, #2a2a2a, #1a1a1a)';
        
        img.onerror = function() {
            // If image fails to load, hide the img and show gradient
            this.style.display = 'none';
        };
        
        img.onload = function() {
            // If image loads successfully, hide the gradient background
            imgDiv.style.background = 'none';
        };
        
        imgDiv.appendChild(img);
        imgDiv.style.width = (200 + Math.random() * 60) + 'px';
        imgDiv.style.height = (200 + Math.random() * 60) + 'px';
        container.appendChild(imgDiv);
    }
    
    cursorImages = document.querySelectorAll('.cursor-img');
    console.log(`Created ${cursorImages.length} cursor image elements from ${photoPaths.length} photos`);
    
    // Test: Show first image immediately for debugging
    if (cursorImages.length > 0) {
        console.log('Images ready! Move your mouse to see them appear.');
    }
}

// Show popup message (only first 3 times)
function showPopupMessage(x, y) {
    // Only show popup first 3 times
    if (popupShowCount >= maxPopupShows) {
        return;
    }
    
    popupShowCount++;
    
    // Remove existing popup if any
    const existingPopup = document.querySelector('.photo-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'photo-popup';
    popup.textContent = memoriesMessage;
    popup.style.left = x + 'px';
    popup.style.top = (y - 40) + 'px';
    document.body.appendChild(popup);
    
    // Smooth animate in
    requestAnimationFrame(() => {
        popup.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, 0) scale(1)';
    });
    
    // Remove after delay with smooth fade out
    setTimeout(() => {
        popup.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -10px) scale(0.95)';
        setTimeout(() => popup.remove(), 400);
    }, 1800);
}

// Show next image in sequence (for scrolling)
function showNextImageInSequence() {
    // Make sure cursorImages is initialized
    if (!cursorImages || cursorImages.length === 0) {
        cursorImages = document.querySelectorAll('.cursor-img');
    }
    
    // If there's already an active image, don't show another one
    const activeImages = Array.from(cursorImages).filter(img => img.classList.contains('active'));
    if (activeImages.length > 0) {
        return;
    }
    
    // Cycle through images in sequence
    if (cursorImages.length === 0) return;
    
    const img = cursorImages[imageSequenceIndex % cursorImages.length];
    imageSequenceIndex++;
    lastShownImageIndex = parseInt(img.getAttribute('data-img')) - 1;
    
    // Show the image
    showImage(img);
}

// Show image based on interaction mode
function showImageBasedOnMode() {
    switch(cursorInteractionMode) {
        case 'trail':
            showImageInTrail();
            break;
        case 'orbit':
            showImageInOrbit();
            break;
        case 'follow':
            showImageFollowing();
            break;
        case 'grid':
            showImageInGrid();
            break;
        case 'ahead':
            showImageAhead();
            break;
        default:
            showRandomCursorImage();
    }
}

// Trail mode: Images appear behind cursor
function showImageInTrail() {
    const offsetX = -mouseVelocityX * 2; // Behind cursor
    const offsetY = -mouseVelocityY * 2;
    const tempX = mouseX + offsetX;
    const tempY = mouseY + offsetY;
    const originalX = mouseX;
    const originalY = mouseY;
    mouseX = tempX;
    mouseY = tempY;
    showRandomCursorImage();
    mouseX = originalX;
    mouseY = originalY;
}

// Orbit mode: Images appear in a circle around cursor
function showImageInOrbit() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 150 + Math.random() * 100;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;
    const tempX = mouseX + offsetX;
    const tempY = mouseY + offsetY;
    const originalX = mouseX;
    const originalY = mouseY;
    mouseX = tempX;
    mouseY = tempY;
    showRandomCursorImage();
    mouseX = originalX;
    mouseY = originalY;
}

// Follow mode: Images appear at cursor position
function showImageFollowing() {
    showRandomCursorImage();
}

// Grid mode: Images snap to grid positions relative to cursor
function showImageInGrid() {
    const gridSize = 200;
    const gridX = Math.round(mouseX / gridSize) * gridSize;
    const gridY = Math.round(mouseY / gridSize) * gridSize;
    const offsetX = (Math.random() - 0.5) * gridSize * 0.5;
    const offsetY = (Math.random() - 0.5) * gridSize * 0.5;
    const tempX = gridX + offsetX;
    const tempY = gridY + offsetY;
    const originalX = mouseX;
    const originalY = mouseY;
    mouseX = tempX;
    mouseY = tempY;
    showRandomCursorImage();
    mouseX = originalX;
    mouseY = originalY;
}

// Ahead mode: Images appear ahead of cursor direction
function showImageAhead() {
    const speed = Math.sqrt(mouseVelocityX * mouseVelocityX + mouseVelocityY * mouseVelocityY);
    const normalizedX = mouseVelocityX / (speed || 1);
    const normalizedY = mouseVelocityY / (speed || 1);
    const distance = 150 + Math.random() * 100;
    const offsetX = normalizedX * distance;
    const offsetY = normalizedY * distance;
    const tempX = mouseX + offsetX;
    const tempY = mouseY + offsetY;
    const originalX = mouseX;
    const originalY = mouseY;
    mouseX = tempX;
    mouseY = tempY;
    showRandomCursorImage();
    mouseX = originalX;
    mouseY = originalY;
}

// Show random cursor image (different from last one)
function showRandomCursorImage() {
    // Make sure cursorImages is initialized
    if (!cursorImages || cursorImages.length === 0) {
        cursorImages = document.querySelectorAll('.cursor-img');
    }
    
    // If there's already an active image, don't show another one
    const activeImages = Array.from(cursorImages).filter(img => img.classList.contains('active'));
    if (activeImages.length > 0) {
        return;
    }
    
    // Find an inactive image
    const inactiveImages = Array.from(cursorImages).filter(img => !img.classList.contains('active'));
    
    if (inactiveImages.length === 0) {
        return;
    }
    
    // Get available indices
    const availableIndices = inactiveImages.map((img, idx) => {
        const dataImg = parseInt(img.getAttribute('data-img')) - 1;
        return { element: img, index: dataImg };
    });
    
    // Filter out the last shown image to ensure it's different
    let candidates = availableIndices;
    if (lastShownImageIndex >= 0 && availableIndices.length > 1) {
        candidates = availableIndices.filter(item => item.index !== lastShownImageIndex);
    }
    
    // If no candidates (only one image available), use all available
    if (candidates.length === 0) {
        candidates = availableIndices;
    }
    
    // Pick a random candidate
    const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
    const img = randomCandidate.element;
    lastShownImageIndex = randomCandidate.index;
    
    // Show the image
    showImage(img);
}

// Show image function (shared by both random and sequential)
function showImage(img) {
    // Check if we're on landing page
    const landing = document.getElementById('landing');
    const isLandingPage = landing && landing.style.display !== 'none' && !landing.classList.contains('hidden');
    if (!isLandingPage) return;
    
    // Constrain to upper half of the page, around name area
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const maxX = pageWidth; // Can use full width
    const maxY = pageHeight / 2; // Upper half only
    const nameTitle = document.querySelector('.name-title');
    const nameRect = nameTitle ? nameTitle.getBoundingClientRect() : null;
    
    // Position around name area in upper half
    let randomX, randomY;
    let attempts = 0;
    
    if (nameRect) {
        // Position around the name area
        const nameCenterX = nameRect.left + nameRect.width / 2;
        const nameCenterY = nameRect.top + nameRect.height / 2;
        const radius = 200; // Distance from name center
        
        do {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * radius;
            randomX = nameCenterX + Math.cos(angle) * distance;
            randomY = nameCenterY + Math.sin(angle) * distance;
            attempts++;
        } while (
            attempts < 20 &&
            (randomY > maxY || randomY < 50 || randomX < 50 || randomX > maxX - 50)
        );
    } else {
        // Fallback: random in upper half
        randomX = 100 + Math.random() * (maxX - 200);
        randomY = 100 + Math.random() * (maxY - 200);
    }
    
    // Ensure it's in upper half and not too close to edges
    randomX = Math.max(100, Math.min(randomX, maxX - 100));
    randomY = Math.max(100, Math.min(randomY, maxY - 100));
    
    // Show popup message
    showPopupMessage(mouseX, mouseY);
    
    // Activate image
    img.classList.add('active');
    img.style.left = randomX + 'px';
    img.style.top = randomY + 'px';
    img.style.transform = 'translate(-50%, -50%) scale(0)';
    img.style.opacity = '0';
    
    // Smooth animate in
    requestAnimationFrame(() => {
        img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        img.style.transform = 'translate(-50%, -50%) scale(1)';
        img.style.opacity = '0.4';
    });
    
    // Store timeout ID so we can cancel it if cursor moves
    img._fadeTimeout = null;
}

// Update cursor images position based on mode
function updateCursorImages() {
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const maxY = pageHeight / 2; // Upper half only
    
    cursorImages.forEach((img, index) => {
        if (img.classList.contains('active')) {
            if (cursorInteractionMode === 'orbit') {
                // Orbit animation (constrained to upper half)
                const time = Date.now() / 1000;
                const radius = 120;
                const angle = time * 0.5 + index;
                const offsetX = Math.cos(angle) * radius;
                const offsetY = Math.sin(angle) * radius;
                
                let newX = mouseX + offsetX;
                let newY = mouseY + offsetY;
                // Keep in upper half
                if (newX < 50) newX = 50;
                if (newX > pageWidth - 50) newX = pageWidth - 50;
                if (newY > maxY) newY = maxY - 50;
                if (newY < 50) newY = 50;
                
                img.style.left = newX + 'px';
                img.style.top = newY + 'px';
            } else if (cursorInteractionMode === 'follow') {
                // Follow cursor smoothly (constrained to upper half)
                const currentLeft = parseFloat(img.style.left) || mouseX;
                const currentTop = parseFloat(img.style.top) || mouseY;
                
                let targetX = mouseX;
                let targetY = mouseY;
                // Keep in upper half
                if (targetX < 50) targetX = 50;
                if (targetX > pageWidth - 50) targetX = pageWidth - 50;
                if (targetY > maxY) targetY = maxY - 50;
                if (targetY < 50) targetY = 50;
                
                img.style.left = (currentLeft + (targetX - currentLeft) * 0.15) + 'px';
                img.style.top = (currentTop + (targetY - currentTop) * 0.15) + 'px';
            } else {
                // Subtle floating animation (stay in upper half)
                const time = Date.now() / 1000;
                const offsetX = Math.sin(time + index) * 10;
                const offsetY = Math.cos(time + index) * 10;
                
                const currentLeft = parseFloat(img.style.left) || 0;
                const currentTop = parseFloat(img.style.top) || 0;
                
                let newX = currentLeft + offsetX * 0.1;
                let newY = currentTop + offsetY * 0.1;
                // Keep in upper half
                if (newX < 50) newX = 50;
                if (newX > pageWidth - 50) newX = pageWidth - 50;
                if (newY > maxY) newY = maxY - 50;
                if (newY < 50) newY = 50;
                
                img.style.left = newX + 'px';
                img.style.top = newY + 'px';
            }
        }
    });
}

// Initialize icon card click handlers
function initIconCards() {
    const iconCards = document.querySelectorAll('.icon-card');
    
    iconCards.forEach(card => {
        card.addEventListener('click', () => {
            const section = card.getAttribute('data-section');
            showSection(section);
        });
        
        // Add hover effect with cursor images
        card.addEventListener('mouseenter', () => {
            showCursorImageOnHover(card);
        });
    });
}

// Show cursor image on hover
function showCursorImageOnHover(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const randomImg = cursorImages[Math.floor(Math.random() * cursorImages.length)];
    randomImg.classList.add('active');
    randomImg.style.left = centerX + 'px';
    randomImg.style.top = centerY + 'px';
    randomImg.style.transform = 'translate(-50%, -50%) scale(1)';
    
    setTimeout(() => {
        randomImg.classList.remove('active');
        randomImg.style.transform = 'translate(0, 0) scale(0)';
    }, 1500);
}

// Show section
function showSection(sectionId) {
    // Hide landing
    const landing = document.getElementById('landing');
    landing.style.display = 'none';
    
    // Hide all cursor images when leaving landing page
    document.querySelectorAll('.cursor-img.active').forEach(img => {
        img.classList.remove('active');
        img.style.opacity = '0';
        img.style.transform = 'translate(0, 0) scale(0)';
    });
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Scroll back to landing
function scrollToLanding() {
    const landing = document.getElementById('landing');
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach(s => s.classList.remove('active'));
    landing.style.display = 'flex';
    landing.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Enhanced cursor effects on mouse move
let lastMouseMove = Date.now();
let particleCount = 0;
const maxParticles = 20;

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    
    // Create floating particles occasionally (less frequent to avoid clutter)
    if (now - lastMouseMove > 150 && Math.random() > 0.97 && particleCount < maxParticles) {
        createFloatingParticle(e.clientX, e.clientY);
        lastMouseMove = now;
        particleCount++;
    }
});

// Create floating particles
function createFloatingParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9997';
    particle.style.opacity = '0.8';
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    let posX = x;
    let posY = y;
    let opacity = 0.8;
    
    const animate = () => {
        posX += vx;
        posY += vy;
        opacity -= 0.02;
        
        particle.style.left = posX + 'px';
        particle.style.top = posY + 'px';
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
            particleCount = Math.max(0, particleCount - 1);
        }
    };
    
    animate();
}

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

