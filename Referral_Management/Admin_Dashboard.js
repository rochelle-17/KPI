// Sidebar Active State
const currentPath = window.location.pathname;
const menuItems = document.querySelectorAll(".sidebar-list-item a");

// Set active based on URL
menuItems.forEach(link => {
  link.parentElement.classList.remove("active"); // clear old actives
  if (link.pathname === currentPath) {
    link.parentElement.classList.add("active");
  }

  // Update active on click (works without reload)
  link.addEventListener("click", function () {
    menuItems.forEach(l => l.parentElement.classList.remove("active"));
    this.parentElement.classList.add("active");
  });
});

// Dropdown toggle
function toggleDropdown() {
  document.getElementById("profileDropdown").classList.toggle("show");
}

// Close dropdown if click is outside
window.addEventListener("click", function (event) {
  if (!event.target.closest('#profileDropdown') && 
      !event.target.closest('#dropdownButton')) {
    document.getElementById("profileDropdown").classList.remove("show");
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      console.log("Clicked:", tab.dataset.target); 

      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.target);
      if (target) {
        console.log("Found target:", target.id);
        target.classList.add("active");
      } else {
        console.error("Target not found:", tab.dataset.target);
      }
    });
  });
});
