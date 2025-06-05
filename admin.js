// Global default thoughts
if (!window.defaultThoughts || !Array.isArray(window.defaultThoughts)) {
    window.defaultThoughts = [];
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
        selectedOption.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = select.classList.toggle('open');
            
            // Close other open dropdowns
            document.querySelectorAll('.custom-select').forEach(otherSelect => {
                if (otherSelect !== select) {
                    otherSelect.classList.remove('open');
                }
            });
            
            // Prevent default only if we're opening the dropdown
            if (isOpen) {
                e.preventDefault();
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

// Load all data
async function loadAllData() {
    try {
        await Promise.all([
            loadThoughts(),
            loadCategories(),
            updateStatistics()
        ]);
    } catch (error) {
        console.error('Error in loadAllData:', error);
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
    try {
        await Promise.all([
            loadThoughts(),
            updateStatistics()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load and display thoughts from shared-thoughts.js
function loadThoughts() {
    try {
        // Always use the shared thoughts
        const thoughtsList = window.defaultThoughts ? [...window.defaultThoughts] : [];
        
        console.log('Loaded thoughts from shared-thoughts.js:', thoughtsList.length);
        
        // Filter and sort thoughts
        const filteredThoughts = filterThoughts(thoughtsList);
        const sortedThoughts = sortThoughtsList(filteredThoughts);
        
        // Display thoughts
        displayThoughts(sortedThoughts);
    } catch (error) {
        console.error('Error loading thoughts:', error);
        // Fallback to empty array if there's an error
        displayThoughts([]);
    }
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
        container.innerHTML = `
            <div class="no-thoughts">
                <p>No thoughts found</p>
                <button onclick="loadThoughts()" class="refresh-btn">Refresh</button>
            </div>`;
        return;
    }
    
    try {
        container.innerHTML = thoughts.map(thought => `
            <div class="thought-card">
                <h2>${thought.title || 'Untitled'}</h2>
                <p>${thought.content || ''}</p>
                <div class="thought-footer">
                    <span class="thought-category">${thought.category || 'Uncategorized'}</span>
                    <span class="thought-date">${formatDate(thought.timestamp)}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error rendering thoughts:', error);
        container.innerHTML = `
            <div class="error">
                <p>Error displaying thoughts. Please try again.</p>
                <button onclick="loadThoughts()" class="refresh-btn">Try Again</button>
            </div>`;
    }
}

// Format date for display as 'dd Month YYYY, HH:MM:SS'
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toTimeString().split(' ')[0]; // Gets HH:MM:SS
    return `${day} ${month} ${year}, ${time}`;
}

// Delete functionality has been removed as thoughts are now managed through shared-thoughts.js

// Initialize the admin dashboard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
});
