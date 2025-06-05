// Initialize dropdown functionality
function initializeDropdown() {
    // Make sort selector visible
    const sortSelect = document.getElementById('sort-thoughts');
    if (sortSelect) {
        sortSelect.style.display = 'block';
        
        // Add change event listener
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
        });
    }
    
    // Initialize UI when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Initializing navigation...');
        });
    } else {
        console.log('Navigation already loaded');
    }
}

// Make functions globally available
window.initializeDropdown = initializeDropdown;
