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

// Make initializeApp globally available
window.initializeApp = function() {
    console.log('Initializing app...');
    loadThoughts();
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
    // Search input
    const searchInput = document.getElementById('search-thoughts');
    if (searchInput) {
        searchInput.addEventListener('input', () => loadThoughts());
    }

    // Initialize dropdown functionality
    const sortSelect = document.getElementById('sort-thoughts');
    const customSelect = document.querySelector('.custom-select');
    const selectedOption = document.querySelector('.selected-option');
    const options = document.querySelectorAll('.option');
    
    // Set initial selected value
    if (sortSelect && selectedOption) {
        const initialOption = sortSelect.querySelector('option:checked');
        if (initialOption) {
            selectedOption.textContent = initialOption.textContent;
        }
    }
    
    // Toggle dropdown on click
    if (selectedOption) {
        selectedOption.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = customSelect.classList.toggle('open');
            
            // Close other open dropdowns
            document.querySelectorAll('.custom-select').forEach(select => {
                if (select !== customSelect) {
                    select.classList.remove('open');
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
    
    // Handle option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            if (sortSelect) {
                sortSelect.value = value;
                const event = new Event('change', { bubbles: true });
                sortSelect.dispatchEvent(event);
            }
            if (selectedOption) {
                selectedOption.textContent = this.textContent;
            }
            if (customSelect) {
                customSelect.classList.remove('open');
            }
        });
    });
    
    // Handle keyboard navigation and sort change
    if (sortSelect) {
        sortSelect.style.display = 'block';
        
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
            loadThoughts();
        });
    }
    
    // Close dropdown when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('open');
            });
        }
    });
}

// Filter thoughts based on search
function filterThoughts(thoughts) {
    const searchInput = document.getElementById('search-thoughts');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    if (!searchTerm) return thoughts;
    
    return thoughts.filter(thought => {
        return (thought.title && thought.title.toLowerCase().includes(searchTerm)) || 
               (thought.content && thought.content.toLowerCase().includes(searchTerm));
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
    initMobileMenu();
    handleResponsiveMenu();
    
    // Handle window resize
    window.addEventListener('resize', handleResponsiveMenu);
    
    // Remove any add thought buttons from the UI
    document.querySelectorAll('.add-thought-btn').forEach(btn => btn.remove());
});

// Load thoughts from shared-thoughts.js
function loadThoughts() {
    console.log('Loading thoughts from shared-thoughts.js...');
    
    try {
        // Ensure defaultThoughts is an array
        if (!Array.isArray(window.defaultThoughts)) {
            console.error('defaultThoughts is not an array:', window.defaultThoughts);
            window.defaultThoughts = [];
        }
        
        // Only use thoughts from shared-thoughts.js
        thoughtsData.thoughts = [...window.defaultThoughts];
        
        console.log(`Loaded ${thoughtsData.thoughts.length} thoughts from shared-thoughts.js`);
        
        // Update the next available ID (for reference only, since adding is disabled)
        updateNextId();
        
        // Render the thoughts
        renderThoughts();
        
    } catch (error) {
        console.error('Error loading thoughts:', error);
        
        // Fallback to empty array if there's an error
        thoughtsData.thoughts = [];
        updateNextId();
        renderThoughts();
    }
}

// Save thoughts function (disabled in read-only mode)
function saveThoughts() {
    console.log('Saving thoughts is disabled in read-only mode. All thoughts are managed through the shared-thoughts.js file.');
    // No operation - saving is disabled
}

// Function to create thought card
function createThoughtCard(thought) {
    const thoughtCard = document.createElement('article');
    thoughtCard.className = 'thought-card';
    
    // Format timestamp as 'dd Month YYYY, HH:MM:SS'
    const date = new Date(thought.timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toTimeString().split(' ')[0]; // Gets HH:MM:SS
    const formattedDate = `${day} ${month} ${year}, ${time}`;
    
    thoughtCard.innerHTML = `
        <h2>${thought.title}</h2>
        <p>${thought.content}</p>
        <div class="thought-meta">
            <span class="added-by">Added by: ${thought.addedBy}</span>
            <span class="timestamp">${formattedDate}</span>
        </div>
    `;
    return thoughtCard;
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
        // Show loading state
        container.innerHTML = `
            <div class="container-loading">
                <div class="spinner"></div>
                <div class="loading-text">Loading thoughts...</div>
            </div>`;
        // Let the spinner render for a short moment
        setTimeout(() => {
            // Get and sort thoughts
            let thoughts = [...thoughtsData.thoughts];
            thoughts = filterThoughts(thoughts);
            thoughts = sortThoughts(thoughts);

            // Clear container
            container.innerHTML = '';

            if (thoughts.length === 0) {
                container.innerHTML = `
                    <div class="no-thoughts">
                        <p>No thoughts found.</p>
                        <button onclick="loadThoughts()" class="refresh-btn">Try Again</button>
                    </div>`;
                return;
            }

            // Create and append thought cards (all invisible)
            const thoughtCards = thoughts.map(thought => createThoughtCard(thought));
            thoughtCards.forEach(card => {
                card.classList.remove('visible'); // Ensure invisible
                card.classList.add('animated'); // Add animation class
                container.appendChild(card);
            });

            // Remove loading spinner now
            // (already gone since we cleared container, but if using overlay, hide it here)

            // Fade in cards sequentially
            const cards = container.querySelectorAll('.thought-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 80);
            });

            console.log(`Successfully rendered ${thoughts.length} thoughts`);
        }, 200);
    } catch (error) {
        console.error('Error in renderThoughts:', error);
        container.innerHTML = `
            <div class="error">
                <p>Error loading thoughts. Please try again.</p>
                <button onclick="loadThoughts()" class="refresh-btn">Try Again</button>
            </div>`;
    }
}

// Initial render will be triggered by initializeApp

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