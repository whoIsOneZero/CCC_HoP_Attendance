const form = document.getElementById("attendanceForm");
const messageBox = document.getElementById("message");

// Replace with your own Apps Script Web App URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyjEf09bnAaZ46rlgKxrfRfKz_hqt5EZ0lEBByXfQGzG4S9p2MV08C7wsOb_cdzujlb/exec";

// === Live Date & Time for Ghana (Africa/Accra) ===
function updateDateTime() {
  const now = new Date();

  // Ordinal suffix for day
  function ordinal(n) {
    if (n > 3 && n < 21) return n + "th"; // catch 11th-19th
    switch (n % 10) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
      default:
        return n + "th";
    }
  }

  // Extract parts using toLocaleString with Ghana timezone
  const weekday = now.toLocaleString("en-GB", {
    weekday: "long",
    timeZone: "Africa/Accra",
  });
  const day = parseInt(
    now.toLocaleString("en-GB", { day: "numeric", timeZone: "Africa/Accra" }),
    10
  );
  const month = now.toLocaleString("en-GB", {
    month: "long",
    timeZone: "Africa/Accra",
  });
  const year = now.toLocaleString("en-GB", {
    year: "numeric",
    timeZone: "Africa/Accra",
  });
  const time = now.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // set to true if you want AM/PM
    timeZone: "Africa/Accra",
  });

  // Build final string with commas
  const formatted = `${weekday}, ${ordinal(day)} ${month}, ${year} at ${time}`;

  document.getElementById("date-time").textContent = formatted;
}

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

    messageBox.textContent =
      "Your attendance has been recorded.\nThank you for coming!🥳";
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
