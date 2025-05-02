document.addEventListener('DOMContentLoaded', () => {
    console.log('students.js loaded');
    loadStudents();

    const studentForm = document.getElementById('studentForm');
    const studentFormData = document.getElementById('studentFormData');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const cancelStudentBtn = document.getElementById('cancelStudentBtn');

    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            console.log('Add Student button clicked');
            studentForm.style.display = 'block';
            studentFormData.reset();
            document.getElementById('saveStudentBtn').textContent = 'Add Student';
            editingStudentId = null;
        });
    }

    if (cancelStudentBtn) {
        cancelStudentBtn.addEventListener('click', () => {
            console.log('Cancel button clicked');
            studentForm.style.display = 'none';
            studentFormData.reset();
            editingStudentId = null;
        });
    }

    if (studentFormData) {
        studentFormData.addEventListener('submit', async (e) => {
            e.preventDefault();
            const student = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim() || null,
                phone_number: document.getElementById('phone_number').value.trim() || null,
                department: document.getElementById('department').value,
                graduation_year: document.getElementById('graduation_year').value || null,
                skills: document.getElementById('skills').value.trim() || null,
                branch: document.getElementById('branch').value.trim() || null
            };
            console.log('Submitting student:', student);

            const method = editingStudentId ? 'PUT' : 'POST';
            const url = editingStudentId ? `http://localhost:5000/api/students/${editingStudentId}` : 'http://localhost:5000/api/students';

            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(student)
                });
                console.log('API Response Status:', response.status);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || 'Failed to save student');
                }
                await loadStudents();
                studentForm.style.display = 'none';
                studentFormData.reset();
                alert(`Student ${editingStudentId ? 'updated' : 'added'} successfully!`);
            } catch (error) {
                console.error('Error saving student:', error);
                alert(`Failed to save student: ${error.message}`);
            }
        });
    }
});

let editingStudentId = null;

async function fetchStudents() {
    console.log('Fetching students from API');
    try {
        const response = await fetch('http://localhost:5000/api/students');
        console.log('Fetch Students Response Status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        console.log('Fetched students:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

async function loadStudents() {
    const students = await fetchStudents();
    console.log('Students to render:', students);
    const tbody = document.querySelector('#studentTable tbody');
    if (!tbody) {
        console.error('Table body not found');
        return;
    }
    tbody.innerHTML = '';
    students.forEach(student => {
        console.log('Rendering student:', student);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.student_id}</td>
            <td>${student.name}</td>
            <td>${student.email || 'N/A'}</td>
            <td>${student.department}</td>
            <td>${student.graduation_year || 'N/A'}</td>
            <td>${student.skills || 'N/A'}</td>
            <td>${student.branch || 'N/A'}</td>
            <td>
                <button class="edit" onclick="editStudent(${student.student_id})">Edit</button>
                <button class="delete" onclick="deleteStudent(${student.student_id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function editStudent(id) {
    console.log('Editing student ID:', id);
    const students = await fetchStudents();
    const student = students.find(s => s.student_id === id);
    if (!student) {
        console.error('Student not found:', id);
        return;
    }
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email || '';
    document.getElementById('phone_number').value = student.phone_number || '';
    document.getElementById('department').value = student.department;
    document.getElementById('graduation_year').value = student.graduation_year || '';
    document.getElementById('skills').value = student.skills || '';
    document.getElementById('branch').value = student.branch || '';
    document.getElementById('studentForm').style.display = 'block';
    document.getElementById('saveStudentBtn').textContent = 'Update Student';
    editingStudentId = id;
}

async function deleteStudent(id) {
    console.log('Deleting student ID:', id);
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' });
            console.log('Delete Student Response Status:', response.status);
            if (!response.ok) throw new Error('Failed to delete student');
            await loadStudents();
            alert('Student deleted successfully!');
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student. Please try again.');
        }
    }
}

function filterStudents() {
    console.log('Filtering students');
    const term = document.getElementById('searchStudents').value.toLowerCase();
    const rows = document.querySelectorAll('#studentTable tbody tr');
    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        row.style.display = name.includes(term) || email.includes(term) ? '' : 'none';
    });
}