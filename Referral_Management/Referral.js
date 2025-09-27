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

const addNewBtn = document.getElementById('addNewBtn');
const popup     = document.getElementById('referralPopup');
const closeBtn  = document.getElementById('closeBtn');
const form      = document.getElementById('referralForm');

/* open */
addNewBtn.addEventListener('click', () => {
  popup.classList.add('show');
  addNewBtn.style.display = 'none'; 
});

closeBtn.addEventListener('click', () => {
  popup.classList.remove('show');
  addNewBtn.style.display = 'block'; 
});

popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.classList.remove('show');
    addNewBtn.style.display = 'block'; 
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  console.log('Referral saved:', data);
  alert('Referral saved successfully!');
  form.reset();
  popup.classList.remove('show');
  addNewBtn.style.display = 'block'; 
});
