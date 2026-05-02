const BASE_URL = "https://enrollment-api-l3vx.onrender.com";

let editingStudentId = null;
let editingCourseId = null;
let editingEnrollmentId = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

/* =========================
   STUDENTS
========================= */

async function getStudents() {
  const res = await fetch(`${BASE_URL}/students`);
  const students = await res.json();
  const table = document.getElementById("studentsTable");
  table.innerHTML = "";

  students.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.yearLevel}</td>
      <td>
        <button onclick="startEditStudent('${student.id}', '${student.name}', '${student.email}', ${student.yearLevel})">Edit</button>
        <button onclick="deleteStudent('${student.id}')">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });

  updateEnrollmentDropdowns();
}

function startEditStudent(id, name, email, yearLevel) {
  editingStudentId = id;
  document.getElementById("studentName").value = name;
  document.getElementById("studentEmail").value = email;
  document.getElementById("yearLevel").value = yearLevel;
  document.getElementById("studentSubmitBtn").textContent = "Update";
}

async function addStudent() {
  if (editingStudentId) {
    await updateStudent();
    return;
  }

  const name = document.getElementById("studentName").value;
  const email = document.getElementById("studentEmail").value;
  const yearLevel = document.getElementById("yearLevel").value;

  if (!name || !email || !yearLevel) return;

  await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      yearLevel: Number(yearLevel)
    })
  });

  showToast("Student added ✅");
  clearStudentForm();
  getStudents();
}

async function updateStudent() {
  const name = document.getElementById("studentName").value;
  const email = document.getElementById("studentEmail").value;
  const yearLevel = document.getElementById("yearLevel").value;

  await fetch(`${BASE_URL}/students/${editingStudentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      yearLevel: Number(yearLevel)
    })
  });

  showToast("Student updated ✅");

  editingStudentId = null;
  document.getElementById("studentSubmitBtn").textContent = "Add";
  clearStudentForm();
  getStudents();
}

async function deleteStudent(id) {
  await fetch(`${BASE_URL}/students/${id}`, { method: "DELETE" });
  getStudents();
  showToast("Student deleted ✅");
}

function clearStudentForm() {
  document.getElementById("studentName").value = "";
  document.getElementById("studentEmail").value = "";
  document.getElementById("yearLevel").value = "";
}

/* =========================
   COURSES
========================= */

async function getCourses() {
  const res = await fetch(`${BASE_URL}/courses`);
  const courses = await res.json();
  const table = document.getElementById("coursesTable");
  table.innerHTML = "";

  courses.forEach(course => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${course.id}</td>
      <td>${course.title}</td>
      <td>${course.description}</td>
      <td>
        <button onclick="startEditCourse('${course.id}', '${course.title}', '${course.description}')">Edit</button>
        <button onclick="deleteCourse('${course.id}')">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });

  updateEnrollmentDropdowns();
}

function startEditCourse(id, title, description) {
  editingCourseId = id;
  document.getElementById("courseTitle").value = title;
  document.getElementById("courseDescription").value = description;
  document.getElementById("courseSubmitBtn").textContent = "Update";
}

async function addCourse() {
  if (editingCourseId) {
    await updateCourse();
    return;
  }

  const title = document.getElementById("courseTitle").value;
  const description = document.getElementById("courseDescription").value;

  if (!title || !description) return;

  await fetch(`${BASE_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  });

  showToast("Course added ✅");
  clearCourseForm();
  getCourses();
}

async function updateCourse() {
  const title = document.getElementById("courseTitle").value;
  const description = document.getElementById("courseDescription").value;

  await fetch(`${BASE_URL}/courses/${editingCourseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  });

  showToast("Course updated ✅");

  editingCourseId = null;
  document.getElementById("courseSubmitBtn").textContent = "Add";
  clearCourseForm();
  getCourses();
}

async function deleteCourse(id) {
  await fetch(`${BASE_URL}/courses/${id}`, { method: "DELETE" });
  getCourses();
  showToast("Course deleted ✅");
}

function clearCourseForm() {
  document.getElementById("courseTitle").value = "";
  document.getElementById("courseDescription").value = "";
}

/* =========================
   ENROLLMENTS
========================= */

async function getEnrollments() {
  const res = await fetch(`${BASE_URL}/enrollments`);
  const enrollments = await res.json();

  const students = await (await fetch(`${BASE_URL}/students`)).json();
  const courses = await (await fetch(`${BASE_URL}/courses`)).json();

  const table = document.getElementById("enrollmentsTable");
  table.innerHTML = "";

  enrollments.forEach(enroll => {
    const student = students.find(s => s.id === enroll.studentId);
    const course = courses.find(c => c.id === enroll.courseId);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${enroll.id}</td>
      <td>${student ? student.name : ""}</td>
      <td>${course ? course.title : ""}</td>
      <td>
        <button onclick="startEditEnrollment('${enroll.id}', '${enroll.studentId}', '${enroll.courseId}')">Edit</button>
        <button onclick="deleteEnrollment('${enroll.id}')">Remove</button>
      </td>
    `;
    table.appendChild(row);
  });
}

async function createEnrollment() {
  const studentId = document.getElementById("enrollStudentId").value;
  const courseId = document.getElementById("enrollCourseId").value;

  if (!studentId || !courseId) return;

  // ✅ UPDATE MODE
  if (editingEnrollmentId) {
    await fetch(`${BASE_URL}/enrollments/${editingEnrollmentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, courseId })
    });

    showToast("Enrollment updated ✅");
    editingEnrollmentId = null;

    document.querySelector("#enrollmentsSection button").textContent = "Enroll";
    getEnrollments();
    return;
  }

  // ✅ CREATE MODE
  await fetch(`${BASE_URL}/enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, courseId })
  });

  getEnrollments();
  showToast("Enrollment created ✅");
}

async function deleteEnrollment(id) {
  await fetch(`${BASE_URL}/enrollments/${id}`, { method: "DELETE" });
  getEnrollments();
  showToast("Enrollment removed ✅");
}

function startEditEnrollment(id, studentId, courseId) {
  editingEnrollmentId = id;

  document.getElementById("enrollStudentId").value = studentId;
  document.getElementById("enrollCourseId").value = courseId;

  document.querySelector("#enrollmentsSection button").textContent = "Update";
}

/* =========================
   DROPDOWNS
========================= */

function updateEnrollmentDropdowns() {
  Promise.all([
    fetch(`${BASE_URL}/students`).then(res => res.json()),
    fetch(`${BASE_URL}/courses`).then(res => res.json())
  ]).then(([students, courses]) => {

    const studentSelect = document.getElementById("enrollStudentId");
    const courseSelect = document.getElementById("enrollCourseId");

    studentSelect.innerHTML = "";
    courseSelect.innerHTML = "";

    students.forEach(student => {
      const option = document.createElement("option");
      option.value = student.id;
      option.textContent = student.name;
      studentSelect.appendChild(option);
    });

    courses.forEach(course => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.title;
      courseSelect.appendChild(option);
    });
  });
}

/* =========================
   FOCUS MODE
========================= */

function focusSection(id) {
  const section = document.getElementById(id);
  const overlay = document.getElementById("focusOverlay");

  if (!section || !overlay) return;

  document.querySelectorAll(".panel")
    .forEach(panel => panel.classList.remove("focused"));

  section.classList.add("focused");
  overlay.classList.add("active");
}

document.addEventListener("click", function (e) {
  if (e.target.id === "focusOverlay") {
    document.getElementById("focusOverlay").classList.remove("active");
    document.querySelectorAll(".panel")
      .forEach(panel => panel.classList.remove("focused"));
  }
});

/* =========================
   INITIAL LOAD
========================= */

window.onload = () => {
  getStudents();
  getCourses();
  getEnrollments();
};
