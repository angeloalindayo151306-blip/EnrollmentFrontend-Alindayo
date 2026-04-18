const BASE_URL = 'https://enrollment-api-l3vx.onrender.com';

// ===============================
// Load Students
// ===============================
async function getStudents() {
  try {
    const response = await fetch(`${BASE_URL}/students`);
    const data = await response.json();

    const list = document.getElementById('studentsList');
    list.innerHTML = '';

    data.forEach((student) => {
      const li = document.createElement('li');
      li.textContent = `${student.name} - Year ${student.yearLevel}`;

      // Create Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.style.marginLeft = '10px';

      deleteBtn.onclick = async () => {
        try {
          await fetch(`${BASE_URL}/students/${student.id}`, {
            method: 'DELETE',
          });
          getStudents(); // Refresh list
        } catch (error) {
          alert('Error deleting student');
          console.error(error);
        }
      };

      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  } catch (error) {
    alert('Error fetching students');
    console.error(error);
  }
}

// ===============================
// Add Student
// ===============================
async function addStudent() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const yearLevel = document.getElementById('yearLevel').value;

  if (!name || !email || !yearLevel) {
    alert('Please fill all fields');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        yearLevel: Number(yearLevel),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert('Student added successfully ✅');

    // Clear inputs
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('yearLevel').value = '';

    getStudents(); // Refresh list
  } catch (error) {
    alert('Error adding student');
    console.error(error);
  }
}

// ===============================
// Auto-load students on page load
// ===============================
window.onload = getStudents;
