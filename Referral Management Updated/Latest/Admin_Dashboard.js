document.addEventListener("DOMContentLoaded", () => {
  // Highlight active nav
  const navItems = document.querySelectorAll(".nav-item");
  const currentPage = window.location.pathname.split("/").pop();
  navItems.forEach((item) => {
    if (item.getAttribute("href") === currentPage) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // --- Dropdown ---
  const profileButton = document.getElementById("profileButton");
  const profileDropdown = document.getElementById("profileDropdown");

  profileButton.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent immediate close
    profileDropdown.classList.toggle("show");
  });

  // close dropdown if clicked outside
  window.addEventListener("click", (event) => {
    if (!event.target.closest("#profileDropdown")) {
      profileDropdown.classList.remove("show");
    }
  });

  // --- Stats ---
  function updateStats() {
    const stats = {
      total: Math.floor(Math.random() * 100),
      elementary: Math.floor(Math.random() * 30),
      juniorHigh: Math.floor(Math.random() * 30),
      seniorHigh: Math.floor(Math.random() * 40),
    };

    const statValues = document.querySelectorAll(".stat-value");
    if (statValues.length >= 4) {
      statValues[0].textContent = stats.total;
      statValues[1].textContent = stats.elementary;
      statValues[2].textContent = stats.juniorHigh;
      statValues[3].textContent = stats.seniorHigh;
    }
  }
  updateStats();

  // --- Hover log ---
  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      console.log("Hovered:", this.querySelector(".stat-label").textContent);
    });
  });

  // --- Filter tabs ---
  const filterTabs = document.querySelectorAll(".filter-tab");
  const referralsContent = document.querySelector(".referrals-content");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      filterTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");
      referralsContent.innerHTML =
        `<p class="empty-state">No referrals to display for ${filter === "all" ? "all levels" : filter}</p>`;
    });
  });
});
