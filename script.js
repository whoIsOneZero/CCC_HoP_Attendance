const form = document.getElementById("attendanceForm");
const messageBox = document.getElementById("message");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Mock "submission success"
  const success = Math.random() > 0.2; // 80% chance success

  if (success) {
    messageBox.textContent = "✅ Attendance submitted successfully!";
    messageBox.className = "message success";
  } else {
    messageBox.textContent = "❌ Failed to submit attendance. Try again.";
    messageBox.className = "message error";
  }

  messageBox.style.display = "block";
  form.reset();
});
