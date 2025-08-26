const form = document.getElementById("attendanceForm");
const messageBox = document.getElementById("message");

// Replace with your own Apps Script Web App URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyjEf09bnAaZ46rlgKxrfRfKz_hqt5EZ0lEBByXfQGzG4S9p2MV08C7wsOb_cdzujlb/exec";

// === Live Date & Time for Ghana (Africa/Accra) ===
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Africa/Accra", // Force Ghana timezone
  };
  document.getElementById("date-time").textContent = now.toLocaleString(
    "en-GB",
    options
  );
}

// Update immediately & every second
updateDateTime();
setInterval(updateDateTime, 1000);

// === Attendance Form Submission ===
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    id: document.getElementById("id").value,
    type: document.getElementById("type").value,
    notes: document.getElementById("notes").value,
  };

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    messageBox.textContent = "✅ Submission sent.";
    messageBox.className = "message success";
    form.reset();
    messageBox.style.display = "block";

    // Hide message after 3 seconds
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 3000);
  } catch (error) {
    messageBox.textContent = "❌ Failed to submit attendance. Try again.";
    messageBox.className = "message error";
    messageBox.style.display = "block";
  }
});
