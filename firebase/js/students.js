import { db } from "./firebase-config.js";
import {
  collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("tableContainer");
const toast = document.getElementById("toast");

function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function updateStats(students) {
  document.getElementById("totalCount").textContent = students.length;
  if (students.length === 0) {
    document.getElementById("avgMarks").textContent = "—";
    document.getElementById("topMarks").textContent = "—";
    return;
  }
  const marks = students.map(s => s.marks);
  document.getElementById("avgMarks").textContent =
    Math.round(marks.reduce((a, b) => a + b, 0) / marks.length);
  document.getElementById("topMarks").textContent = Math.max(...marks);
}

function renderTable(students) {
  updateStats(students);

  if (students.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">📭</div>
        <p>No students registered yet. <a href="index.html">Register one now</a>.</p>
      </div>`;
    return;
  }

  const rows = students.map(s => `
    <tr data-id="${s.id}">
      <td class="cell-regId">${s.regId}</td>
      <td class="cell-name">${s.name}</td>
      <td class="cell-branch">${s.branch}</td>
      <td class="cell-marks">${s.marks}</td>
      <td class="actions">
        <button class="btn btn-edit" onclick="editRow('${s.id}')">Edit</button>
        <button class="btn btn-delete" onclick="deleteStudent('${s.id}', '${s.name}')">Delete</button>
      </td>
    </tr>`).join("");

  container.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Reg. ID</th><th>Name</th><th>Branch</th><th>Marks</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// Real-time listener
const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
onSnapshot(q, snap => {
  const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderTable(students);
}, err => {
  console.error(err);
  container.innerHTML = `<p style="color:red;padding:1rem;">Failed to load data.</p>`;
});

// ── Edit inline ──
window.editRow = function(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const cells = {
    regId:  row.querySelector(".cell-regId"),
    name:   row.querySelector(".cell-name"),
    branch: row.querySelector(".cell-branch"),
    marks:  row.querySelector(".cell-marks"),
  };

  const original = { regId: cells.regId.textContent, name: cells.name.textContent,
                      branch: cells.branch.textContent, marks: cells.marks.textContent };

  cells.regId.innerHTML  = `<input class="edit-input" value="${original.regId}" />`;
  cells.name.innerHTML   = `<input class="edit-input" value="${original.name}" />`;
  cells.marks.innerHTML  = `<input class="edit-input" type="number" value="${original.marks}" min="0" max="500" />`;

  const branchOptions = ["Computer Science","Electronics & Communication",
    "Mechanical Engineering","Civil Engineering",
    "Information Technology","Electrical Engineering"];
  cells.branch.innerHTML = `<select class="edit-input">
    ${branchOptions.map(b => `<option ${b === original.branch ? "selected" : ""}>${b}</option>`).join("")}
  </select>`;

  const actionsCell = row.querySelector(".actions");
  actionsCell.innerHTML = `
    <button class="btn btn-save" onclick="saveRow('${id}')">Save</button>
    <button class="btn btn-cancel" onclick="cancelEdit('${id}')">Cancel</button>`;
};

window.saveRow = async function(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const regId  = row.querySelector(".cell-regId input").value.trim();
  const name   = row.querySelector(".cell-name input").value.trim();
  const branch = row.querySelector(".cell-branch select").value;
  const marks  = Number(row.querySelector(".cell-marks input").value);

  if (!regId || !name || !branch || isNaN(marks)) {
    showToast("All fields are required.", "error"); return;
  }

  try {
    await updateDoc(doc(db, "students", id), { regId, name, branch, marks });
    showToast("Student updated successfully! ✓");
  } catch (err) {
    console.error(err);
    showToast("Update failed.", "error");
  }
};

window.cancelEdit = function() {
  // onSnapshot will re-render the table automatically
};

// ── Delete ──
window.deleteStudent = async function(id, name) {
  if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return;
  try {
    await deleteDoc(doc(db, "students", id));
    showToast(`"${name}" deleted.`);
  } catch (err) {
    console.error(err);
    showToast("Delete failed.", "error");
  }
};