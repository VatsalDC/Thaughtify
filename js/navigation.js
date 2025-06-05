// Mobile Navigation Toggle
function initNavigation() {
    const navToggles = document.querySelectorAll('.nav-toggle');
    const navMenus = document.querySelectorAll('.nav-menu');
    const navOverlays = document.querySelectorAll('.nav-overlay');

    // Toggle mobile menu
    function toggleMenu(button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const menu = document.getElementById(button.getAttribute('aria-controls'));
        const overlay = button.nextElementSibling.classList.contains('nav-overlay') ? 
                      button.nextElementSibling : null;
        
        // Toggle menu and button state
        button.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
        
        // Toggle overlay if it exists
        if (overlay) {
            overlay.classList.toggle('active');
        }
        
        // Toggle body scroll
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    }

    // Close menu when clicking outside
    function closeAllMenus(event) {
        navToggles.forEach(button => {
            const menu = document.getElementById(button.getAttribute('aria-controls'));
            const overlay = button.nextElementSibling.classList.contains('nav-overlay') ? 
                          button.nextElementSibling : null;
            
            if (button.getAttribute('aria-expanded') === 'true' && 
                !button.contains(event.target) && 
                !menu.contains(event.target)) {
                
                button.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
                
                if (overlay) {
                    overlay.classList.remove('active');
                }
                
                document.body.style.overflow = '';
            }
        });
    }

    // Add event listeners
    navToggles.forEach(button => {
        button.addEventListener('click', () => toggleMenu(button));
    });

    // Close menu when clicking on overlay or menu items
    document.addEventListener('click', closeAllMenus);
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navToggles.forEach(button => {
                if (button.getAttribute('aria-expanded') === 'true') {
                    toggleMenu(button);
                }
            });
        }
    });
}

// Initialize navigation when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}
