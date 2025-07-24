// Global default thoughts
if (!window.defaultThoughts || !Array.isArray(window.defaultThoughts)) {
    window.defaultThoughts = [];
}

// Script loading functionality
function loadAdminScripts() {
    // Show loading state immediately
    const container = document.getElementById('thoughts-container');
    if (container) {
        container.innerHTML = `
            <div class="container-loading">
                <div class="spinner"></div>
                <div class="loading-text">Loading thoughts...</div>
            </div>`;
    }

    // Scripts to load in order
    const scripts = [
        'shared-thoughts.js',
        'js/navigation.js',
        'admin.js'
    ];
    
    function loadScript(index) {
        if (index >= scripts.length) {
            // All scripts loaded, initialize admin
            if (window.initializeAdmin) {
                initializeAdmin();
            } else {
                console.error('initializeAdmin function not found');
                // Show error if initializeAdmin is not found
                const container = document.getElementById('thoughts-container');
                if (container) {
                    container.innerHTML = `
                        <div class="error">
                            <p>Error initializing application. Please refresh the page.</p>
                            <button onclick="window.location.reload()" class="refresh-btn">Refresh</button>
                        </div>`;
                }
            }
            return;
        }

        const script = document.createElement('script');
        script.src = scripts[index];
        script.onload = () => loadScript(index + 1);
        script.onerror = () => {
            console.error(`Failed to load script: ${scripts[index]}`);
            loadScript(index + 1); // Continue with next script even if one fails
        };
        document.head.appendChild(script);
    }

    // Start loading scripts
    loadScript(0);
}

// Start loading scripts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAdminScripts);
} else {
    loadAdminScripts();
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-thoughts');
    if (searchInput) {
        searchInput.addEventListener('input', () => loadThoughts());
    }

    // Custom dropdown functionality
    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(select => {
        const selectedOption = select.querySelector('.selected-option');
        const optionsContainer = select.querySelector('.options-container');
        const options = select.querySelectorAll('.option');
        const hiddenSelect = select.querySelector('select');
        
        // Set initial active option
        const initialOption = select.querySelector(`.option[data-value="${hiddenSelect.value}"]`);
        if (initialOption) {
            selectedOption.textContent = initialOption.textContent;
            initialOption.classList.add('active');
        }
        
        // Toggle dropdown
        selectedOption.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = select.classList.contains('open');
            
            // Close all other open dropdowns
            document.querySelectorAll('.custom-select').forEach(s => {
                if (s !== select) s.classList.remove('open');
            });
            
            // Toggle this dropdown
            const wasOpen = select.classList.contains('open');
            select.classList.toggle('open', !wasOpen);
            
            // Set --index property for each option when opening
            if (!wasOpen) {
                const options = select.querySelectorAll('.option');
                options.forEach((option, index) => {
                    option.style.setProperty('--index', index);
                });
            }
        });
        
        // Select option
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                
                // Update selected option display
                selectedOption.textContent = this.textContent;
                
                // Update hidden select value
                hiddenSelect.value = value;
                
                // Update active state
                options.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Close dropdown
                select.classList.remove('open');
                
                // Trigger change event on hidden select
                const event = new Event('change', { bubbles: true });
                hiddenSelect.dispatchEvent(event);
                
                // Reload thoughts with new sort
                loadThoughts();
            });
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.custom-select').forEach(select => {
            select.classList.remove('open');
        });
    });
    
    // Close dropdown when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('open');
            });
        }
    });
}

// Initialize admin dashboard
function initializeAdmin() {
    console.log('Initializing admin dashboard...');
    setupEventListeners();
    loadAllData();
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

// Scroll animation removed as per user request

// Admin dashboard initialization
function initializeAdmin() {
    try {
        // Initialize event listeners
        setupEventListeners();
        
        // Load all data
        loadAllData();
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
}

// Load all data
async function loadAllData() {
    // Show loading state before starting to load
    showLoadingState();
    
    try {
        // Load thoughts first, then other data
        await loadThoughts();
        await Promise.all([
            loadCategories(),
            updateStatistics()
        ]);
    } catch (error) {
        console.error('Error in loadAllData:', error);
        // If there's an error, display an error message
        const container = document.getElementById('thoughts-container');
        if (container) {
            container.innerHTML = `
                <div class="error">
                    <p>Error loading data. Please refresh the page.</p>
                    <button onclick="loadAllData()" class="refresh-btn">Try Again</button>
                </div>`;
        }
    }
}

// Load and display thoughts from shared-thoughts.js
function loadThoughts() {
    return new Promise((resolve) => {
        try {
            // Always use the shared thoughts
            const thoughtsList = window.defaultThoughts ? [...window.defaultThoughts] : [];
            
            console.log('Loaded thoughts from shared-thoughts.js:', thoughtsList.length);
            
            // Filter and sort thoughts
            const filteredThoughts = filterThoughts(thoughtsList);
            const sortedThoughts = sortThoughtsList(filteredThoughts);
            
            // Display thoughts
            displayThoughts(sortedThoughts);
            
            // Resolve with the sorted thoughts
            resolve(sortedThoughts);
        } catch (error) {
            console.error('Error loading thoughts:', error);
            // Fallback to empty array if there's an error
            displayThoughts([]);
            resolve([]);
        }
    });
}

// Load categories from existing thoughts
function loadCategories() {
    try {
        // Get all unique categories from thoughts
        const categorySet = new Set();
        
        // Add categories from existing thoughts
        if (window.defaultThoughts && Array.isArray(window.defaultThoughts)) {
            window.defaultThoughts.forEach(thought => {
                if (thought.category) {
                    categorySet.add(thought.category);
                }
            });
        }
        
        // Convert set to array of category objects
        const categories = Array.from(categorySet).map((category, index) => ({
            id: String(index + 1),
            name: category,
            description: `Thoughts about ${category.toLowerCase()}`,
            icon: 'tag',  // Default icon
            featured: false
        }));
        
        // Add 'All Categories' option at the beginning
        categories.unshift({
            id: 'all',
            name: 'All Categories',
            description: 'Show all thoughts',
            icon: 'grid',
            featured: true
        });
        
        updateCategoryFilter(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Update category filter dropdown
function updateCategoryFilter(categories) {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    // Clear existing options except the first one
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    // Add new categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

// Update statistics
function updateStatistics() {
    try {
        const totalThoughts = window.defaultThoughts ? window.defaultThoughts.length : 0;
        const totalElement = document.getElementById('total-thoughts');
        
        if (totalElement) {
            totalElement.textContent = totalThoughts;
        }
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
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
function sortThoughtsList(thoughts) {
    const sortOption = document.getElementById('sort-thoughts').value;
    return [...thoughts].sort((a, b) => {
        switch (sortOption) {
            case 'date-asc':
                return new Date(a.timestamp) - new Date(b.timestamp);
            case 'date-desc':
                return new Date(b.timestamp) - new Date(a.timestamp);
            case 'likes':
                return (b.likes || 0) - (a.likes || 0);
            default:
                return 0;
        }
    });
}

// Display thoughts in the grid
function displayThoughts(thoughts) {
    const container = document.getElementById('thoughts-container');
    if (!container) {
        console.error('Thoughts container not found');
        return;
    }
    
    if (!thoughts || thoughts.length === 0) {
        container.innerHTML = '<div class="no-thoughts"><p>No thoughts found</p></div>';
        return;
    }
    
    try {
        container.innerHTML = '';
        thoughts.forEach(thought => {
            const card = document.createElement('div');
            card.className = 'thought-card';
            const formattedDate = formatDate(thought.timestamp);
            card.innerHTML = `
                <div class="thought-content">
                    <h2>${thought.title || 'Untitled'}</h2>
                    <p>${thought.content || ''}</p>
                </div>
                <div class="thought-meta">
                    <span class="meta-item thought-category">${thought.category || 'Uncategorized'}</span>
                    <span class="meta-item added-by">Added by: ${thought.addedBy || 'Admin'}</span>
                    <span class="meta-item timestamp">${formattedDate}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error rendering thoughts:', error);
        container.innerHTML = '<div class="error"><p>Error displaying thoughts</p></div>';
    }
}

// Format date and time from timestamp (DD Month YYYY, HH:MM:SS AM/PM)
// Converts IST to user's local timezone
function formatDate(timestamp) {
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
        
        // Get timezone abbreviation
        let timeZoneAbbr = '';
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            timeZoneAbbr = new Intl.DateTimeFormat('en', { 
                timeZone,
                timeZoneName: 'short' 
            }).formatToParts(new Date()).find(part => part.type === 'timeZoneName').value;
        } catch (e) {
            console.error('Error getting timezone abbreviation:', e);
        }
        
        return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm} (${timeZoneAbbr})`;
    } catch (e) {
        console.error('Error formatting date and time:', e);
        return '';
    }
}

// Delete functionality has been removed as thoughts are now managed through shared-thoughts.js

// Reset scroll position to top when page loads
window.scrollTo(0, 0);

// Ensure scroll is at the top when page loads
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
});

// Load thoughts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Ensure scroll is at the top when loading thoughts
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    initializeAdmin();
});

// Mobile navigation toggle for admin
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
});

// Clean up any existing service workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });
}
