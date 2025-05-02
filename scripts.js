// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Resizing
    const sidebar = document.querySelector('.sidebar');
    const resizeHandle = document.querySelector('.sidebar-resize-handle');
    let isResizing = false;
  
    if (resizeHandle && sidebar) {
      resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
      });
  
      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = Math.max(200, Math.min(500, e.clientX));
        sidebar.style.width = `${newWidth}px`;
      });
  
      document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.cursor = 'default';
      });
    } else {
      console.warn('Sidebar or resize handle not found');
    }
  
    // Dark Mode Toggle
    const darkToggle = document.getElementById('darkModeToggle');
    const body = document.body;
  
    if (localStorage.getItem('darkMode') === 'enabled') {
      body.classList.add('dark');
      if (darkToggle) darkToggle.checked = true;
    }
  
    if (darkToggle) {
      darkToggle.addEventListener('change', () => {
        body.classList.toggle('dark');
        localStorage.setItem('darkMode', body.classList.contains('dark') ? 'enabled' : 'disabled');
        if (window.analyticsChart) window.analyticsChart.update();
        if (window.trendChart) window.trendChart.update();
      });
    }
  
    // Dashboard Counters
    const cardsSection = document.querySelector('.cards');
    if (cardsSection) {
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        updateDashboard();
        document.getElementById('branchSelector')?.addEventListener('change', updateDashboard);
      } else if (window.location.pathname.includes('admin-dashboard.html')) {
        updateAdminDashboard();
        document.getElementById('branchSelector')?.addEventListener('change', updateAdminDashboard);
      } else if (window.location.pathname.includes('faculty-dashboard.html')) {
        updateFacultyDashboard();
      }
    }
  
    // Analytics
    const analyticsChartCanvas = document.getElementById('analyticsChart');
    if (analyticsChartCanvas) {
      const branchSelect = document.getElementById('branchSelect');
      const chartTypeSelect = document.getElementById('chartType');
  
      if (!branchSelect || !chartTypeSelect) {
        console.error('Branch or Chart Type select elements not found');
        return;
      }
  
      function renderAnalyticsChart(branch = 'ALL', type = 'pie') {
        const ctx = analyticsChartCanvas.getContext('2d');
        if (!ctx) {
          console.error('Analytics chart canvas context not found');
          return;
        }
  
        if (window.analyticsChart) window.analyticsChart.destroy();
  
        const chartData = {
          ALL: { placed: 505, shortlisted: 100, notPlaced: 25 },
          CSE: { placed: 145, shortlisted: 30, notPlaced: 5 },
          IT: { placed: 120, shortlisted: 25, notPlaced: 5 },
          ECE: { placed: 130, shortlisted: 25, notPlaced: 5 },
          EEE: { placed: 110, shortlisted: 20, notPlaced: 10 },
        };
  
        window.analyticsChart = new Chart(ctx, {
          type: type,
          data: {
            labels: ['Placed', 'Shortlisted', 'Not Placed'],
            datasets: [{
              label: `Placement Stats - ${branch}`,
              data: [chartData[branch].placed, chartData[branch].shortlisted, chartData[branch].notPlaced],
              backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: type === 'bar' ? { y: { beginAtZero: true } } : {},
            plugins: {
              legend: { labels: { color: body.classList.contains('dark') ? '#f3f4f6' : '#1e3a8a' } },
              title: { display: true, text: 'Placement Statistics', color: body.classList.contains('dark') ? '#f3f4f6' : '#1e3a8a' },
            },
          },
        });
      }
  
      function renderTrendChart() {
        const ctx = document.getElementById('trendChart')?.getContext('2d');
        if (!ctx) {
          console.error('Trend chart canvas not found');
          return;
        }
  
        if (window.trendChart) window.trendChart.destroy();
  
        const pastData = {
          2022: { CSE: 130, IT: 110, ECE: 120, EEE: 100 },
          2023: { CSE: 140, IT: 115, ECE: 125, EEE: 105 },
          2024: { CSE: 145, IT: 120, ECE: 130, EEE: 110 },
        };
  
        window.trendChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2022', '2023', '2024'],
            datasets: [
              { label: 'CSE', data: [pastData[2022].CSE, pastData[2023].CSE, pastData[2024].CSE], borderColor: '#36A2EB', fill: false },
              { label: 'IT', data: [pastData[2022].IT, pastData[2023].IT, pastData[2024].IT], borderColor: '#FF6384', fill: false },
              { label: 'ECE', data: [pastData[2022].ECE, pastData[2023].ECE, pastData[2024].ECE], borderColor: '#FFCE56', fill: false },
              { label: 'EEE', data: [pastData[2022].EEE, pastData[2023].EEE, pastData[2024].EEE], borderColor: '#4BC0C0', fill: false },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: {
              legend: { labels: { color: body.classList.contains('dark') ? '#f3f4f6' : '#1e3a8a' } },
              title: { display: true, text: 'Placement Trends', color: body.classList.contains('dark') ? '#f3f4f6' : '#1e3a8a' },
            },
          },
        });
      }
  
      renderAnalyticsChart(branchSelect.value, chartTypeSelect.value);
      renderTrendChart();
  
      branchSelect.addEventListener('change', () => {
        renderAnalyticsChart(branchSelect.value, chartTypeSelect.value);
      });
  
      chartTypeSelect.addEventListener('change', () => {
        renderAnalyticsChart(branchSelect.value, chartTypeSelect.value);
      });
    }
  });
  
  // Fetch Dashboard Data
  async function fetchDashboardData(branch) {
    try {
      const response = await fetch(`http://localhost:5000/api/dashboard/${branch}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      const fallbackStats = {
        ALL: { students: 630, placed: 505, averageLpa: 6.8, highestLpa: 44, totalUsers: 5, successRate: 80.2 },
        CSE: { students: 180, placed: 145, averageLpa: 8.0, highestLpa: 44, totalUsers: 5, successRate: 80.6 },
        IT: { students: 150, placed: 120, averageLpa: 7.2, highestLpa: 30, totalUsers: 5, successRate: 80.0 },
        ECE: { students: 160, placed: 130, averageLpa: 7.0, highestLpa: 32, totalUsers: 5, successRate: 81.3 },
        EEE: { students: 140, placed: 110, averageLpa: 6.5, highestLpa: 28, totalUsers: 5, successRate: 78.6 },
      };
      return fallbackStats[branch] || fallbackStats['ALL'];
    }
  }
  
  // Dashboard Functions
  async function updateDashboard() {
    const branchSelector = document.getElementById('branchSelector');
    if (!branchSelector) return;
    const branch = branchSelector.value;
  
    const stats = await fetchDashboardData(branch);
    const counters = document.querySelectorAll('.counter');
  
    if (counters.length >= 4) {
      counters[0].setAttribute('data-target', stats.students);
      counters[1].setAttribute('data-target', stats.placed);
      counters[2].setAttribute('data-target', stats.averageLpa);
      counters[3].setAttribute('data-target', stats.highestLpa);
      document.getElementById('totalUsers').textContent = stats.totalUsers;
      document.getElementById('successRate').textContent = `${stats.successRate}%`;
    }
    runCounters();
  }
  
  function updateFacultyDashboard() {
    fetchDashboardData('ALL').then(stats => {
      const counters = document.querySelectorAll('.counter');
      if (counters.length >= 2) {
        counters[0].setAttribute('data-target', stats.students);
        counters[1].setAttribute('data-target', Math.floor(stats.students * 0.2));
        runCounters();
      }
    }).catch(err => console.error('Faculty dashboard error:', err));
  }
  
  async function updateAdminDashboard() {
    const branchSelector = document.getElementById('branchSelector');
    if (!branchSelector) return;
    const branch = branchSelector.value;
  
    const stats = await fetchDashboardData(branch);
    const counters = document.querySelectorAll('.counter');
  
    if (counters.length >= 3) {
      counters[0].setAttribute('data-target', stats.students * 0.3);
      counters[1].setAttribute('data-target', Math.floor(stats.placed * 0.2));
      counters[2].setAttribute('data-target', stats.placed);
      runCounters();
    }
  }
  
  function runCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const current = +counter.innerText.replace(/[^0-9.]/g, '');
        const increment = Math.ceil(target / 100);
        if (current < target) {
          counter.innerText = `${current + increment}`;
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target;
        }
      };
      counter.innerText = '0';
      updateCount();
    });
  }