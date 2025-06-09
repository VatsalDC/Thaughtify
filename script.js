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
    initMobileMenu();
    handleResponsiveMenu();
    
    // Handle window resize
    window.addEventListener('resize', handleResponsiveMenu);
    
    // Remove any add thought buttons from the UI
    document.querySelectorAll('.add-thought-btn').forEach(btn => btn.remove());
});

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

// Load thoughts from shared-thoughts.js
function loadThoughts() {
    console.log('Loading thoughts from shared-thoughts.js...');
    
    // Show loading state
    showLoadingState();
    
    // Use a small timeout to ensure the loading state is visible
    setTimeout(() => {
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
            <span class="thought-category">${thought.category || 'Uncategorized'}</span>
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
                
                setTimeout(() => {
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