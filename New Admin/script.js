// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all items
      navItems.forEach((nav) => nav.classList.remove("active"))

      // Add active class to clicked item
      this.classList.add("active")

      // Get the navigation title
      const navTitle = this.querySelector(".nav-title").textContent

      // Update page title in header
      document.querySelector(".page-title").textContent = navTitle

      console.log("[v0] Navigation clicked:", navTitle)
    })
  })

  // Simulate data loading (you can replace this with actual API calls)
  function updateStats() {
    const stats = {
      total: Math.floor(Math.random() * 100),
      elementary: Math.floor(Math.random() * 30),
      juniorHigh: Math.floor(Math.random() * 30),
      seniorHigh: Math.floor(Math.random() * 40),
    }

    // Uncomment below to see dynamic stats
    const statValues = document.querySelectorAll('.stat-value');
    statValues[0].textContent = stats.total;
    statValues[1].textContent = stats.elementary;
    statValues[2].textContent = stats.juniorHigh;
    statValues[3].textContent = stats.seniorHigh;
  }

  // Add hover effects for stat cards
  const statCards = document.querySelectorAll(".stat-card")
  statCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      console.log("[v0] Stat card hovered:", this.querySelector(".stat-label").textContent)
    })
  })

  const filterTabs = document.querySelectorAll(".filter-tab")
  const referralsContent = document.querySelector(".referrals-content")

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      filterTabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Get the filter value
      const filter = this.getAttribute("data-filter")

      // Update content based on filter
      updateReferralsContent(filter)
    })
  })

  function updateReferralsContent(filter) {
    // This is where you would filter and display referrals based on the selected filter
    // For now, we'll just show the empty state
    const content = `<p class="empty-state">No referrals to display for ${filter === "all" ? "all levels" : filter}</p>`

    referralsContent.innerHTML = content
  }
})
