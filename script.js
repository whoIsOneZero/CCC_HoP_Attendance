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
      // 🛑 The critical change is adding 'mode: "no-cors"'
      mode: "no-cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 🛑 Because of 'no-cors' mode, you cannot access the response.
    // The browser treats it as an "opaque" response for security reasons.
    // The lines below will cause an error if you try to run them.
    // const result = await response.json();

    // if (result.result === "success") {
    //   messageBox.textContent = "✅ " + result.message;
    //   messageBox.className = "message success";
    //   form.reset();
    // } else if (result.result === "duplicate") {
    //   messageBox.textContent = "⚠️ " + result.message;
    //   messageBox.className = "message error";
    // } else {
    //   throw new Error("Submission failed");
    // }

    // Instead of parsing the response, you must assume the request succeeded.
    // If you need confirmation, you'll need a different approach (like a proxy).

    messageBox.textContent = "✅ Submission sent.";
    messageBox.className = "message success";
    form.reset();
  } catch (error) {
    messageBox.textContent = "❌ Failed to submit attendance. Try again.";
    messageBox.className = "message error";
  }

  messageBox.style.display = "block";
});
