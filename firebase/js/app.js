import { db } from "./firebase-config.js";
import {
  collection, addDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const submitBtn = document.getElementById("submitBtn");
const toast = document.getElementById("toast");

function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove("show"), 3000);
}

submitBtn.addEventListener("click", async () => {
  const regId  = document.getElementById("regId").value.trim();
  const name   = document.getElementById("name").value.trim();
  const branch = document.getElementById("branch").value;
  const marks  = document.getElementById("marks").value.trim();

  // Validation
  if (!regId || !name || !branch || !marks) {
    showToast("Please fill in all fields.", "error"); return;
  }
  if (isNaN(marks) || +marks < 0 || +marks > 500) {
    showToast("Marks must be between 0 and 500.", "error"); return;
  }

  submitBtn.textContent = "Registering...";
  submitBtn.disabled = true;

  try {
    // Check for duplicate Registration ID
    const q = query(collection(db, "students"), where("regId", "==", regId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      showToast("Registration ID already exists!", "error");
      submitBtn.textContent = "Register Student";
      submitBtn.disabled = false;
      return;
    }

    await addDoc(collection(db, "students"), {
      regId, name, branch,
      marks: Number(marks),
      createdAt: new Date().toISOString()
    });

    showToast("Student registered successfully! ✓");
    // Clear form
    ["regId", "name", "marks"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("branch").value = "";

  } catch (err) {
    console.error(err);
    showToast("Error saving to Firebase.", "error");
  } finally {
    submitBtn.textContent = "Register Student";
    submitBtn.disabled = false;
  }
});