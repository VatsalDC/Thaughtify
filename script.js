// Store cleanup functions
const cleanup = {
    timeouts: [],
    eventListeners: []
};

// Function to clean up resources
function cleanupResources() {
    // Clear all pending timeouts
    cleanup.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    cleanup.timeouts = [];
    
    // Remove all event listeners
    cleanup.eventListeners.forEach(({ element, event, handler }) => {
        if (element && element.removeEventListener) {
            element.removeEventListener(event, handler);
        }
    });
    cleanup.eventListeners = [];
}

// Add timeout to cleanup
function safeSetTimeout(callback, delay) {
    const id = setTimeout(() => {
        callback();
        // Remove the timeout ID after it executes
        cleanup.timeouts = cleanup.timeouts.filter(timeoutId => timeoutId !== id);
    }, delay);
    cleanup.timeouts.push(id);
    return id;
}

// Add event listener with cleanup
function addEventListenerWithCleanup(element, event, handler) {
    element.addEventListener(event, handler);
    cleanup.eventListeners.push({ element, event, handler });
}

// Simple debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = safeSetTimeout(later, wait);
    };
}

// Initialize UI components
function initializeUI() {
    // Initialize any additional UI components
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            console.log('Toggling navigation menu...');
            // Add your toggle logic here
        });
    }
    console.log('UI initialization complete');
}

// Initialize defaultThoughts if not already defined
if (typeof window.defaultThoughts === 'undefined') {
    window.defaultThoughts = [];
    console.log('Waiting for shared-thoughts.js to load...');
}

// Initialize the application
function init() {
    console.log('Initializing application...');
    loadThoughts();
    
    // Add event listeners for navigation
    document.addEventListener('DOMContentLoaded', function() {
        // Existing navigation code
    });
    
    // Handle window resize to update mobile behavior
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateMobileCardBehavior, 250);
    });
}

// Update card click behavior based on screen size
function updateMobileCardBehavior() {
    const isMobile = window.innerWidth <= 768;
    const cards = document.querySelectorAll('.thought-card');
    
    cards.forEach(card => {
        // Remove all existing click handlers
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Add click handler if on mobile
        if (isMobile) {
            newCard.style.cursor = 'pointer';
            const thoughtId = newCard.getAttribute('data-thought-id');
            if (thoughtId) {
                const thought = window.thoughts.find(t => t.id === thoughtId);
                if (thought) {
                    newCard.addEventListener('click', () => showThoughtPopup(
                        thought,
                        thought.category || 'Uncategorized',
                        formatTime(thought.timestamp)
                    ));
                }
            }
        }
    });
}

// Make initializeApp globally available
window.initializeApp = function() {
    console.log('Initializing app...');
    init();
};

// Disable reset functionality
function resetToDefaultThoughts() {
    alert('Thoughts can only be managed by editing the shared-thoughts.js file.');
    return false;
}

// Thoughts data that only reads from shared-thoughts.js
const thoughtsData = {
    thoughts: [],
    nextId: 1
};

// Function to update nextId based on loaded thoughts
function updateNextId() {
    if (window.defaultThoughts && window.defaultThoughts.length > 0) {
        const maxId = Math.max(...window.defaultThoughts.map(t => {
            const id = parseInt(t.id);
            return isNaN(id) ? 0 : id;
        }));
        thoughtsData.nextId = maxId + 1;
    } else {
        thoughtsData.nextId = 1;
    }
}

// Scroll animation removed as per user request

// Initialize search and sort functionality
function initializeSearchAndSort() {
    // Search input with debounce for better performance
    const searchInput = document.getElementById('search-thoughts');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            // Clear previous timeout to avoid multiple rapid renders
            clearTimeout(searchTimeout);
            
            // Use a small timeout to prevent excessive re-renders during typing
            searchTimeout = setTimeout(() => {
                renderThoughts();
            }, 50); // Small delay for better performance during typing
        });
    }

    // Initialize sort dropdown
    const sortSelect = document.getElementById('sort-thoughts');
    const sortCustomSelect = sortSelect ? sortSelect.closest('.custom-select') : null;
    const sortSelectedOption = sortCustomSelect ? sortCustomSelect.querySelector('.selected-option') : null;
    
    // Initialize category dropdown
    const categorySelect = document.getElementById('category-filter');
    const categoryCustomSelect = categorySelect ? categorySelect.closest('.custom-select') : null;
    const categorySelectedOption = categoryCustomSelect ? categoryCustomSelect.querySelector('.selected-option') : null;
    
    // Set initial selected values
    if (sortSelect && sortSelectedOption) {
        const initialSortOption = sortSelect.querySelector('option:checked');
        if (initialSortOption) {
            sortSelectedOption.textContent = initialSortOption.textContent;
        }
    }
    
    if (categorySelect && categorySelectedOption) {
        const initialCategoryOption = categorySelect.querySelector('option:checked');
        if (initialCategoryOption) {
            categorySelectedOption.textContent = initialCategoryOption.textContent;
        }
    }
    
    // Function to handle dropdown toggle
    function setupDropdown(select, customSelect, selectedOption) {
        if (!select || !customSelect || !selectedOption) return;
        
        // Toggle dropdown on click
        selectedOption.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = customSelect.classList.toggle('open');
            
            // Close other open dropdowns
            document.querySelectorAll('.custom-select').forEach(selectEl => {
                if (selectEl !== customSelect) {
                    selectEl.classList.remove('open');
                }
            });
            
            if (isOpen) {
                // Add click outside handler
                const handleClickOutside = (e) => {
                    if (!customSelect.contains(e.target)) {
                        customSelect.classList.remove('open');
                        document.removeEventListener('click', handleClickOutside);
                    }
                };
                setTimeout(() => document.addEventListener('click', handleClickOutside));
            }
        });
    }
    
    // Setup both dropdowns
    setupDropdown(sortSelect, sortCustomSelect, sortSelectedOption);
    setupDropdown(categorySelect, categoryCustomSelect, categorySelectedOption);
    
    // Handle option selection for both dropdowns
    document.addEventListener('click', function(e) {
        const option = e.target.closest('.option');
        if (!option) return;
        
        const customSelect = option.closest('.custom-select');
        if (!customSelect) return;
        
        const select = customSelect.querySelector('select');
        const selectedOption = customSelect.querySelector('.selected-option');
        
        if (select && selectedOption) {
            const value = option.getAttribute('data-value');
            select.value = value;
            selectedOption.textContent = option.textContent;
            
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
            
            // Close the dropdown
            customSelect.classList.remove('open');
        }
    });
    
    // Handle sort change
    if (sortSelect) {
        sortSelect.style.display = 'block';
        sortSelect.addEventListener('change', function() {
            console.log('Sorting by:', this.value);
            renderThoughts();
        });
    }
    
    // Handle category change
    if (categorySelect) {
        categorySelect.style.display = 'block';
        categorySelect.addEventListener('change', function() {
            console.log('Category selected:', this.value);
            renderThoughts();
        });
    }
    
    // Close dropdowns when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('open');
            });
        }
    });
}

// Filter thoughts based on search and category
function filterThoughts(thoughts) {
    const searchInput = document.getElementById('search-thoughts');
    const categorySelect = document.getElementById('category-filter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCategory = categorySelect ? categorySelect.value : 'all';
    
    return thoughts.filter(thought => {
        // Apply category filter
        if (selectedCategory !== 'all') {
            // Split categories by comma and trim whitespace, then check if any match the selected category
            const categories = thought.category 
                ? thought.category.split(',').map(cat => cat.trim())
                : [];
                
            if (!categories.includes(selectedCategory)) {
                return false;
            }
        }
        
        // Apply search term filter if present
        if (searchTerm) {
            const searchInTitle = thought.title ? thought.title.toLowerCase().includes(searchTerm) : false;
            const searchInContent = thought.content ? thought.content.toLowerCase().includes(searchTerm) : false;
            const searchInCategory = thought.category ? thought.category.toLowerCase().includes(searchTerm) : false;
            
            return searchInTitle || searchInContent || searchInCategory;
        }
        
        return true;
    });
}

// Sort thoughts based on selected option
function sortThoughts(thoughts) {
    const sortSelect = document.getElementById('sort-thoughts');
    if (!sortSelect) return thoughts;
    
    const sortBy = sortSelect.value;
    
    return [...thoughts].sort((a, b) => {
        switch(sortBy) {
            case 'date-asc':
                return new Date(a.timestamp) - new Date(b.timestamp);
            case 'likes':
                return (b.likes || 0) - (a.likes || 0);
            case 'date-desc':
            default:
                return new Date(b.timestamp) - new Date(a.timestamp);
        }
    });
}

// Mobile menu toggle functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a menu item
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

// Handle responsive menu
function handleResponsiveMenu() {
    const menu = document.querySelector('.menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (window.innerWidth <= 768) {
        navToggle.style.display = 'block';
        if (!menu.classList.contains('mobile-initialized')) {
            menu.classList.add('mobile-initialized');
        }
    } else {
        navToggle.style.display = 'none';
        menu.classList.remove('active');
        navToggle.classList.remove('active');
    }
}

// Load thoughts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeSearchAndSort();
    loadThoughts();

    // Initialize mobile menu
    initMobileMenu();

    // Handle responsive menu on resize with debounce
    const debouncedHandleResize = debounce(handleResponsiveMenu, 100);
    addEventListenerWithCleanup(window, 'resize', debouncedHandleResize);
    handleResponsiveMenu(); // Initial call

    // Remove any add thought buttons from the UI
    document.querySelectorAll('.add-thought-btn').forEach(btn => btn.remove());
});

// Clean up on page unload
window.addEventListener('beforeunload', cleanupResources);
window.addEventListener('unload', cleanupResources);

// Simple debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = safeSetTimeout(later, wait);
    };
}

// Show loading state in the thoughts container
function showLoadingState() {
    const container = document.getElementById('thoughts-container');
    if (container) {
        container.innerHTML = `
            <div class="container-loading">
                <div class="spinner"></div>
                <div class="loading-text">Loading thoughts...</div>
            </div>`;
    }
}

// Function to update the last updated timestamp
function updateLastUpdatedTime() {
    if (!window.defaultThoughts || !window.defaultThoughts.length) return;
    
    // Find the thought with the most recent timestamp
    const mostRecent = window.defaultThoughts.reduce((latest, thought) => {
        const currentTime = new Date(thought.timestamp).getTime();
        const latestTime = latest ? new Date(latest.timestamp).getTime() : 0;
        return currentTime > latestTime ? thought : latest;
    }, null);
    
    if (mostRecent) {
        const lastUpdated = new Date(mostRecent.timestamp);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const timeElement = document.getElementById('last-updated-time');
        if (timeElement) {
            timeElement.textContent = lastUpdated.toLocaleString('en-US', options);
        }
    }
}

// Load thoughts from shared-thoughts.js
function loadThoughts() {
    console.log('Loading thoughts from shared-thoughts.js...');
    
    // Show loading state
    showLoadingState();
    
    // Use a small timeout to ensure the loading state is visible
    safeSetTimeout(() => {
        try {
            // Ensure defaultThoughts is an array
            if (!Array.isArray(window.defaultThoughts)) {
                console.error('defaultThoughts is not an array:', window.defaultThoughts);
                window.defaultThoughts = [];
            }
            
            // Only use thoughts from shared-thoughts.js
            thoughtsData.thoughts = [...window.defaultThoughts];
            cachedThoughts = [...window.defaultThoughts]; // Cache the thoughts
            
            console.log(`Loaded ${thoughtsData.thoughts.length} thoughts from shared-thoughts.js`);
            
            // Update the next available ID (for reference only, since adding is disabled)
            updateNextId();
            
            // Update the last updated time
            updateLastUpdatedTime();
            
            // Render the thoughts
            renderThoughts();
            
        } catch (error) {
            console.error('Error loading thoughts:', error);
            
            // Fallback to empty array if there's an error
            thoughtsData.thoughts = [];
            cachedThoughts = [];
            updateNextId();
            
            const container = document.getElementById('thoughts-container');
            if (container) {
                container.innerHTML = `
                    <div class="error">
                        <p>Error loading thoughts. Please refresh the page.</p>
                        <button onclick="loadThoughts()" class="refresh-btn">Retry</button>
                    </div>`;
            }
        }
    }, 50); // Small delay to ensure the loading state is visible
}

// Save thoughts function (disabled in read-only mode)
function saveThoughts() {
    console.log('Saving thoughts is disabled in read-only mode. All thoughts are managed through the shared-thoughts.js file.');
    // No operation - saving is disabled
}

// Format date and time from timestamp (DD Month YYYY, HH:MM:SS)
// Converts IST to user's local timezone
function formatTime(timestamp) {
    if (!timestamp) return '';
    
    try {
        // Create date object (assumes the timestamp is in IST)
        let date = new Date(timestamp);
        
        // If the timestamp is in ISO format without timezone, it's treated as UTC
        // So we need to convert from UTC to IST first, then to local time
        if (timestamp.endsWith('Z') || timestamp.includes('+') || timestamp.includes('T')) {
            // If it's already in ISO format with Z, remove Z and add +05:30 for IST
            const istTimestamp = timestamp.endsWith('Z') 
                ? timestamp.slice(0, -1) + '+05:30' 
                : timestamp;
            date = new Date(istTimestamp);
        }
        
        if (isNaN(date.getTime())) return '';
        
        // Convert to local time
        const localDate = new Date(date);
        
        // Format date parts
        const day = localDate.getDate().toString().padStart(2, '0');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const month = monthNames[localDate.getMonth()];
        const year = localDate.getFullYear();
        
        // Format time parts in 12-hour format with AM/PM
        let hours = localDate.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        const minutes = localDate.getMinutes().toString().padStart(2, '0');
        const seconds = localDate.getSeconds().toString().padStart(2, '0');
        
        return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm} (${getTimeZoneAbbr()})`;
    } catch (e) {
        console.error('Error formatting date and time:', e);
        return '';
    }
}

// Helper function to get timezone abbreviation (e.g., IST, EST, PST)
function getTimeZoneAbbr() {
    try {
        const date = new Date();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timeZoneAbbr = new Intl.DateTimeFormat('en', { 
            timeZone,
            timeZoneName: 'short' 
        }).formatToParts(date).find(part => part.type === 'timeZoneName').value;
        return timeZoneAbbr || '';
    } catch (e) {
        return '';
    }
}

// Function to create thought card
function createThoughtCard(thought) {
    const thoughtCard = document.createElement('article');
    thoughtCard.className = 'thought-card';
    
    // Store thought data as data attributes
    const formattedTime = formatTime(thought.timestamp);
    const category = thought.category || 'Uncategorized';
    const content = thought.content || '';
    
    if (window.innerWidth <= 768) {
        // Mobile view with popup functionality - metadata will be shown in popup only
        thoughtCard.innerHTML = `
            <div class="card-content">
                <div class="card-content-inner">
                    <div class="card-main-content">
                        <h2>${thought.title}</h2>
                        <div class="card-text">
                            ${content.split('\n').slice(0, 3).map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
                            ${content.split('\n').length > 3 ? '<p>...</p>' : ''}
                        </div>
                    </div>
                    <!-- Metadata container (hidden on card, shown in popup) -->
                    <div class="card-metadata" style="display: none;">
                        <div class="metadata-row">
                            <span class="metadata-item">${category}</span>
                            <span class="metadata-item">${thought.addedBy || 'Anonymous'}</span>
                        </div>
                        ${formattedTime ? `<div class="metadata-item">${formattedTime}</div>` : ''}
                    </div>
                </div>
            </div>
            <button class="close-popup" aria-label="Close">&times;</button>
        `;
    } else {
        // Original desktop view
        thoughtCard.innerHTML = `
            <div class="thought-content">
                <h2>${thought.title}</h2>
                <p>${content.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="thought-meta">
                <span class="thought-category">${category}</span>
                <span class="added-by">${thought.addedBy || 'Anonymous'}</span>
                ${formattedTime ? `<span class="timestamp">${formattedTime}</span>` : ''}
            </div>
        `;
    }
    
    // Add mobile click handler only for mobile view
    if (window.innerWidth <= 768) {
        setupCardInteractions(thoughtCard, thought, formattedTime);
    }
    
    return thoughtCard;
}

// Set up card interactions (click, touch, swipe)
function setupCardInteractions(card, thought, formattedTime) {
    const state = {
        isExpanded: false,
        isAnimating: false,
        startY: 0,
        startX: 0,
        isSwiping: false,
        overlay: null,
        originalPosition: {},
        originalScroll: 0,
        touchStartTime: 0,
        animationFrameId: null,
        isScrolling: null,
        touchStartScrollTop: 0
    };
    
    // Prevent body scroll when popup is open
    function preventBodyScroll(prevent) {
        document.body.style.overflow = prevent ? 'hidden' : '';
        document.body.style.position = prevent ? 'fixed' : '';
        document.body.style.width = prevent ? '100%' : '';
        document.body.style.height = prevent ? '100%' : '';
    }
    
    // Add unique identifier to track this card
    const cardId = 'card-' + Math.random().toString(36).substr(2, 9);
    card.dataset.cardId = cardId;
    
    // Handle close button click (separate handler for better reliability)
    function handleCloseButtonClick(e) {
        e.stopPropagation();
        e.preventDefault();
        closeCard();
    }

    // Handle card tap/click
    const handleTap = (e) => {
        // Handle close button click
        if (e.target.closest('.close-popup')) {
            handleCloseButtonClick(e);
            return;
        }
        
        // Ignore if we're in the middle of an animation or already expanded
        if (state.isAnimating || state.isExpanded || state.isScrolling) {
            return;
        }
        
        // Only proceed if this was a clean tap (no movement or scroll)
        if (state.isValidTap && !state.touchMoved && !state.wasScrolled) {
            e.preventDefault();
            e.stopPropagation();
            // Small delay to ensure no scroll happens after tap
            setTimeout(() => {
                if (!state.wasScrolled) {
                    expandCard();
                }
            }, 50);
        }
    };
    
    // Add event listeners for better mobile support
    card.addEventListener('click', handleTap);
    card.addEventListener('touchend', handleTap, { passive: false });
    card.addEventListener('touchcancel', () => {
        state.isValidTap = false;
        state.isScrolling = true;
    }, { passive: true });
    
    // Function to setup close button events
    function setupCloseButton() {
        const closeButton = card.querySelector('.close-popup');
        if (closeButton) {
            // Remove any existing listeners to prevent duplicates
            closeButton.removeEventListener('click', handleCloseButtonClick);
            closeButton.removeEventListener('touchend', handleCloseButtonClick);
            closeButton.removeEventListener('touchstart', handleCloseButtonTouchStart);
            
            // Add new listeners
            closeButton.addEventListener('click', handleCloseButtonClick);
            closeButton.addEventListener('touchend', handleCloseButtonClick, { passive: true });
            closeButton.addEventListener('touchstart', handleCloseButtonTouchStart, { passive: true });
        }
    }
    
    // Handle touch start on close button (for better mobile response)
    function handleCloseButtonTouchStart(e) {
        e.stopPropagation();
        e.preventDefault();
        // Add active state class
        e.currentTarget.classList.add('active');
        // Remove active state after a short delay
        setTimeout(() => {
            if (e.currentTarget) {
                e.currentTarget.classList.remove('active');
            }
        }, 200);
    }
    
    // Initial setup
    setupCloseButton();
    
    // Also set up close button when card is expanded
    const originalExpandCard = expandCard;
    expandCard = function() {
        originalExpandCard.apply(this, arguments);
        // Small delay to ensure the expanded class is applied
        setTimeout(setupCloseButton, 50);
    };
    
    // Touch start for tap/swipe detection
    function handleTouchStart(e) {
        if (state.isAnimating) return;
        
        const touch = e.touches[0];
        const now = Date.now();
        
        // Reset state for new touch
        state.touchStartTime = now;
        state.startY = touch.clientY;
        state.startX = touch.clientX;
        state.lastY = touch.clientY;
        state.lastX = touch.clientX;
        state.isSwiping = false;
        state.touchMoved = false;
        state.isScrolling = false;
        state.wasScrolled = false;
        state.isValidTap = true;
        state.lastMoveTime = now;
        state.scrollVelocity = 0;
        state.originalScroll = window.scrollY;
        state.touchStartScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        state.maxMovement = 0; // Track maximum movement during touch
        state.lastScrollPos = window.scrollY;
        
        // Start checking for scroll
        state.scrollCheckInterval = setInterval(() => {
            const currentScroll = window.scrollY;
            if (Math.abs(currentScroll - state.lastScrollPos) > 0) {
                state.wasScrolled = true;
                state.isValidTap = false;
                clearInterval(state.scrollCheckInterval);
            }
            state.lastScrollPos = currentScroll;
        }, 10);
        
        // Store initial touch point for movement detection
        state.initialTouch = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
        
        // Reset any previous transforms
        if (state.isExpanded) {
            card.style.transform = '';
            card.style.transition = 'transform 0.2s ease-out';
        }
    }
    
    card.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    // Touch move handler - detects any movement to cancel tap
    function handleTouchMove(e) {
        if (state.isAnimating) return;
        
        const touch = e.touches[0];
        const currentY = touch.clientY;
        const currentX = touch.clientX;
        const now = Date.now();
        
        // Calculate movement from touch start
        const moveY = Math.abs(currentY - state.startY);
        const moveX = Math.abs(currentX - state.startX);
        
        // Track maximum movement
        state.maxMovement = Math.max(state.maxMovement, moveY, moveX);
        
        // If any movement exceeds threshold, cancel the tap
        if (state.maxMovement > 3) { // 3px movement threshold
            state.touchMoved = true;
            state.isValidTap = false;
            state.wasScrolled = true; // Any significant movement counts as scroll
        }
        
        // If we're not expanded, prevent default to improve scroll performance
        if (!state.isExpanded) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Update last positions
        state.lastY = currentY;
        state.lastX = currentX;
        state.lastMoveTime = now;
        
        const deltaY = touch.clientY - state.startY;
        const deltaX = touch.clientX - state.startX;
        
        // Only process swipe if we're at the top of the scrollable area
        const isAtTop = (document.documentElement.scrollTop || document.body.scrollTop) <= 0;
        const isScrollingDown = deltaY > 0;
        
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Touch end - handle swipe completion
    function handleTouchEnd(e) {
        // Reset scrolling state
        state.isScrolling = false;
        
        // Clear the scroll check interval
        if (state.scrollCheckInterval) {
            clearInterval(state.scrollCheckInterval);
            state.scrollCheckInterval = null;
        }
        
        // If this was a swipe, handle it
        if (state.isSwiping) {
            state.touchStartY = null;
            state.startScrollTop = 0;
        }
        
        // Reset touch state for next interaction
        state.touchMoved = false;
        state.isValidTap = false;
        
        const touch = e.changedTouches[0] || e.touches[0];
        const deltaY = touch.clientY - state.touchStartY;
        const deltaTime = Date.now() - state.touchStartTime;
        const velocity = deltaY / deltaTime;
        
        // Reset transition
        card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s';
        
        // Close if swiped down significantly or with enough velocity
        if (deltaY > 100 || (deltaY > 50 && velocity > 0.3)) {
            closeCard();
        } else {
            // Return to original position with bounce effect
            card.style.transform = 'none';
            card.style.opacity = '1';
            
            if (state.overlay) {
                state.overlay.style.opacity = '1';
            }
            
            // Reset after animation
            setTimeout(() => {
                card.style.transition = '';
            }, 300);
        }
        
        state.touchStartY = null;
        state.isSwiping = false;
        state.startScrollTop = 0;
    }
    
    // Add touch end event listeners
    card.addEventListener('touchend', handleTouchEnd, { passive: true });
    card.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    
    state.isSwiping = false;
    }
    
    // Expand card to full screen with smooth animation sequence
    function expandCard() {
        if (state.isExpanded || state.isAnimating) return;
        
        state.isAnimating = true;
        const rect = card.getBoundingClientRect();
        
        // Store original position and scroll
        state.originalPosition = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            scrollTop: window.scrollY || document.documentElement.scrollTop
        };
        
        // Prevent body scroll
        preventBodyScroll(true);
        
        // Create overlay
        state.overlay = document.createElement('div');
        state.overlay.className = 'card-overlay';
        document.body.appendChild(state.overlay);
        
        // Force reflow
        void state.overlay.offsetHeight;
        
        // Show overlay with fade
        state.overlay.classList.add('visible');
        
        // Prepare card for animation
        card.style.position = 'fixed';
        card.style.top = `${state.originalPosition.top}px`;
        card.style.left = `${state.originalPosition.left}px`;
        card.style.width = `${state.originalPosition.width}px`;
        card.style.height = `${state.originalPosition.height}px`;
        card.style.margin = '0';
        card.style.zIndex = '1000';
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.willChange = 'transform, width, height, top, left, opacity';
        
        // Force reflow
        void card.offsetHeight;
        
        // Calculate target position (centered)
        const targetTop = Math.max(20, (window.innerHeight - window.innerHeight * 0.8) / 2);
        const targetLeft = (window.innerWidth - window.innerWidth * 0.9) / 2;
        
        // First, move card to center position
        card.style.top = `${targetTop}px`;
        card.style.left = `${targetLeft}px`;
        card.style.width = `${window.innerWidth * 0.9}px`;
        card.style.height = `${window.innerHeight * 0.8}px`;
        
        // After move completes, expand to full size
        const onMoveComplete = () => {
            card.removeEventListener('transitionend', onMoveComplete);
            
            // Add expanded class for final styles
            card.classList.add('expanded');
            
            // Show metadata in popup
            const metadata = card.querySelector('.card-metadata');
            if (metadata) {
                metadata.style.display = 'block';
            }
            
            // Show close button
            const closeBtn = card.querySelector('.close-popup');
            if (closeBtn) {
                closeBtn.style.display = 'flex';
                closeBtn.style.opacity = '1';
            }
            
            // Add event listeners for closing
            state.overlay.addEventListener('click', closeCard);
            document.addEventListener('keydown', handleKeyDown);
            
            state.isExpanded = true;
            state.isAnimating = false;
        };
        
        card.addEventListener('transitionend', onMoveComplete);
        
        // Fallback in case transitionend doesn't fire
        setTimeout(() => {
            if (state.isAnimating) {
                onMoveComplete();
            }
        }, 400);
    }
    
    // Close card and return to original position
    function closeCard() {
        if (!state.isExpanded || state.isAnimating) return;
        
        state.isAnimating = true;
        
        // Hide close button immediately
        const closeBtn = card.querySelector('.close-popup');
        if (closeBtn) {
            closeBtn.style.opacity = '0';
        }
        
        // Hide metadata
        const metadata = card.querySelector('.card-metadata');
        if (metadata) {
            metadata.style.display = 'none';
        }
        
        // Remove expanded class and reset styles
        card.classList.remove('expanded');
        
        // Reset card styles with transition
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.position = 'relative';
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.height = '';
        card.style.zIndex = '';
        card.style.transform = '';
        card.style.opacity = '1';
        card.style.margin = '';
        card.style.willChange = '';
        
        // Re-enable body scroll after a delay
        preventBodyScroll(false);
        
        // Remove overlay with fade out
        if (state.overlay) {
            state.overlay.style.opacity = '0';
            state.overlay.classList.remove('visible');
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (state.overlay && state.overlay.parentNode) {
                    state.overlay.parentNode.removeChild(state.overlay);
                }
            }, 350);
        }
        
        // Reset state after animation
        const onTransitionEnd = () => {
            if (card) {
                card.style.transition = '';
                card.removeEventListener('transitionend', onTransitionEnd);
                
                // Clean up animation frame
                if (state.animationFrameId) {
                    cancelAnimationFrame(state.animationFrameId);
                    state.animationFrameId = null;
                }
                
                state.isExpanded = false;
                state.isAnimating = false;
                state.overlay = null;
            }
        };
        
        card.addEventListener('transitionend', onTransitionEnd);
        
        // Fallback in case transitionend doesn't fire
        setTimeout(() => {
            if (state.isAnimating) {
                onTransitionEnd();
            }
        }, 400);
    }
    
    // Handle keyboard events
    function handleKeyDown(e) {
        if (e.key === 'Escape' && state.isExpanded) {
            e.preventDefault();
            closeCard();
        }
    }
    
    // Initialize the card
    return {
        expand: expandCard,
        close: closeCard
    };
}

// Function to show thought popup on mobile
function showThoughtPopup(thought, category, formattedTime) {
    // Don't show popup on desktop
    if (window.innerWidth > 768) return;
    
    // Remove any existing popup first
    const existingOverlay = document.getElementById('popup-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'popup-overlay';
    overlay.className = 'card-popup-overlay';
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'thought-popup';
    popup.className = 'card-popup';
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-popup';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close popup');
    closeBtn.addEventListener('click', closeThoughtPopup);
    
    // Create front side (initially hidden)
    const frontSide = document.createElement('div');
    frontSide.className = 'popup-front';
    frontSide.innerHTML = `
        <h2>${thought.title}</h2>
        <div class="popup-text-content">
            ${thought.content.split('\n').slice(0, 3).map(paragraph => 
                paragraph.trim() ? `<p>${paragraph}</p>` : ''
            ).join('')}
            ${thought.content.split('\n').length > 3 ? '<p>...</p>' : ''}
        </div>
    `;
    
    // Create back side with all content
    const backSide = document.createElement('div');
    backSide.className = 'popup-back';
    backSide.innerHTML = `
        <h2>${thought.title}</h2>
        <div class="popup-text-content">
            ${thought.content.split('\n').map(paragraph => 
                paragraph.trim() ? `<p>${paragraph}</p>` : ''
            ).join('')}
        </div>
        <div class="thought-meta">
            <span class="thought-category">${category}</span>
            <span class="added-by">Added by: ${thought.addedBy}</span>
            ${formattedTime ? `<span class="timestamp">${formattedTime}</span>` : ''}
        </div>
    `;
    
    // Create flip container
    const flipContainer = document.createElement('div');
    flipContainer.className = 'flip-container';
    flipContainer.appendChild(frontSide);
    flipContainer.appendChild(backSide);
    
    // Assemble the popup
    popup.appendChild(closeBtn);
    popup.appendChild(flipContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Show the popup with animation
    requestAnimationFrame(() => {
        overlay.classList.add('visible');
        popup.classList.add('visible');
        
        // Start flip animation after a short delay
        setTimeout(() => {
            flipContainer.classList.add('flipped');
        }, 100);
    });
    
    // Close when clicking outside the popup
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeThoughtPopup();
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', handlePopupKeydown);
    
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';
}

// Function to close the thought popup
function closeThoughtPopup() {
    const popup = document.getElementById('thought-popup');
    const overlay = document.getElementById('popup-overlay');
    
    if (popup && overlay) {
        popup.classList.remove('visible');
        overlay.classList.remove('visible');
        
        // Remove event listeners
        document.removeEventListener('keydown', handlePopupKeydown);
        
        // Remove after animation completes
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
            document.body.style.overflow = ''; // Restore body scroll
        }, 300);
    }
}

// Handle keyboard navigation for popup
function handlePopupKeydown(event) {
    if (event.key === 'Escape') {
        closeThoughtPopup();
    }
}

// Function to render thoughts
function renderThoughts() {
    console.log('Rendering thoughts...');
    const container = document.getElementById('thoughts-container');
    if (!container) {
        console.error('Thoughts container not found');
        return;
    }
    
    try {
        // Skip loading state and render thoughts directly
        renderThoughtsInternal();
    } catch (error) {
        console.error('Error rendering thoughts:', error);
        container.innerHTML = `
            <div class="error">
                <p>Error loading thoughts. Please try again later.</p>
                <button onclick="loadThoughts()" class="refresh-btn">Retry</button>
            </div>`;
    }
    
    function renderThoughtsInternal() {
        try {
            // Get and sort thoughts
            let thoughts = [...thoughtsData.thoughts];
            thoughts = filterThoughts(thoughts);
            thoughts = sortThoughts(thoughts);

            // Clear container
            container.innerHTML = '';

            if (thoughts.length === 0) {
                container.innerHTML = `
                    <div class="no-thoughts">
                        <p>No thoughts found. Be the first to share your thought!</p>
                    </div>`;
                return;
            }

            // Add thoughts to the container
            thoughts.forEach(thought => {
                container.appendChild(createThoughtCard(thought));
            });

            // Fade in cards sequentially
            const cards = container.querySelectorAll('.thought-card');
            cards.forEach((card, index) => {
                card.classList.remove('visible'); // Ensure invisible
                card.classList.add('animated'); // Add animation class
                
                safeSetTimeout(() => {
                    card.classList.add('visible');
                }, index * 50);
            });
            
            console.log(`Successfully rendered ${thoughts.length} thoughts`);
        } catch (error) {
            console.error('Error in renderThoughtsInternal:', error);
            container.innerHTML = `
                <div class="error">
                    <p>Error displaying thoughts. Please refresh the page.</p>
                    <button onclick="loadThoughts()" class="refresh-btn">Retry</button>
                </div>`;
        }
    }
}

// Initial render will be triggered by initializeApp

// Initialize install button and last updated time
document.addEventListener('DOMContentLoaded', function() {
    // Initialize install button
    let deferredPrompt;
    const addBtn = document.createElement('button');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // Show the install button
        addBtn.style.display = 'block';
        addBtn.textContent = 'Install Thaughtify App';
        addBtn.classList.add('install-btn');
        document.body.appendChild(addBtn);
        
        addBtn.addEventListener('click', () => {
            // Hide the install button
            addBtn.style.display = 'none';
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            if (navMenu) navMenu.classList.toggle('active');
            if (navOverlay) navOverlay.classList.toggle('active');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });
    }

    // Close menu when clicking on overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', function() {
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            if (navMenu) navMenu.classList.remove('active');
            this.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// --- Robust search bar initialization for index.html ---
(function ensureSearchBarWorks() {
    function tryInit() {
        const searchInput = document.getElementById('search-thoughts');
        if (searchInput && typeof initializeSearchAndSort === 'function') {
            initializeSearchAndSort(); // Attach all listeners if not already
            // Add debug log for search input
            searchInput.addEventListener('input', function onInput() {
                console.log('[Debug] Search input changed:', searchInput.value);
            }, { once: true });
            return true;
        }
        return false;
    }
    // Try immediately
    if (tryInit()) return;
    // Try on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', tryInit);
    // Try after all scripts loaded
    window.addEventListener('load', tryInit);
    // Fallback: poll for up to 2 seconds
    let tries = 0;
    const interval = setInterval(() => {
        if (tryInit() || tries++ > 20) clearInterval(interval);
    }, 100);
})();