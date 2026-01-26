/**
 * Dark Mode Toggle Functionality
 * Handles theme switching with localStorage persistence and system preference detection
 */
(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDarkMode);
    } else {
        initDarkMode();
    }

    function initDarkMode() {
        const toggle = document.getElementById("darkModeToggle");
        const body = document.body;

        if (!body) {
            console.warn('Dark mode: body element not found');
            return;
        }

        // Helper function to update icon
        function updateIcon() {
            if (!toggle) return;
            try {
                toggle.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
            } catch (error) {
                console.error('Error updating dark mode icon:', error);
            }
        }

        // Helper function to save theme preference
        function saveTheme(theme) {
            try {
                localStorage.setItem("theme", theme);
            } catch (error) {
                console.warn('Could not save theme preference to localStorage:', error);
            }
        }

        // Helper function to apply theme
        function applyTheme(theme) {
            if (theme === "dark") {
                body.classList.add("dark-mode");
            } else {
                body.classList.remove("dark-mode");
            }
            updateIcon();
        }

        // 1. Load saved theme
        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem("theme");
        } catch (error) {
            console.warn('Could not read theme preference from localStorage:', error);
        }

        if (savedTheme === "dark" || savedTheme === "light") {
            applyTheme(savedTheme);
        } else {
            // 2. System preference (only if no saved theme)
            try {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (prefersDark) {
                    applyTheme("dark");
                } else {
                    applyTheme("light");
                }
            } catch (error) {
                console.warn('Could not detect system color scheme preference:', error);
                // Default to light mode if detection fails
                applyTheme("light");
            }
        }

        // 3. Toggle on click
        if (toggle) {
            toggle.addEventListener("click", () => {
                const isDark = body.classList.contains("dark-mode");
                const newTheme = isDark ? "light" : "dark";
                
                applyTheme(newTheme);
                saveTheme(newTheme);
            });

            // Add keyboard support for accessibility
            toggle.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle.click();
                }
            });

            // Make button focusable and accessible
            toggle.setAttribute("aria-label", "Toggle dark mode");
            toggle.setAttribute("role", "button");
            toggle.setAttribute("tabindex", "0");
        }

        // Listen for system theme changes (optional enhancement)
        try {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            mediaQuery.addEventListener("change", (e) => {
                // Only apply system preference if user hasn't manually set a preference
                if (!savedTheme) {
                    applyTheme(e.matches ? "dark" : "light");
                }
            });
        } catch (error) {
            // MediaQueryList.addEventListener might not be supported in older browsers
            console.warn('System theme change listener not supported:', error);
        }
    }
})();
