document.addEventListener("DOMContentLoaded", () => {
  /* =============================
     ACTIVE NAV HIGHLIGHT
  ============================= */
  const navItems = document.querySelectorAll(".nav-item");
  const currentPage = window.location.pathname.split("/").pop();
  navItems.forEach((item) => {
    if (item.getAttribute("href") === currentPage) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  /* =============================
     PROFILE DROPDOWN
  ============================= */
  const profileButton = document.getElementById("profileButton");
  const profileDropdown = document.getElementById("profileDropdown");
  
  if (profileButton && profileDropdown) {
    profileButton.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });

    window.addEventListener("click", (event) => {
      if (!event.target.closest("#profileDropdown")) {
        profileDropdown.classList.remove("show");
      }
    });
  }

  /* =============================
     LOAD REFERRALS FROM STORAGE
  ============================= */
  const referrals = JSON.parse(localStorage.getItem('referrals')) || [
    {
      id: "20221202",
      firstName: "Jennylyn",
      lastName: "Calabucal",
      dateAdded: "2025-09-12",
      status: "complete"
    },
    {
      id: "20221204",
      firstName: "Rochelle Jane",
      lastName: "Cepeda",
      dateAdded: "2025-04-26",
      status: "pending"
    }
  ];

  /* =============================
     RENDER HOME TABLE
  ============================= */
  function renderHomeTable() {
    const tbody = document.getElementById("studentTable");
    if (!tbody) return;

    tbody.innerHTML = "";

    referrals.forEach((ref) => {
      const row = document.createElement("tr");
      const statusText = ref.status === 'complete' ? 'Completed' : 'Submitted';
      
      row.innerHTML = `
        <td>${ref.id}</td>
        <td>${ref.lastName}, ${ref.firstName}</td>
        <td>${ref.dateAdded}</td>
        <td><span class="btn-view-status">${statusText}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  // Render table on page load
  renderHomeTable();
});