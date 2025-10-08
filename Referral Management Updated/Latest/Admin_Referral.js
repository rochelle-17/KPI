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

  // ======== Search + Grade Filter ========
  const searchInput = document.getElementById("searchInput");
  const gradeFilter = document.getElementById("gradeFilter");
  const tableRows = document.querySelectorAll("#studentTable tbody tr");

  function filterStudents() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const gradeValue = gradeFilter.value.toLowerCase().trim();

    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const gradeCell = row.cells[2]; // adjust if your grade column changes
      const grade = gradeCell ? gradeCell.textContent.toLowerCase().trim() : "";

      const matchesSearch = text.includes(searchValue);

      let matchesGrade = false;
      if (gradeValue === "all") {
        matchesGrade = true;
      } else if (gradeValue === "elem" && grade.includes("elementary")) {
        matchesGrade = true;
      } else if (gradeValue === "jhs" && grade.includes("jhs")) {
        matchesGrade = true;
      } else if (gradeValue === "shs" && grade.includes("shs")) {
        matchesGrade = true;
      }

      row.style.display = matchesSearch && matchesGrade ? "" : "none";
    });
  }

  if (searchInput && gradeFilter) {
    searchInput.addEventListener("keyup", filterStudents);
    gradeFilter.addEventListener("change", filterStudents);
  }
  // ======== Referral Popup ========
  const addNewBtn = document.getElementById("addNewBtn");
  const popup = document.getElementById("referralPopup");
  const closeBtn = document.getElementById("closeBtn");
  const form = document.getElementById("referralForm");

  if (addNewBtn && popup && closeBtn && form) {
    // Open popup
    addNewBtn.addEventListener("click", () => {
      popup.classList.add("show");
      addNewBtn.style.display = "none";
    });

    // Close popup
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("show");
      addNewBtn.style.display = "block";
    });

    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        popup.classList.remove("show");
        addNewBtn.style.display = "block";
      }
    });

    // Form submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      console.log("Referral saved:", data);
      alert("Referral saved successfully!");
      form.reset();
      popup.classList.remove("show");
      addNewBtn.style.display = "block";
    });
  }
});