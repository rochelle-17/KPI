document.addEventListener("DOMContentLoaded", () => {
  // Highlight active nav
  const navItems = document.querySelectorAll(".nav-item")
  const currentPage = window.location.pathname.split("/").pop()
  navItems.forEach((item) => {
    if (item.getAttribute("href") === currentPage) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })

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


  // Load stats and referrals
  updateStats()
  loadRecentReferrals()
  loadReferralChart()

  // ========== UPDATE STATS ==========
  async function updateStats() {
    try {
      const response = await apiClient.getReferralStats()
      console.log("📊 Referral stats:", response)

      if (response.success) {
        const stats = response.data
        const statValues = document.querySelectorAll(".stat-value")
        
        if (statValues.length >= 4) {
          // Backend sends { total, byLevel: { elementary, highSchool, seniorHighSchool } }
          statValues[0].textContent = stats.total || 0
          statValues[1].textContent = stats.byLevel.elementary || 0
          statValues[2].textContent = stats.byLevel.highSchool || 0
          statValues[3].textContent = stats.byLevel.seniorHighSchool || 0
        }
      }
    } catch (error) {
      console.error("Error loading stats:", error)
      const statValues = document.querySelectorAll(".stat-value")
      statValues.forEach(val => val.textContent = "0")
    }
  }

// ========== LOAD RECENT REFERRALS ==========
async function loadRecentReferrals(filter = "all") {
  const referralsContent = document.querySelector(".referrals-content");

  try {
    referralsContent.innerHTML = '<p class="empty-state">Loading referrals...</p>';

    // Map front-end filters to actual API field values
    const levelMap = {
      elementary: "Elementary",
      "high school": "High School",
      "senior high school": "Senior High School",
    };

    // Construct filters for API
    const filters = {};
    if (filter !== "all") {
      filters.level = levelMap[filter.toLowerCase()] || filter;
    }

    console.log("🔍 Filtering referrals by:", filters.level || "all levels"); 

    const response = await apiClient.getReferrals(filters);

    if (response.success && response.data.length > 0) {
      // Take the most recent 10 referrals - API already filters by level
      const recentReferrals = response.data.slice(0, 10);

      if (recentReferrals.length === 0) {
        referralsContent.innerHTML = `<p class="empty-state">No referrals found</p>`;
        return;
      }

      referralsContent.innerHTML = `
        <div class="referral-list">
          ${recentReferrals
            .map((referral) => {
              const date = new Date(referral.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const fullName = [referral.firstName, referral.middleName, referral.lastName].filter(Boolean).join(' ')
              const displayName = fullName || referral.studentName || referral.studentId || 'Unknown'
              return `
                <div class="referral-item" onclick="window.location.href='Referral.html'">
                  <div class="referral-main">
                    <div class="referral-name">${displayName}</div>
                    <div class="referral-meta">
                      <span class="referral-level">${referral.level}</span>
                      <span class="referral-separator">•</span>
                      <span class="referral-grade">Grade ${referral.grade}</span>
                    </div>
                  </div>
                  <div class="referral-reason">${referral.reason}</div>
                  <div class="referral-date">${date}</div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    } else {
      referralsContent.innerHTML = `<p class="empty-state">No referrals found</p>`;
    }
  } catch (error) {
    console.error("Error loading referrals:", error);
    referralsContent.innerHTML = '<p class="empty-state">Error loading referrals</p>';
  }
}


  // ========== REFERRAL CHART ==========
  let referralChart = null;
  let doughnutChart = null;

  // Helper to build labels for last N months or days
  function buildTimeLabels(granularity) {
    const labels = [];
    const now = new Date();

    if (granularity === "month") {
      // last 6 months (including current)
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(d.toLocaleString("en-US", { month: "short", year: "numeric" }));
      }
    } else {
      // last 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
      }
    }

    return labels;
  }

  function labelForDate(dateObj, granularity) {
    if (granularity === "month") {
      return dateObj.toLocaleString("en-US", { month: "short", year: "numeric" });
    }
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  async function loadReferralChart(granularity = "month") {
    try {
      const response = await apiClient.getReferrals();
      console.log("📈 Referral data for chart:", response);

      const chartContainer = document.getElementById("referralChart");
      if (!chartContainer) return;

      if (!response.success || !Array.isArray(response.data)) {
        console.warn("No referral data available for chart")
        return;
      }

      const labels = buildTimeLabels(granularity);

      // Initialize counts
      const elementaryCounts = Array(labels.length).fill(0);
      const highCounts = Array(labels.length).fill(0);
      const seniorCounts = Array(labels.length).fill(0);

      // Aggregate referrals into buckets
      response.data.forEach((r) => {
        if (!r.createdAt) return;
        const d = new Date(r.createdAt);
        const lbl = labelForDate(d, granularity);
        const idx = labels.indexOf(lbl);
        if (idx === -1) return; // outside range

        const level = (r.level || "").toString();
        if (level === "Elementary") elementaryCounts[idx]++;
        else if (level === "High School") highCounts[idx]++;
        else if (level === "Senior High School") seniorCounts[idx]++;
      });

      // Prepare datasets
      const datasets = [
        {
          label: "Elementary",
          data: elementaryCounts,
          borderColor: "#27AE60",
          backgroundColor: "rgba(39,174,96,0.08)",
          tension: 0.3,
          pointRadius: 3,
        },
        {
          label: "High School",
          data: highCounts,
          borderColor: "#E74C3C",
          backgroundColor: "rgba(231,76,60,0.08)",
          tension: 0.3,
          pointRadius: 3,
        },
        {
          label: "Senior High School",
          data: seniorCounts,
          borderColor: "#8E44AD",
          backgroundColor: "rgba(142,68,173,0.08)",
          tension: 0.3,
          pointRadius: 3,
        },
      ];

      // Create or update Chart
      const ctx = chartContainer.getContext("2d");
      if (referralChart) {
        referralChart.data.labels = labels;
        referralChart.data.datasets.forEach((ds, i) => (ds.data = datasets[i].data));
        referralChart.update();
      } else {
        referralChart = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              tooltip: { mode: "index", intersect: false },
            },
            interaction: { mode: "nearest", axis: "x", intersect: false },
            scales: {
              x: { display: true },
              y: { display: true, beginAtZero: true, ticks: { precision: 0 } },
            },
          },
        });
      }
    } catch (error) {
      console.error("Error loading referral chart:", error);
    }
  }

  // ========== DOUGHNUT (STATUS) CHART ==========
  async function loadDoughnut(status = "all") {
    try {
      const response = await apiClient.getReferrals();
      if (!response.success || !Array.isArray(response.data)) return;

      const referrals = response.data;

      const doughnutCtx = document.getElementById("referralDoughnut");
      if (!doughnutCtx) return;

      let labels = [];
      let data = [];
      let backgroundColor = [];

      if (status === "all") {
        // Distribution by status
        const pending = referrals.filter(r => r.status === 'Pending').length;
        const inProgress = referrals.filter(r => r.status === 'In Progress').length;
        const complete = referrals.filter(r => r.status === 'Complete').length;

        labels = ['Pending', 'In Progress', 'Complete'];
        data = [pending, inProgress, complete];
        backgroundColor = ['#F59E0B', '#3B82F6', '#10B981'];
      } else {
        // For a specific status, show breakdown by level
        const filtered = referrals.filter(r => r.status === status);
        const elem = filtered.filter(r => r.level === 'Elementary').length;
        const jhs = filtered.filter(r => r.level === 'High School').length;
        const shs = filtered.filter(r => r.level === 'Senior High School').length;

        labels = ['Elementary', 'High School', 'Senior High School'];
        data = [elem, jhs, shs];
        backgroundColor = ['#27AE60', '#E74C3C', '#8E44AD'];
      }

      const ctx = doughnutCtx.getContext('2d');

      if (doughnutChart) {
        doughnutChart.data.labels = labels;
        doughnutChart.data.datasets[0].data = data;
        doughnutChart.data.datasets[0].backgroundColor = backgroundColor;
        doughnutChart.update();
      } else {
        doughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{ data, backgroundColor, hoverOffset: 8 }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { color: '#fff' } },
              tooltip: { mode: 'nearest' }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading doughnut chart:', error);
    }
  }

  // Chart granularity dropdown
  const granSelect = document.getElementById("chartGranularity");
  if (granSelect) {
    granSelect.addEventListener("change", function () {
      const g = this.value;
      loadReferralChart(g);
    });
    // ensure initial chart uses selected value (default month)
    const initialGran = granSelect.value || "month";
    // set select to initial value explicitly (in case of markup changes)
    granSelect.value = initialGran;
    // load chart with selected granularity
    loadReferralChart(initialGran);
  }

  // Doughnut status filter
  const doughnutFilter = document.getElementById('doughnutStatusFilter');
  if (doughnutFilter) {
    // initial load
    loadDoughnut(doughnutFilter.value || 'all');
    doughnutFilter.addEventListener('change', function() {
      const v = this.value || 'all';
      loadDoughnut(v);
    });
  }


  // ========== FILTER TABS ==========
  const filterTabs = document.querySelectorAll(".filter-tab")

    filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      filterTabs.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      const filter = this.getAttribute("data-filter")
      console.log("🎯 Clicked filter:", filter);
      loadRecentReferrals(filter)
    })
  })
  const statCards = document.querySelectorAll(".stat-card")
  statCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      console.log("Hovered:", this.querySelector(".stat-label").textContent)
    })
  })
})