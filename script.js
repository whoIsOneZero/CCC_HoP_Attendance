const form = document.getElementById("attendanceForm");
const messageBox = document.getElementById("message");

// Replace with your own Apps Script Web App URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyjEf09bnAaZ46rlgKxrfRfKz_hqt5EZ0lEBByXfQGzG4S9p2MV08C7wsOb_cdzujlb/exec";

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    id: document.getElementById("id").value,
    type: document.getElementById("type").value,
    notes: document.getElementById("notes").value,
  };

  try {
    const response = await fetch(SCRIPT_URL, {
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
  }

  messageBox.style.display = "block";
});
