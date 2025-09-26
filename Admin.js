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

// Close dropdown if clicked outside
window.onclick = function(event) {
  if (!event.target.closest(".header-right")) {
    document.getElementById("profileDropdown").classList.remove("show");
  }
}



// Grab all links
const homeLink = document.getElementById("homeLink");
const referralLink = document.getElementById("referralLink");
const recordLink = document.getElementById("recordLink");
const settingsLink = document.getElementById("settingsLink");

// Grab all sections
const sections = {
  HomeSection: document.getElementById("HomeSection"),
  ReferralSection: document.getElementById("ReferralSection"),
  RecordSection: document.getElementById("RecordSection"),
  SettingsSection: document.getElementById("SettingsSection"),
};

// Function to show one section and hide others
function showSection(sectionId) {
  Object.keys(sections).forEach((key) => {
    sections[key].style.display = key === sectionId ? "block" : "none";
  });
}

// Attach event listeners
homeLink.addEventListener("click", () => showSection("HomeSection"));
referralLink.addEventListener("click", () => showSection("ReferralSection"));
recordLink.addEventListener("click", () => showSection("RecordSection"));
settingsLink.addEventListener("click", () => showSection("SettingsSection"));

