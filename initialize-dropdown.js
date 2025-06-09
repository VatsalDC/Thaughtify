// Initialize dropdown functionality
function initializeDropdown() {
    // Initialize sort dropdown
    const sortSelect = document.getElementById('sort-thoughts');
    if (sortSelect) {
        sortSelect.style.display = 'block';
        
        // Add change event listener for sorting
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
            // Trigger any filtering/sorting logic here
            filterAndSortThoughts();
        });
    }
    
    // Initialize category dropdown
    const categorySelect = document.getElementById('category-filter');
    if (categorySelect) {
        categorySelect.style.display = 'block';
        
        // Add change event listener for category filtering
        categorySelect.addEventListener('change', function() {
            const categoryValue = this.value;
            console.log('Filtering by category:', categoryValue);
            // Trigger any filtering/sorting logic here
            filterAndSortThoughts();
        });
    }
    
    // Add click event listeners to custom dropdown options
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('option')) {
            const selectId = e.target.closest('.custom-select').querySelector('select').id;
            const value = e.target.getAttribute('data-value');
            const text = e.target.textContent;
            
            // Update the selected option display
            const selectedOption = e.target.closest('.custom-select').querySelector('.selected-option');
            selectedOption.textContent = text;
            
            // Update the actual select element
            const select = document.getElementById(selectId);
            select.value = value;
            select.dispatchEvent(new Event('change'));
            
            // Close all dropdowns
            document.querySelectorAll('.options-container').forEach(container => {
                container.classList.remove('active');
            });
        }
        
        // Toggle dropdown on selected-option click
        if (e.target.classList.contains('selected-option')) {
            const optionsContainer = e.target.nextElementSibling;
            const isActive = optionsContainer.classList.contains('active');
            
            // Close all other dropdowns
            document.querySelectorAll('.options-container').forEach(container => {
                container.classList.remove('active');
            });
            
            // Toggle current dropdown if it wasn't active
            if (!isActive) {
                optionsContainer.classList.add('active');
            }
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.options-container').forEach(container => {
                container.classList.remove('active');
            });
        }
    });
}

// Function to handle filtering and sorting
function filterAndSortThoughts() {
    const category = document.getElementById('category-filter').value;
    const sortBy = document.getElementById('sort-thoughts').value;
    
    console.log('Filtering by:', category, 'Sorting by:', sortBy);
    
    // Here you would implement the actual filtering and sorting logic
    // For example:
    // 1. Get all thought elements
    // 2. Filter by category if not 'all'
    // 3. Sort according to the selected option
    // 4. Re-append the elements in the new order
    
    // This is a placeholder for the actual implementation
    const thoughtsContainer = document.getElementById('thoughts-container');
    if (thoughtsContainer) {
        // Your implementation here
    }
}

// Make functions globally available
window.initializeDropdown = initializeDropdown;
window.filterAndSortThoughts = filterAndSortThoughts;
