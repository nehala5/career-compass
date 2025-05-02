document.addEventListener('DOMContentLoaded', () => {
    console.log('placements.js loaded');
    loadPlacements();

    const placementForm = document.getElementById('placementForm');
    const placementFormData = document.getElementById('placementFormData');
    const addPlacementBtn = document.getElementById('addPlacementBtn');
    const cancelPlacementBtn = document.getElementById('cancelPlacementBtn');

    if (addPlacementBtn) {
        addPlacementBtn.addEventListener('click', () => {
            console.log('Add Placement button clicked');
            placementForm.style.display = 'block';
            placementFormData.reset();
            document.getElementById('savePlacementBtn').textContent = 'Add Placement';
            editingPlacementId = null;
        });
    }

    if (cancelPlacementBtn) {
        cancelPlacementBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            placementForm.style.display = 'none';
            placementFormData.reset();
            editingPlacementId = null;
        });
    }

    if (placementFormData) {
        placementFormData.addEventListener('submit', async (e) => {
            e.preventDefault();
            const placement = {
                user_id: document.getElementById('user_id').value,
                company_name: document.getElementById('company_name').value.trim(),
                job_title: document.getElementById('job_title').value.trim(),
                application_date: document.getElementById('application_date').value || null,
                status: document.getElementById('status').value || null,
                package: document.getElementById('package').value || null,
                location: document.getElementById('location').value.trim() || null
            };
            console.log('Submitting placement:', placement);

            const method = editingPlacementId ? 'PUT' : 'POST';
            const url = editingPlacementId ? `http://localhost:5000/api/placements/${editingPlacementId}` : 'http://localhost:5000/api/placements';

            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(placement)
                });
                console.log('API Response Status:', response.status);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || 'Failed to save placement');
                }
                await loadPlacements();
                placementForm.style.display = 'none';
                placementFormData.reset();
                alert(`Placement ${editingPlacementId ? 'updated' : 'added'} successfully!`);
            } catch (error) {
                console.error('Error saving placement:', error);
                alert(`Failed to save placement: ${error.message}`);
            }
        });
    }
});

let editingPlacementId = null;

async function fetchPlacements() {
    console.log('Fetching placements from API');
    try {
        const response = await fetch('http://localhost:5000/api/placements');
        console.log('Fetch Placements Response Status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw new Error('Failed to fetch placements');
        }
        const data = await response.json();
        console.log('Fetched placements:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

async function loadPlacements() {
    const placements = await fetchPlacements();
    console.log('Placements to render:', placements);
    const tbody = document.querySelector('#placementTable tbody');
    if (!tbody) {
        console.error('Table body not found');
        return;
    }
    tbody.innerHTML = '';
    placements.forEach(placement => {
        console.log('Rendering placement:', placement);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${placement.id}</td>
            <td>${placement.user_id}</td>
            <td>${placement.company_name}</td>
            <td>${placement.job_title}</td>
            <td>${placement.application_date ? new Date(placement.application_date).toLocaleDateString() : 'N/A'}</td>
            <td>${placement.status || 'N/A'}</td>
            <td>${placement.package || 'N/A'}</td>
            <td>${placement.location || 'N/A'}</td>
            <td>
                <button class="edit" onclick="editPlacement(${placement.id})">Edit</button>
                <button class="delete" onclick="deletePlacement(${placement.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function editPlacement(id) {
    console.log('Editing placement ID:', id);
    const placements = await fetchPlacements();
    const placement = placements.find(p => p.id === id);
    if (!placement) {
        console.error('Placement not found:', id);
        return;
    }
    document.getElementById('user_id').value = placement.user_id;
    document.getElementById('company_name').value = placement.company_name;
    document.getElementById('job_title').value = placement.job_title;
    document.getElementById('application_date').value = placement.application_date ? placement.application_date.split('T')[0] : '';
    document.getElementById('status').value = placement.status || '';
    document.getElementById('package').value = placement.package || '';
    document.getElementById('location').value = placement.location || '';
    document.getElementById('placementForm').style.display = 'block';
    document.getElementById('savePlacementBtn').textContent = 'Update Placement';
    editingPlacementId = id;
}

async function deletePlacement(id) {
    console.log('Deleting placement ID:', id);
    if (confirm('Are you sure you want to delete this placement?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/placements/${id}`, { method: 'DELETE' });
            console.log('Delete Placement Response Status:', response.status);
            if (!response.ok) throw new Error('Failed to delete placement');
            await loadPlacements();
            alert('Placement deleted successfully!');
        } catch (error) {
            console.error('Error deleting placement:', error);
            alert('Failed to delete placement. Please try again.');
        }
    }
}

function filterPlacements() {
    console.log('Filtering placements');
    const term = document.getElementById('searchPlacements').value.toLowerCase();
    const rows = document.querySelectorAll('#placementTable tbody tr');
    rows.forEach(row => {
        const company = row.cells[2].textContent.toLowerCase();
        const job = row.cells[3].textContent.toLowerCase();
        row.style.display = company.includes(term) || job.includes(term) ? '' : 'none';
    });
}