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

// Dropdown toggle
function toggleDropdown() {
    document.getElementById("profileDropdown").classList.toggle("show");
}

// Close dropdown if click is outside
window.addEventListener("click", function(event) {
    if (!event.target.closest('#profileDropdown')) {
        document.getElementById("profileDropdown").classList.remove("show");
    }
});


