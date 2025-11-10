document.addEventListener("DOMContentLoaded", () => {
  /* =============================
     REFERRAL DATA STORAGE
  ============================= */
  let referrals = JSON.parse(localStorage.getItem('referrals')) || [
    {
      id: "20221202",
      firstName: "Jennylyn",
      middleName: "Cruz",
      lastName: "Calabucal",
      dateAdded: "2025-09-12",
      submittedBy: "Garcia, Shirbenly",
      level: "High School",
      grade: "8",
      contactNumber: "09301750922",
      age: "14",
      staff: "Ms. Garcia",
      adviser: "Mr. Santos",
      reason: "Struggling academically and often distracted in class.",
      status: "complete",
      appointment: ""
    },
    {
      id: "20221204",
      firstName: "Rochelle Jane",
      middleName: "Mae",
      lastName: "Cepeda",
      dateAdded: "2025-04-26",
      submittedBy: "Perez, Rubea",
      level: "Senior High School",
      grade: "11",
      contactNumber: "09944194531",
      age: "17",
      staff: "Ms. Perez",
      adviser: "Mrs. Lopez",
      reason: "Behavioral concerns and frequent absences.",
      status: "pending",
      appointment: "2025-11-10 09:30 AM"
    }
  ];

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
     RENDER TABLE
  ============================= */
  function renderTable() {
    const tbody = document.getElementById("studentTable");
    tbody.innerHTML = "";

    referrals.forEach((ref) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${ref.id}</td>
        <td>${ref.lastName}, ${ref.firstName}</td>
        <td>${ref.dateAdded}</td>
        <td>${ref.submittedBy}</td>
        <td><button class="btn-view-referral" data-id="${ref.id}">View</button></td>
        <td><button class="btn-view-appointment ${ref.status}" data-id="${ref.id}">${ref.status === 'complete' ? 'Complete' : 'Pending'}</button></td>
      `;
      tbody.appendChild(row);
    });

    attachViewButtons();
    attachAppointmentButtons();
  }

  /* =============================
     SEARCH FUNCTION
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

  /* =============================
     GRADE LIMITATION BASED ON LEVEL
  ============================= */
  const levelSelect = document.querySelector('select[name="level"]');
  const gradeSelect = document.querySelector('select[name="grade"]');

  if (levelSelect && gradeSelect) {
    levelSelect.addEventListener("change", function() {
      const level = this.value;
      gradeSelect.innerHTML = '<option value="" disabled selected>Select Grade</option>';

      if (level === "Elementary") {
        for (let i = 1; i <= 6; i++) {
          gradeSelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
      } else if (level === "High School") {
        for (let i = 7; i <= 10; i++) {
          gradeSelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
      } else if (level === "Senior High School") {
        gradeSelect.innerHTML += `<option value="11">11</option>`;
        gradeSelect.innerHTML += `<option value="12">12</option>`;
      }
    });
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
    form.reset();
  }

  if (addNewBtn && closeBtn && popup && form) {
    addNewBtn.addEventListener("click", openPopup);
    closeBtn.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = {
        id: formData.get("idnumber"),
        firstName: formData.get("firstName"),
        middleName: formData.get("middleName"),
        lastName: formData.get("lastName"),
        level: formData.get("level"),
        grade: formData.get("grade"),
        contactNumber: formData.get("contactnumber"),
        age: formData.get("age"),
        staff: formData.get("staff"),
        adviser: formData.get("adviser"),
        reason: formData.get("reason"),
        dateAdded: new Date().toISOString().split('T')[0],
        submittedBy: "Current User", // You can update this with actual logged-in user
        status: "pending",
        appointment: ""
      };

      // Validation
      if (data.firstName.length < 2) {
        alert("First name must be at least 2 characters!");
        return;
      }
      if (data.middleName.length < 2) {
        alert("Middle name must be at least 2 characters!");
        return;
      }
      if (data.lastName.length < 2) {
        alert("Last name must be at least 2 characters!");
        return;
      }
      if (parseInt(data.age) < 1) {
        alert("Age must be at least 1!");
        return;
      }

      // Confirmation
      if (!confirm("Are you sure you want to submit this referral?")) {
        return;
      }

      // Save to array and localStorage
      referrals.push(data);
      localStorage.setItem('referrals', JSON.stringify(referrals));

      // Success message
      alert("Referral submitted successfully!");
      
      // Refresh table and close popup
      renderTable();
      closePopup();
    });
  }

  /* =============================
     VIEW REFERRAL POPUP
  ============================= */
  function attachViewButtons() {
    const viewButtons = document.querySelectorAll(".btn-view-referral");

    const actionPopup = document.getElementById("actionPopup") || createActionPopup();

    viewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const refId = btn.getAttribute("data-id");
        const referral = referrals.find(r => r.id === refId);

        if (referral) {
          const actionContent = actionPopup.querySelector(".referral-details-content");
          actionContent.innerHTML = `
            <p><strong>ID:</strong> ${referral.id}</p>
            <p><strong>Name:</strong> ${referral.lastName}, ${referral.firstName} ${referral.middleName}</p>
            <p><strong>Level:</strong> ${referral.level}</p>
            <p><strong>Grade:</strong> ${referral.grade}</p>
            <p><strong>Age:</strong> ${referral.age}</p>
            <p><strong>Contact Number:</strong> ${referral.contactNumber}</p>
            <p><strong>Date Added:</strong> ${referral.dateAdded}</p>
            <p><strong>Submitted by:</strong> ${referral.submittedBy}</p>
            <p><strong>Staff:</strong> ${referral.staff}</p>
            <p><strong>Adviser:</strong> ${referral.adviser}</p>
            <p><strong>Status:</strong> ${referral.status}</p>
            <p><strong>Reason of Referral:</strong></p>
            <p style="padding: 10px; background: #222; border-radius: 6px; margin-top: 8px;">${referral.reason}</p>
          `;
          actionPopup.classList.add("show");
        }
      });
    });
  }

  function createActionPopup() {
    const actionPopup = document.createElement("div");
    actionPopup.id = "actionPopup";
    actionPopup.className = "action-popup-overlay";
    actionPopup.innerHTML = `
      <div class="action-popup-box">
        <span class="popup-close-btn" id="actionClose">&times;</span>
        <h2>Referral Details</h2>
        <div class="referral-details-content"></div>
      </div>
    `;
    document.body.appendChild(actionPopup);

    const actionClose = actionPopup.querySelector("#actionClose");
    actionClose.addEventListener("click", () => {
      actionPopup.classList.remove("show");
    });

    actionPopup.addEventListener("click", (e) => {
      if (e.target === actionPopup) actionPopup.classList.remove("show");
    });

    return actionPopup;
  }

  /* =============================
     FILTER TABS (All / Pending / Complete)
  ============================= */
  const filterTabs = document.querySelectorAll(".filter-tab");

  function filterReferrals(filter) {
    const rows = document.querySelectorAll("#studentTable tr");
    let hasVisible = false;

    rows.forEach((row) => {
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
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      filterTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      const filter = this.getAttribute("data-filter");
      filterReferrals(filter);
    });
  });

  /* =============================
     VIEW APPOINTMENT POPUP
  ============================= */
  function attachAppointmentButtons() {
    const appointmentButtons = document.querySelectorAll(".btn-view-appointment");

    const appointmentPopup = document.getElementById("appointmentPopup") || createAppointmentPopup();

    appointmentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const refId = btn.getAttribute("data-id");
        const referral = referrals.find(r => r.id === refId);

        if (referral) {
          const appointmentContent = appointmentPopup.querySelector(".appointment-content");
          const studentName = `${referral.lastName}, ${referral.firstName}`;

          if (referral.status === "complete") {
            appointmentContent.innerHTML = `
              <p><strong>Student:</strong> ${studentName}</p>
              <p class="complete-appointment-msg">This appointment has been completed.</p>
            `;
          } else if (referral.appointment && referral.appointment.trim() !== "") {
            appointmentContent.innerHTML = `
              <p><strong>Student:</strong> ${studentName}</p>
              <p><strong>Appointment Date:</strong> ${referral.appointment}</p>
            `;
          } else {
            appointmentContent.innerHTML = `
              <p><strong>Student:</strong> ${studentName}</p>
              <p class="no-appointment">No appointment has been set yet.</p>
            `;
          }
          appointmentPopup.classList.add("show");
        }
      });
    });
  }

  function createAppointmentPopup() {
    const appointmentPopup = document.createElement("div");
    appointmentPopup.id = "appointmentPopup";
    appointmentPopup.className = "appointment-popup-overlay";
    appointmentPopup.innerHTML = `
      <div class="appointment-popup-box">
        <span class="popup-close-btn" id="appointmentClose">&times;</span>
        <h2>Appointment Details</h2>
        <div class="appointment-content"></div>
      </div>
    `;
    document.body.appendChild(appointmentPopup);

    const appointmentClose = appointmentPopup.querySelector("#appointmentClose");
    appointmentClose.addEventListener("click", () => {
      appointmentPopup.classList.remove("show");
    });

    appointmentPopup.addEventListener("click", (e) => {
      if (e.target === appointmentPopup) {
        appointmentPopup.classList.remove("show");
      }
    });

    return appointmentPopup;
  }

  // Initial render
  renderTable();
});