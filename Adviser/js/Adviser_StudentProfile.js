document.addEventListener("DOMContentLoaded", () => {
  /* =============================
     ACTIVE NAV HIGHLIGHT
  ============================= */
  const navItems = document.querySelectorAll(".nav-item");
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  navItems.forEach((item) => {
    if (item.getAttribute("href").toLowerCase() === currentPage) {
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
      contactNumber: "09301750922",
      status: "pending"
    },
    {
      id: "20221204",
      firstName: "Rochelle Jane",
      lastName: "Cepeda",
      contactNumber: "09944194531",
      status: "complete"
    }
  ];

  /* =============================
     RENDER STUDENT PROFILE TABLE
  ============================= */
  function renderStudentTable() {
    const tbody = document.getElementById("studentTable");
    if (!tbody) return;

    tbody.innerHTML = "";

    referrals.forEach((ref) => {
      const row = document.createElement("tr");
      const guidanceStatus = ref.status === 'complete' ? 'Completed' : '--No Data--';
      
      row.innerHTML = `
        <td>${ref.id}</td>
        <td>${ref.lastName}, ${ref.firstName}</td>
        <td>${guidanceStatus}</td>
        <td>${ref.contactNumber}</td>
      `;
      tbody.appendChild(row);
    });
  }

  /* =============================
     SEARCH FILTER
  ============================= */
  const searchInput = document.getElementById("searchInput");

  function filterStudents() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const rows = document.querySelectorAll("#studentTable tr");

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchValue) ? "" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", filterStudents);
  }

  // Initial render
  renderStudentTable();
});