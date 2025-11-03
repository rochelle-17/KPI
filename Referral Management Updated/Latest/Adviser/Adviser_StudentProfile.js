// Highlight active nav item
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  navItems.forEach((item) => {
    if (item.getAttribute("href").toLowerCase() === currentPage) {
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

const searchInput = document.getElementById("searchInput");
const gradeFilter = document.getElementById("gradeFilter");
const tableRows = document.querySelectorAll("#studentTable tr");

// Function to filter students
function filterStudents() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const gradeValue = gradeFilter.value.toLowerCase().trim();

  tableRows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    const grade = row.cells[2].textContent.toLowerCase().trim(); // Level column

    const matchesSearch = text.includes(searchValue);

    // map dropdown to actual cell text
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

    row.style.display = (matchesSearch && matchesGrade) ? "" : "none";
  });
}


// Event listeners
searchInput.addEventListener("keyup", filterStudents);
gradeFilter.addEventListener("change", filterStudents);


});



