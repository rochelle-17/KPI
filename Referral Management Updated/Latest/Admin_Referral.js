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

  profileButton.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("show");
  });

  window.addEventListener("click", (event) => {
    if (!event.target.closest("#profileDropdown")) {
      profileDropdown.classList.remove("show");
    }
  });

  /* =============================
     SEARCH + GRADE FILTER
  ============================= */
  const searchInput = document.getElementById("searchInput");
  const gradeFilter = document.getElementById("gradeFilter");
  const tableRows = document.querySelectorAll("#studentTable tr");

  function filterStudents() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const gradeValue = gradeFilter.value.toLowerCase().trim();

    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const levelCell = row.cells[2];
      const level = levelCell ? levelCell.textContent.toLowerCase().trim() : "";

      const matchesSearch = text.includes(searchValue);
      let matchesGrade = false;

      if (gradeValue === "all") matchesGrade = true;
      else if (gradeValue === "elem" && level.includes("elementary")) matchesGrade = true;
      else if (gradeValue === "jhs" && level.includes("jhs")) matchesGrade = true;
      else if (gradeValue === "shs" && level.includes("shs")) matchesGrade = true;

      row.style.display = matchesSearch && matchesGrade ? "" : "none";
    });
  }

  if (searchInput && gradeFilter) {
    searchInput.addEventListener("keyup", filterStudents);
    gradeFilter.addEventListener("change", filterStudents);
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

  /* =============================
     ACTION POPUP (View Referral)
  ============================= */
  const viewButtons = document.querySelectorAll(".btn-view-referral");

  // Create the Action Popup dynamically
  const actionPopup = document.createElement("div");
  actionPopup.className = "action-popup-overlay";
  actionPopup.innerHTML = `
    <div class="action-popup-box">
      <span class="popup-close-btn" id="actionClose">&times;</span>
      <h2>Referral Details</h2>
      <div class="referral-details-content"></div>
      <div class="action-popup-buttons">
        <button class="btn-close" id="cancelAction">Close</button>
        <button class="btn-proceed" id="proceedBtn">Proceed</button>
      </div>
    </div>
  `;
  document.body.appendChild(actionPopup);

  const actionContent = actionPopup.querySelector(".referral-details-content");
  const actionClose = actionPopup.querySelector("#actionClose");
  const cancelAction = actionPopup.querySelector("#cancelAction");
  const proceedBtn = actionPopup.querySelector("#proceedBtn");

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const cells = row.querySelectorAll("td");

      // Fill popup details dynamically
      actionContent.innerHTML = `
        <p><strong>ID:</strong> ${cells[0].textContent}</p>
        <p><strong>Name:</strong> ${cells[1].textContent}</p>
        <p><strong>Level:</strong> ${cells[2].textContent}</p>
        <p><strong>Grade:</strong> ${cells[3].textContent}</p>
        <p><strong>Date Added:</strong> ${cells[4].textContent}</p>
        <p><strong>Submitted by:</strong> ${cells[5].textContent}</p>
        <p><strong>Reason of Referral:</strong> Behavior concerns in class (sample data)</p>
      `;
      actionPopup.classList.add("show");
    });
  });

  [actionClose, cancelAction].forEach((btn) =>
    btn.addEventListener("click", () => actionPopup.classList.remove("show"))
  );
  actionPopup.addEventListener("click", (e) => {
    if (e.target === actionPopup) actionPopup.classList.remove("show");
  });

  /* =============================
     APPOINTMENT POPUP (After Proceed)
  ============================= */
  const appointmentPopup = document.createElement("div");
  appointmentPopup.className = "appointment-popup-overlay";
  appointmentPopup.innerHTML = `
    <div class="appointment-popup-box">
      <span class="popup-close-btn" id="appointmentClose">&times;</span>
      <h2>Set Appointment</h2>
      <form id="appointmentForm" class="appointment-form">
        <label>Date:
          <input type="date" name="appointmentDate" required>
        </label>
        <label>Time:
          <input type="time" name="appointmentTime" required>
        </label>
        <div class="appointment-actions">
          <button type="submit" class="appointment-save-btn">Save Appointment</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(appointmentPopup);

  const appointmentClose = appointmentPopup.querySelector("#appointmentClose");
  const appointmentForm = appointmentPopup.querySelector("#appointmentForm");

  proceedBtn.addEventListener("click", () => {
    actionPopup.classList.remove("show");
    appointmentPopup.classList.add("show");
  });

  appointmentClose.addEventListener("click", () => appointmentPopup.classList.remove("show"));
  appointmentPopup.addEventListener("click", (e) => {
    if (e.target === appointmentPopup) appointmentPopup.classList.remove("show");
  });

  appointmentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(appointmentForm).entries());
    console.log("Appointment saved:", data);
    alert(`Appointment set on ${data.appointmentDate} at ${data.appointmentTime}`);
    appointmentPopup.classList.remove("show");
    appointmentForm.reset();
  });

/* =============================
   INTERVIEW COUNSELING FORM POPUP
============================= */
const counselingButtons = document.querySelectorAll(".btn-view-appointment");

// Create Interview Counseling Popup
const counselingPopup = document.createElement("div");
counselingPopup.className = "counseling-popup-overlay";
counselingPopup.innerHTML = `
  <div class="counseling-popup-box">
    <span class="counseling-close-btn" id="counselingClose">&times;</span>
    <h2>Interview Counseling Form</h2>
    <form id="interviewForm" class="counseling-form">
      <div class="two-col">
        <label>Student Name:
          <input type="text" name="studentName" id="studentName" readonly required>
        </label>
        <label>Student ID:
          <input type="text" name="studentID" id="studentID" placeholder="Enter ID" required>
        </label>
      </div>

      <div class="two-col">
        <label>Date of Interview:
          <input type="date" name="interviewDate" id="interviewDate" required>
        </label>
        <label>Time:
          <input type="time" name="interviewTime" id="interviewTime" required>
        </label>
      </div>

      <label>Type of Counseling:
        <select name="counselingType" id="counselingType" required>
          <option value="">Select Type</option>
          <option value="initial">Initial Interview</option>
          <option value="follow-up">Follow-Up Counseling</option>
          <option value="academic">Academic Concern</option>
          <option value="personal">Personal Concern</option>
          <option value="career">Career Guidance</option>
        </select>
      </label>

      <label>Reason for Counseling:
        <textarea name="reason" id="reason" rows="3" placeholder="State the reason for the interview..." required></textarea>
      </label>

      <label>Interview Summary:
        <textarea name="summary" id="summary" rows="4" placeholder="Summarize what was discussed during the counseling..." required></textarea>
      </label>

      <label>Counselor’s Remarks:
        <textarea name="remarks" id="remarks" rows="3" placeholder="Enter counselor's remarks..." required></textarea>
      </label>

      <label>Recommendation / Action Plan:
        <textarea name="recommendation" id="recommendation" rows="3" placeholder="List any suggested actions or follow-ups..." required></textarea>
      </label>

      <div class="two-col">
        <label>Counselor’s Name:
          <input type="text" name="counselorName" id="counselorName" placeholder="Enter counselor’s name" required>
        </label>
        <label>Signature:
          <input type="text" name="signature" id="signature" placeholder="Counselor’s signature" required>
        </label>
      </div>

      <div class="counseling-actions">
        <button type="submit" class="counseling-save-btn">Save Interview Record</button>
      </div>
    </form>
  </div>
`;
document.body.appendChild(counselingPopup);

const counselingClose = counselingPopup.querySelector("#counselingClose");
const interviewForm = counselingPopup.querySelector("#interviewForm");

counselingButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const row = btn.closest("tr");
    const studentName = row ? row.cells[1].textContent.trim() : "Unknown";

    // Autofill name + date + time
    document.getElementById("studentName").value = studentName;
    document.getElementById("interviewDate").value = new Date().toISOString().split("T")[0];
    document.getElementById("interviewTime").value = new Date().toTimeString().slice(0, 5);

    counselingPopup.classList.add("show");
  });
});

counselingClose.addEventListener("click", () => counselingPopup.classList.remove("show"));
counselingPopup.addEventListener("click", (e) => {
  if (e.target === counselingPopup) counselingPopup.classList.remove("show");
});

interviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(interviewForm).entries());
  console.log("Interview Counseling Record Saved:", data);
  alert(`Interview Counseling Record for ${data.studentName} saved successfully!`);
  interviewForm.reset();
  counselingPopup.classList.remove("show");
});

});
