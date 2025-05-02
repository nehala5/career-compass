async function fetchDashboard(branch) {
    try {
        const response = await fetch(`http://localhost:5000/api/dashboard/${branch}`);
        console.log('Dashboard response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch dashboard');
        const data = await response.json();
        console.log('Dashboard data:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return { students: 0, placed: 0, averageLpa: 0, highestLpa: 0, totalUsers: 0, successRate: 0 };
    }
}

async function loadDashboard() {
    const urlParams = new URLSearchParams(window.location.search);
    const branch = urlParams.get('branch') || 'CSE'; // Default to CSE if no branch
    document.getElementById('branchSelect').value = branch;
    const data = await fetchDashboard(branch);

    document.getElementById('totalStudents')?.textContent = data.students;
    document.getElementById('placedStudents')?.textContent = data.placed;
    document.getElementById('averageLpa')?.textContent = data.averageLpa;
    document.getElementById('highestLpa')?.textContent = data.highestLpa;
    document.getElementById('totalUsers')?.textContent = data.totalUsers;
    document.getElementById('successRate')?.textContent = `${data.successRate}%`;
}

document.getElementById('branchSelect')?.addEventListener('change', () => {
    const branch = document.getElementById('branchSelect').value;
    window.location.href = `dashboard.html?branch=${branch}`;
});

if (window.location.pathname.includes('dashboard.html')) {
    loadDashboard();
}