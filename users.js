document.addEventListener('DOMContentLoaded', () => {
    console.log('users.js loaded');
    loadUsers();

    const userForm = document.getElementById('userForm');
    const userFormData = document.getElementById('userFormData');
    const addUserBtn = document.getElementById('addUserBtn');
    const cancelUserBtn = document.getElementById('cancelUserBtn');

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            console.log('Add User button clicked');
            userForm.style.display = 'block';
            userFormData.reset();
            document.getElementById('saveUserBtn').textContent = 'Add User';
            editingUserId = null;
        });
    }

    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            userForm.style.display = 'none';
            userFormData.reset();
            editingUserId = null;
        });
    }

    if (userFormData) {
        userFormData.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                password_hash: document.getElementById('password_hash').value.trim(),
                role: document.getElementById('role').value,
                department: document.getElementById('department').value || null,
                phone_number: document.getElementById('phone_number').value.trim() || null,
                graduation_year: document.getElementById('graduation_year').value || null,
                skills: document.getElementById('skills').value.trim() || null
            };
            console.log('Submitting user:', user);

            const method = editingUserId ? 'PUT' : 'POST';
            const url = editingUserId ? `http://localhost:5000/api/users/${editingUserId}` : 'http://localhost:5000/api/users';

            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user)
                });
                console.log('API Response Status:', response.status);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || 'Failed to save user');
                }
                await loadUsers();
                userForm.style.display = 'none';
                userFormData.reset();
                alert(`User ${ LeukocyteId ? 'updated' : 'added'} successfully!`);
            } catch (error) {
                console.error('Error saving user:', error);
                alert(`Failed to save user: ${error.message}`);
            }
        });
    }
});

let editingUserId = null;

async function fetchUsers() {
    console.log('Fetching users from API');
    try {
        const response = await fetch('http://localhost:5000/api/users');
        console.log('Fetch Users Response Status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        console.log('Fetched users:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

async function loadUsers() {
    const users = await fetchUsers();
    console.log('Users to render:', users);
    const tbody = document.querySelector('#userTable tbody');
    if (!tbody) {
        console.error('Table body not found');
        return;
    }
    tbody.innerHTML = '';
    users.forEach(user => {
        console.log('Rendering user:', user);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.user_id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.department || 'N/A'}</td>
            <td>${user.phone_number || 'N/A'}</td>
            <td>${user.graduation_year || 'N/A'}</td>
            <td>${user.skills || 'N/A'}</td>
            <td>
                <button class="edit" onclick="editUser(${user.user_id})">Edit</button>
                <button class="delete" onclick="deleteUser(${user.user_id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function editUser(id) {
    console.log('Editing user ID:', id);
    const users = await fetchUsers();
    const user = users.find(u => u.user_id === id);
    if (!user) {
        console.error('User not found:', id);
        return;
    }
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('password_hash').value = user.password_hash || '';
    document.getElementById('role').value = user.role;
    document.getElementById('department').value = user.department || '';
    document.getElementById('phone_number').value = user.phone_number || '';
    document.getElementById('graduation_year').value = user.graduation_year || '';
    document.getElementById('skills').value = user.skills || '';
    document.getElementById('userForm').style.display = 'block';
    document.getElementById('saveUserBtn').textContent = 'Update User';
    editingUserId = id;
}

async function deleteUser(id) {
    console.log('Deleting user ID:', id);
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
            console.log('Delete User Response Status:', response.status);
            if (!response.ok) throw new Error('Failed to delete user');
            await loadUsers();
            alert('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        }
    }
}

function filterUsers() {
    console.log('Filtering users');
    const term = document.getElementById('searchUsers').value.toLowerCase();
    const rows = document.querySelectorAll('#userTable tbody tr');
    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        row.style.display = name.includes(term) || email.includes(term) ? '' : 'none';
    });
}