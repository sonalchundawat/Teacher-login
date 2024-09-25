// Elements
const loginPage = document.getElementById('login-page');
const dashboard = document.getElementById('attendance-dashboard');
const loginForm = document.getElementById('login-form');
const studentForm = document.getElementById('student-form');
const studentTableBody = document.querySelector('#student-table tbody');
const resetAttendanceButton = document.getElementById('reset-attendance');
const logoutButton = document.getElementById('logout-btn');

// Local Storage Keys
const STUDENTS_KEY = 'students';
const TEACHER_KEY = 'teacher';

// Check if teacher is logged in
function checkLoginStatus() {
  const teacher = JSON.parse(localStorage.getItem(TEACHER_KEY));
  if (teacher) {
    loginPage.style.display = 'none';
    dashboard.style.display = 'block';
    renderTable();
  } else {
    loginPage.style.display = 'block';
    dashboard.style.display = 'none';
  }
}

// Handle Login
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('teacher-name').value;
  const password = document.getElementById('teacher-password').value;

  // Save teacher details to localStorage
  localStorage.setItem(TEACHER_KEY, JSON.stringify({ name, password }));

  checkLoginStatus();
});

// Handle Logout
logoutButton.addEventListener('click', () => {
  localStorage.removeItem(TEACHER_KEY);
  checkLoginStatus();
});

// Load students from localStorage
let students = JSON.parse(localStorage.getItem(STUDENTS_KEY)) || [];

// Add a new student
studentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('student-name').value;
  const id = document.getElementById('student-id').value;
  const studentClass = document.getElementById('student-class').value;

  const newStudent = {
    id,
    name,
    studentClass,
    status: 'Unmarked'
  };

  students.push(newStudent);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));

  renderTable();
  studentForm.reset();
});

// Render the student list in the table
function renderTable(filter = '') {
  studentTableBody.innerHTML = '';

  students
    .filter(student => (filter ? student.status === filter : true))
    .forEach((student, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.studentClass}</td>
        <td class="${student.status === 'Present' ? 'present' : student.status === 'Absent' ? 'absent' : ''}">
          ${student.status}
        </td>
        <td>
          <button onclick="markAttendance(${index}, 'Present')">Present</button>
          <button onclick="markAttendance(${index}, 'Absent')">Absent</button>
          <button onclick="deleteStudent(${index})">Delete</button>
        </td>
      `;
      studentTableBody.appendChild(row);
    });
}

// Mark Attendance
function markAttendance(index, status) {
  students[index].status = status;
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  renderTable();
}

// Delete Student
function deleteStudent(index) {
  students.splice(index, 1); // Remove student from array
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students)); // Update local storage
  renderTable(); // Render the table again
}

// Filter students by attendance status
document.getElementById('filter-all').addEventListener('click', () => {
  renderTable();
});

document.getElementById('filter-present').addEventListener('click', () => {
  renderTable('Present');
});

document.getElementById('filter-absent').addEventListener('click', () => {
  renderTable('Absent');
});

// Reset Attendance
resetAttendanceButton.addEventListener('click', () => {
  students.forEach(student => student.status = 'Unmarked');
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  renderTable();
});

// Initialize
window.onload = checkLoginStatus;
