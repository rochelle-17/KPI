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
     SEARCH FUNCTION
  ============================= */
  const searchInput = document.getElementById("searchInput");
  const tableRows = document.querySelectorAll("#studentTable tr");

  function filterStudents() {
    const searchValue = searchInput.value.toLowerCase().trim();
    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchValue) ? "" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", filterStudents);
  }

  /* =============================
     REFERRAL ADD POPUP
  ============================= */
  const addNewBtn = document.getElementById("addNewBtn");
  const popup = document.getElementById("referralPopup");
  const closeBtn = document.getElementById("closeBtn");
  const form = document.getElementById("referralForm");

  function openPopup() {
    popup.classList.add("show");
    addNewBtn.style.display = "none";
  }

  function closePopup() {
    popup.classList.remove("show");
    addNewBtn.style.display = "block";
  }

  if (addNewBtn && closeBtn && popup && form) {
    addNewBtn.addEventListener("click", openPopup);
    closeBtn.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      console.log("Referral saved:", data);
      alert("Referral saved successfully!");
      form.reset();
      closePopup();
    });
  }

  /* =============================
     VIEW REFERRAL POPUP
  ============================= */
  const viewButtons = document.querySelectorAll(".btn-view-referral");

  const actionPopup = document.createElement("div");
  actionPopup.className = "action-popup-overlay";
  actionPopup.innerHTML = `
    <div class="action-popup-box">
      <span class="popup-close-btn" id="actionClose">&times;</span>
      <h2>Referral Details</h2>
      <div class="referral-details-content"></div>
    </div>
  `;
  document.body.appendChild(actionPopup);

  const actionContent = actionPopup.querySelector(".referral-details-content");
  const actionClose = actionPopup.querySelector("#actionClose");

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const cells = row.querySelectorAll("td");

      actionContent.innerHTML = `
        <p><strong>ID:</strong> ${cells[0].textContent}</p>
        <p><strong>Name:</strong> ${cells[1].textContent}</p>
        <p><strong>Date Added:</strong> ${cells[2].textContent}</p>
        <p><strong>Submitted by:</strong> ${cells[3].textContent}</p>
        <p><strong>Status:</strong> ${cells[5].textContent}</p>
        <p><strong>Reason of Referral:</strong> Behavior concerns in class (sample data)</p>
      `;
      actionPopup.classList.add("show");
    });
  });

  if (actionClose) {
    actionClose.addEventListener("click", () => {
      actionPopup.classList.remove("show");
    });
  }

  actionPopup.addEventListener("click", (e) => {
    if (e.target === actionPopup) actionPopup.classList.remove("show");
  });

  /* =============================
     FILTER TABS (Pending / Complete)
  ============================= */
  const filterTabs = document.querySelectorAll(".filter-tab");
  const referralRows = document.querySelectorAll("#studentTable tr");
  const referralsContainer = document.querySelector(".table-container");

  function filterReferrals(filter) {
    let hasVisible = false;

    referralRows.forEach((row) => {
      const statusButton = row.querySelector(".btn-view-appointment");
      if (!statusButton) return;
      const status = statusButton.textContent.toLowerCase();

      if (filter === "all" || status.includes(filter)) {
        row.style.display = "";
        hasVisible = true;
      } else {
        row.style.display = "none";
      }
    });

    // Show "no data" message
    let emptyMsg = document.querySelector(".empty-state");
    if (!hasVisible) {
      if (!emptyMsg) {
        emptyMsg = document.createElement("p");
        emptyMsg.className = "empty-state";
        emptyMsg.textContent = `No referrals to display for ${filter}.`;
        referralsContainer.appendChild(emptyMsg);
      }
    } else if (emptyMsg) {
      emptyMsg.remove();
    }
  }

  // Make filter buttons work
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      filterTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      const filter = this.getAttribute("data-filter");
      filterReferrals(filter);
    });
  });

  // ✅ Default: show "Pending" referrals on page load
  const defaultTab = document.querySelector('.filter-tab[data-filter="all"]');
  if (defaultTab) {
    defaultTab.classList.add("active");
    filterReferrals("all");
  }

  /* =============================
     VIEW APPOINTMENT POPUP
  ============================= */
  const appointmentButtons = document.querySelectorAll(".btn-view-appointment");

  const appointmentPopup = document.createElement("div");
  appointmentPopup.className = "appointment-popup-overlay";
  appointmentPopup.innerHTML = `
    <div class="appointment-popup-box">
      <span class="popup-close-btn" id="appointmentClose">&times;</span>
      <h2>Appointment Details</h2>
      <div class="appointment-content"></div>
    </div>
  `;
  document.body.appendChild(appointmentPopup);

  const appointmentContent = appointmentPopup.querySelector(".appointment-content");
  const appointmentClose = appointmentPopup.querySelector("#appointmentClose");

  appointmentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const appointment = btn.getAttribute("data-appointment");
      const row = btn.closest("tr");
      const studentName = row ? row.cells[1].textContent : "Unknown Student";

      if (appointment && appointment.trim() !== "") {
  // CASE 1: Appointment exists
  appointmentContent.innerHTML = `
    <p><strong>Student:</strong> ${studentName}</p>
    <p><strong>Appointment Date:</strong> ${appointment}</p>
  `;
} else if (status === "pending") {
  // CASE 2: No appointment yet (Pending)
  appointmentContent.innerHTML = `
    <p><strong>Student:</strong> ${studentName}</p>
    <p class="no-appointment-msg">No appointment has been set yet.</p>
  `;
} else if (status === "complete") {
  // CASE 3: Appointment completed
  appointmentContent.innerHTML = `
    <p><strong>Student:</strong> ${studentName}</p>
    <p class="complete-appointment-msg">This appointment has been completed.</p>
  `;
} else {
  // Fallback (if no status found)
  appointmentContent.innerHTML = `
    <p><strong>Student:</strong> ${studentName}</p>
    <p class="no-appointment-msg">No information available.</p>
  `;
}
      appointmentPopup.classList.add("show");
    });
  });

  appointmentClose.addEventListener("click", () => {
    appointmentPopup.classList.remove("show");
  });

  appointmentPopup.addEventListener("click", (e) => {
    if (e.target === appointmentPopup) {
      appointmentPopup.classList.remove("show");
    }
  });
});
