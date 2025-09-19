var sideBarOpen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar() {
    if (!sideBarOpen) {
        sidebar.classList.add("sidebar-responsive");
        sideBarOpen = true;
    }
}

function closeSidebar() {
    if (sideBarOpen) {
        sidebar.classList.remove("sidebar-responsive");
        sideBarOpen = false;
    }
}

// Profile dropdown toggle
function toggleProfileDropdown() {
    document.getElementById("profileDropdown").classList.toggle("show");
}

// Row dropdown toggle
function toggleRowDropdown(element) {
    // Close all other row dropdowns first
    document.querySelectorAll('.more').forEach(function(more) {
        if (more !== element.parentElement) {
            more.classList.remove("show");
        }
    });

    // Toggle this row's dropdown
    element.parentElement.classList.toggle("show");
}

// Close dropdowns if clicking outside
window.addEventListener("click", function(event) {
    // Profile dropdown
    if (!event.target.closest('#profileDropdown')) {
        document.getElementById("profileDropdown").classList.remove("show");
    }

    // Row dropdowns
    if (!event.target.closest('.more')) {
        document.querySelectorAll('.more').forEach(function(more) {
            more.classList.remove("show");
        });
    }
});
