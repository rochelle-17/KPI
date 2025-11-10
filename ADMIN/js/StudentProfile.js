document.addEventListener("DOMContentLoaded", () => {
  // Highlight active nav item
  const navItems = document.querySelectorAll(".nav-item")
  const currentPage = window.location.pathname.split("/").pop().toLowerCase()

  navItems.forEach((item) => {
    if (item.getAttribute("href").toLowerCase() === currentPage) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })

  const searchInput = document.getElementById("searchInput")
  const gradeFilter = document.getElementById("gradeFilter")
  const tableBody = document.getElementById("studentTable")
  const addStudentBtn = document.querySelector(".btn-add")

  // Load students on page load
  loadStudents()

  // Event listeners for filters
  searchInput.addEventListener("keyup", debounce(filterStudents, 300))
  gradeFilter.addEventListener("change", filterStudents)

  // Function to load students from API
  async function loadStudents(filters = {}) {
    try {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading students...</td></tr>'
      
      const response = await apiClient.getStudents(filters)

      if (response && response.success) {
        displayStudents(response.data)
      } else {
        const msg = (response && response.error) ? response.error : 'Failed to load students'
        console.error('loadStudents - API returned error:', msg, response)
        customAlert.error('Error loading students: ' + msg)
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">${msg}</td></tr>`
      }
    } catch (error) {
      console.error("Error loading students:", error)
      // Show a more informative message to the user when possible
      const message = error && error.message ? error.message : 'Error loading students'
      customAlert.error(message)
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">${message}</td></tr>`
    }
  }

  // Function to display students in table
  function displayStudents(students) {
    if (students.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No students found</td></tr>'
      return
    }

    tableBody.innerHTML = students
      .map((student) => {
        return `
        <tr data-id="${student._id}" style="cursor: pointer;">
          <td>${student.studentId}</td>
          <td>${student.lastName}, ${student.firstName}</td>
          <td>${student.level}</td>
          <td>${student.grade}</td>
          <td>${student.contactNumber || "N/A"}</td>
          <td>${student.adviser || "N/A"}</td>
        </tr>
      `
      })
      .join("")

    // Add click handlers to rows
    const rows = tableBody.querySelectorAll("tr")
    rows.forEach((row) => {
      row.addEventListener("click", () => {
        const id = row.getAttribute("data-id")
        openStudentModal(id)
      })
    })
  }

  // Function to filter students
  function filterStudents() {
    const searchValue = searchInput.value.toLowerCase().trim()
    const levelValue = gradeFilter.value

    const filters = {}

    if (searchValue) {
      filters.search = searchValue
    }

    if (levelValue !== "all") {
      const levelMap = {
        elem: "Elementary",
        jhs: "High School",
        shs: "Senior High School",
      }
      filters.level = levelMap[levelValue]
    }

    loadStudents(filters)
  }

  // Debounce function for search
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Add Student Button Click
  if (addStudentBtn) {
    addStudentBtn.addEventListener("click", () => {
      openStudentModal()
    })
  } else {
    // Fallback: use event delegation in case the button is rendered later or replaced
    console.warn("Add Student button (.btn-add) not found on initial load. Attaching delegated handler.")
    document.addEventListener('click', (e) => {
      const btn = e.target.closest ? e.target.closest('.btn-add') : null
      if (btn) openStudentModal()
    })
  }

  // Function to calculate age from date of birth
  function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return ""
    
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age >= 0 ? age : ""
  }

  // Function to format phone number
  function formatPhoneNumber(value) {
    const numbers = value.replace(/\D/g, '')
    return numbers.substring(0, 11)
  }

  // Function to get grade options based on level
  function getGradeOptions(level) {
    const gradeMap = {
      'Elementary': Array.from({ length: 6 }, (_, i) => i + 1),
      'High School': Array.from({ length: 4 }, (_, i) => i + 7),
      'Senior High School': [11, 12]
    }
    return gradeMap[level] || []
  }

  // Function to validate form
  function validateStudentForm(formData) {
    const errors = []

    // Student ID validation
    if (!formData.studentId || formData.studentId.trim() === "") {
      errors.push("Student ID is required")
    }

    // First Name validation
    if (!formData.firstName || formData.firstName.trim() === "") {
      errors.push("First name is required")
    }

    // Middle Name validation (2-100 characters)
    if (!formData.middleName || formData.middleName.trim() === "") {
      errors.push("Middle name is required")
    } else if (formData.middleName.length < 2) {
      errors.push("Middle name must be at least 2 characters")
    } else if (formData.middleName.length > 100) {
      errors.push("Middle name must not exceed 100 characters")
    }

    // Last Name validation
    if (!formData.lastName || formData.lastName.trim() === "") {
      errors.push("Last name is required")
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      errors.push("Date of birth is required")
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      if (birthDate > today) {
        errors.push("Date of birth cannot be in the future")
      }
    }

    // Age validation
    if (!formData.age || formData.age === "") {
      errors.push("Age is required")
    }

    // Contact Number validation (Philippine format: 11 digits starting with 09)
    if (!formData.contactNumber || formData.contactNumber.trim() === "") {
      errors.push("Contact number is required")
    } else if (!/^09\d{9}$/.test(formData.contactNumber)) {
      errors.push("Contact number must be 11 digits starting with 09 (e.g., 09123456789)")
    }

    // Adviser validation
    if (!formData.adviser || formData.adviser.trim() === "") {
      errors.push("Adviser name is required")
    }

    // Level validation
    if (!formData.level) {
      errors.push("Level is required")
    }

    // Grade validation
    if (!formData.grade) {
      errors.push("Grade is required")
    } else if (formData.level) {
      const grade = parseInt(formData.grade)
      
      if (formData.level === 'Elementary' && (grade < 1 || grade > 6)) {
        errors.push("Grade for Elementary must be between 1 and 6")
      } else if (formData.level === 'High School' && (grade < 7 || grade > 10)) {
        errors.push("Grade for High School must be between 7 and 10")
      } else if (formData.level === 'Senior High School' && (grade !== 11 && grade !== 12)) {
        errors.push("Grade for Senior High School must be 11 or 12")
      }
    }

    return errors
  }

  // Function to open student modal (create or edit)
  function openStudentModal(studentId = null) {
    const isEdit = studentId !== null
    
    // Create modal HTML
    const modalHTML = `
      <div id="studentModal" class="modal show">
        <div class="modal-content" style="max-width: 800px;">
          <div class="modal-header">
            <h2>${isEdit ? 'Edit Student' : 'Add New Student'}</h2>
            <button class="close-btn" id="closeModalBtn">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form id="studentForm" class="student-form" novalidate>
            <div class="form-section">
              <h3>Student Information</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="studentId">Student ID *</label>
                  <input type="text" id="studentId" name="studentId" required ${isEdit ? 'readonly' : ''}>
                  <span class="error-message" id="error-studentId"></span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name *</label>
                  <input type="text" id="firstName" name="firstName" required>
                  <span class="error-message" id="error-firstName"></span>
                </div>
                <div class="form-group">
                  <label for="middleName">Middle Name * </label>
                  <input type="text" id="middleName" name="middleName" minlength="2" maxlength="100" required>
                  <span class="error-message" id="error-middleName"></span>
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name *</label>
                  <input type="text" id="lastName" name="lastName" required>
                  <span class="error-message" id="error-lastName"></span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="dateOfBirth">Date of Birth *</label>
                  <input type="date" id="dateOfBirth" name="dateOfBirth" required>
                  <span class="error-message" id="error-dateOfBirth"></span>
                </div>
                <div class="form-group">
                  <label for="age">Age *</label>
                  <input type="number" id="age" name="age" readonly required>
                  <span class="error-message" id="error-age"></span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="contactNumber">Contact Number * (09XXXXXXXXX)</label>
                  <input type="tel" id="contactNumber" name="contactNumber" placeholder="09123456789" maxlength="11" required>
                  <span class="error-message" id="error-contactNumber"></span>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Academic Information</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="level">Level *</label>
                  <select id="level" name="level" required>
                    <option value="">Select level</option>
                    <option value="Elementary">Elementary</option>
                    <option value="High School">High School</option>
                    <option value="Senior High School">Senior High School</option>
                  </select>
                  <span class="error-message" id="error-level"></span>
                </div>
                <div class="form-group">
                  <label for="grade">Grade *</label>
                  <select id="grade" name="grade" required disabled>
                    <option value="">Select level first</option>
                  </select>
                  <span class="error-message" id="error-grade"></span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="section">Section</label>
                  <input type="text" id="section" name="section" placeholder="e.g., A, B, C">
                </div>
                <div class="form-group">
                  <label for="adviser">Adviser *</label>
                  <input type="text" id="adviser" name="adviser" required>
                  <span class="error-message" id="error-adviser"></span>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Guardian Information</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="guardianName">Guardian Name</label>
                  <input type="text" id="guardianName" name="guardianName">
                </div>
                <div class="form-group">
                  <label for="guardianContact">Guardian Contact</label>
                  <input type="tel" id="guardianContact" name="guardianContact">
                </div>
              </div>
              <div class="form-group">
                <label for="address">Address</label>
                <textarea id="address" name="address" rows="2"></textarea>
              </div>
            </div>

            <div class="form-section">
              <h3>Additional Information</h3>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email">
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" id="cancelBtn">Cancel</button>
              <button type="submit" class="submit-btn">${isEdit ? 'Update Student' : 'Add Student'}</button>
              ${isEdit ? '<button type="button" class="btn-danger" id="deleteBtn">Delete Student</button>' : ''}
            </div>
          </form>
        </div>
      </div>
    `

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML)
    document.body.style.overflow = "hidden"

    // Get form and modal elements
    const modal = document.getElementById("studentModal")
    const form = document.getElementById("studentForm")
    const closeBtn = document.getElementById("closeModalBtn")
    const cancelBtn = document.getElementById("cancelBtn")
    const levelSelect = document.getElementById("level")
    const gradeSelect = document.getElementById("grade")
    const dobInput = document.getElementById("dateOfBirth")
    const ageInput = document.getElementById("age")
    const contactInput = document.getElementById("contactNumber")

    // Level change handler - update grade options
    levelSelect.addEventListener("change", (e) => {
      const level = e.target.value
      gradeSelect.innerHTML = '<option value="">Select grade</option>'
      
      if (level) {
        gradeSelect.disabled = false
        const grades = getGradeOptions(level)
        grades.forEach(grade => {
          const option = document.createElement("option")
          option.value = grade
          option.textContent = `Grade ${grade}`
          gradeSelect.appendChild(option)
        })
      } else {
        gradeSelect.disabled = true
        gradeSelect.innerHTML = '<option value="">Select level first</option>'
      }
      
      // Clear error message
      document.getElementById("error-level").textContent = ""
      document.getElementById("error-grade").textContent = ""
    })

    // Date of birth change handler - calculate age
    dobInput.addEventListener("change", (e) => {
      const age = calculateAge(e.target.value)
      ageInput.value = age
      document.getElementById("error-dateOfBirth").textContent = ""
      document.getElementById("error-age").textContent = ""
    })

    // Contact number input handler - format Philippine number
    contactInput.addEventListener("input", (e) => {
      e.target.value = formatPhoneNumber(e.target.value)
      document.getElementById("error-contactNumber").textContent = ""
    })

    // Clear error on input
    const inputs = form.querySelectorAll("input, select, textarea")
    inputs.forEach(input => {
      input.addEventListener("input", () => {
        const errorElement = document.getElementById(`error-${input.id}`)
        if (errorElement) {
          errorElement.textContent = ""
        }
      })
    })

    // Close modal function
    function closeModal() {
      modal.remove()
      document.body.style.overflow = ""
    }

    // Close button events
    closeBtn.addEventListener("click", closeModal)
    cancelBtn.addEventListener("click", closeModal)
    
    // If editing, load student data
    if (isEdit) {
      loadStudentData(studentId, form)
      
      // Delete button handler
      const deleteBtn = document.getElementById("deleteBtn")
      if (deleteBtn) {
        deleteBtn.addEventListener("click", async () => {
          if (confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
            try {
              const response = await apiClient.deleteStudent(studentId)
              
              if (response.success) {
                customAlert.success("Student deleted successfully!")
                closeModal()
                loadStudents()
              }
            } catch (error) {
              console.error("Error deleting student:", error)
              customAlert.error("Error deleting student: " + error.message)
            }
          }
        })
      }
    }

    // Form submit handler with validation
    form.addEventListener("submit", async (e) => {
      e.preventDefault()
      
      // Clear previous errors
      document.querySelectorAll(".error-message").forEach(el => el.textContent = "")
      
      // Safely collect form values. Some optional fields (medical/academic/behavioral notes)
      // may not exist in the modal markup; use guards so the submit handler doesn't throw.
      const getValue = (id) => {
        const el = document.getElementById(id)
        return el && typeof el.value === 'string' ? el.value.trim() : ''
      }

      const formData = {
        studentId: getValue("studentId"),
        firstName: getValue("firstName"),
        middleName: getValue("middleName"),
        lastName: getValue("lastName"),
        dateOfBirth: getValue("dateOfBirth"),
        age: getValue("age"),
        contactNumber: getValue("contactNumber"),
        level: getValue("level"),
        grade: getValue("grade"),
        section: getValue("section"),
        adviser: getValue("adviser"),
        email: getValue("email"),
        guardianName: getValue("guardianName"),
        guardianContact: getValue("guardianContact"),
        address: getValue("address"),
        medicalNotes: getValue("medicalNotes"),
        academicNotes: getValue("academicNotes"),
        behavioralNotes: getValue("behavioralNotes"),
      }

      // Validate form
      const errors = validateStudentForm(formData)
      
      if (errors.length > 0) {
        // Display first error in alert
        customAlert.error(errors[0])
        
        // Display all errors in form
        errors.forEach(error => {
          if (error.includes("Student ID")) {
            document.getElementById("error-studentId").textContent = error
          } else if (error.includes("First name")) {
            document.getElementById("error-firstName").textContent = error
          } else if (error.includes("Middle name")) {
            document.getElementById("error-middleName").textContent = error
          } else if (error.includes("Last name")) {
            document.getElementById("error-lastName").textContent = error
          } else if (error.includes("Date of birth")) {
            document.getElementById("error-dateOfBirth").textContent = error
          } else if (error.includes("Age")) {
            document.getElementById("error-age").textContent = error
          } else if (error.includes("Contact number")) {
            document.getElementById("error-contactNumber").textContent = error
          } else if (error.includes("Adviser")) {
            document.getElementById("error-adviser").textContent = error
          } else if (error.includes("Level")) {
            document.getElementById("error-level").textContent = error
          } else if (error.includes("Grade")) {
            document.getElementById("error-grade").textContent = error
          }
        })
        
        return
      }
    })
  }

  // Function to load student data for editing
  async function loadStudentData(studentId, form) {
    try {
      const response = await apiClient.getStudentById(studentId)

      if (!response || !response.success) {
        const msg = (response && response.error) ? response.error : 'Failed to load student data'
        console.error('loadStudentData - API error', response)
        customAlert.error('Error loading student data: ' + msg)
        return
      }

      // success
      
      if (response.success) {
        const student = response.data
        
        // Populate form fields
        document.getElementById("studentId").value = student.studentId
        document.getElementById("firstName").value = student.firstName
        document.getElementById("middleName").value = student.middleName || ""
        document.getElementById("lastName").value = student.lastName
        document.getElementById("level").value = student.level
        
        // Trigger level change to populate grade options
        const levelSelect = document.getElementById("level")
        levelSelect.dispatchEvent(new Event("change"))
        
        // Set grade after options are populated
        setTimeout(() => {
          document.getElementById("grade").value = student.grade
        }, 0)
        
        document.getElementById("section").value = student.section || ""
        document.getElementById("contactNumber").value = student.contactNumber || ""
        document.getElementById("email").value = student.email || ""
        document.getElementById("guardianName").value = student.guardianName || ""
        document.getElementById("guardianContact").value = student.guardianContact || ""
        document.getElementById("address").value = student.address || ""
        document.getElementById("adviser").value = student.adviser || ""
        document.getElementById("medicalNotes").value = student.medicalNotes || ""
        document.getElementById("academicNotes").value = student.academicNotes || ""
        document.getElementById("behavioralNotes").value = student.behavioralNotes || ""
        
        if (student.dateOfBirth) {
          const date = new Date(student.dateOfBirth)
          const dateStr = date.toISOString().split('T')[0]
          document.getElementById("dateOfBirth").value = dateStr
          document.getElementById("age").value = calculateAge(dateStr)
        }
      }
    } catch (error) {
      console.error("Error loading student:", error)
      const msg = error && error.message ? error.message : 'Error loading student data'
      customAlert.error(msg)
    }
  }

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

})