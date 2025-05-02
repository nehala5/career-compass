document.addEventListener('DOMContentLoaded', () => {
    console.log('companies.js loaded');
    loadCompanies(); // Re-enabled with updated backend

    const companyForm = document.getElementById('companyForm');
    const companyFormData = document.getElementById('companyFormData');
    const addCompanyBtn = document.getElementById('addCompanyBtn');
    const cancelCompanyBtn = document.getElementById('cancelCompanyBtn');

    if (addCompanyBtn) {
        addCompanyBtn.addEventListener('click', () => {
            console.log('Add Company button clicked');
            companyForm.style.display = 'block';
            companyFormData.reset();
            document.getElementById('saveCompanyBtn').textContent = 'Add Company';
            editingCompanyId = null;
        });
    }

    if (cancelCompanyBtn) {
        cancelCompanyBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            companyForm.style.display = 'none';
            companyFormData.reset();
            editingCompanyId = null;
        });
    }

    if (companyFormData) {
        companyFormData.addEventListener('submit', async (e) => {
            e.preventDefault();
            const company = {
                name: document.getElementById('name').value.trim(),
                industry: document.getElementById('industry').value.trim() || null,
                address: document.getElementById('address').value.trim() || null,
                contact_email: document.getElementById('contact_email').value.trim() || null,
                website: document.getElementById('website').value.trim() || null,
                contact_phone: document.getElementById('contact_phone').value.trim() || null
            };
            console.log('Submitting company:', company);

            const method = editingCompanyId ? 'PUT' : 'POST';
            const url = editingCompanyId ? `http://localhost:5000/api/companies/${editingCompanyId}` : 'http://localhost:5000/api/companies';

            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(company)
                });
                console.log('API Response Status:', response.status);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || 'Failed to save company');
                }
                await loadCompanies();
                companyForm.style.display = 'none';
                companyFormData.reset();
                alert(`Company ${editingCompanyId ? 'updated' : 'added'} successfully!`);
            } catch (error) {
                console.error('Error saving company:', error.message);
                alert(`Failed to save company: ${error.message}`);
            }
        });
    }
});

let editingCompanyId = null;

async function fetchCompanies() {
    console.log('Fetching companies from API');
    try {
        const response = await fetch('http://localhost:5000/api/companies');
        console.log('Fetch Companies Response Status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw new Error(errorData.details || 'Failed to fetch companies');
        }
        const data = await response.json();
        console.log('Fetched companies:', data);
        return data; // Already mapped in backend
    } catch (error) {
        console.error('Fetch error:', error.message);
        return [];
    }
}

async function loadCompanies() {
    const companies = await fetchCompanies();
    console.log('Companies to render:', companies);
    const tbody = document.querySelector('#companyTable tbody');
    if (!tbody) {
        console.error('Table body not found');
        return;
    }
    if (companies.length > 0) {
        tbody.innerHTML = '';
        companies.forEach(company => {
            console.log('Rendering company:', company);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${company.company_id}</td>
                <td>${company.name}</td>
                <td>${company.industry || 'N/A'}</td>
                <td>${company.address || 'N/A'}</td>
                <td>${company.contact_email || 'N/A'}</td>
                <td>${company.website ? '<a href="' + company.website + '" target="_blank">Visit</a>' : 'N/A'}</td>
                <td>${company.contact_phone || 'N/A'}</td>
                <td>
                    <button class="edit" onclick="editCompany(${company.company_id})">Edit</button>
                    <button class="delete" onclick="deleteCompany(${company.company_id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        console.log('No dynamic data; keeping static rows');
    }
}

function editCompany(id) {
    console.log('Editing company ID:', id);
    const row = document.querySelector(`#companyTable tbody tr td:first-child[textContent="${id}"]`)?.parentElement;
    if (!row) {
        console.error('Company row not found:', id);
        return;
    }
    document.getElementById('name').value = row.cells[1].textContent;
    document.getElementById('industry').value = row.cells[2].textContent === 'N/A' ? '' : row.cells[2].textContent;
    document.getElementById('address').value = row.cells[3].textContent === 'N/A' ? '' : row.cells[3].textContent;
    document.getElementById('contact_email').value = row.cells[4].textContent === 'N/A' ? '' : row.cells[4].textContent;
    document.getElementById('website').value = row.cells[5].querySelector('a')?.href || '';
    document.getElementById('contact_phone').value = row.cells[6].textContent === 'N/A' ? '' : row.cells[6].textContent;
    document.getElementById('companyForm').style.display = 'block';
    document.getElementById('saveCompanyBtn').textContent = 'Update Company';
    editingCompanyId = id;
}

async function deleteCompany(id) {
    console.log('Deleting company ID:', id);
    if (confirm('Are you sure you want to delete this company?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/companies/${id}`, { method: 'DELETE' });
            console.log('Delete Company Response Status:', response.status);
            if (!response.ok) throw new Error('Failed to delete company');
            await loadCompanies();
            alert('Company deleted successfully!');
        } catch (error) {
            console.error('Error deleting company:', error.message);
            alert('Failed to delete company: Backend unavailable.');
        }
    }
}

function filterCompanies() {
    console.log('Filtering companies');
    const term = document.getElementById('searchCompanies').value.toLowerCase();
    const rows = document.querySelectorAll('#companyTable tbody tr');
    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const industry = row.cells[2].textContent.toLowerCase();
        row.style.display = name.includes(term) || industry.includes(term) ? '' : 'none';
    });
}