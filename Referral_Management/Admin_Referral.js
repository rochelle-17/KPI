const currentLocation = window.location.href;
const menuItems = document.querySelectorAll(".sidebar-list-item a");

menuItems.forEach(link => {
    if (link.href === currentLocation) {
      link.parentElement.classList.add("active");
    }
});