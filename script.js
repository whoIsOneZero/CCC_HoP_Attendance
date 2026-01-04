// === DOM Elements ===
const form = document.getElementById("attendanceForm");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const loader = document.getElementById("loader");

// === Google Apps Script Web App URL ===
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxwvTm5Rig-q4ROVJ-1ViisNtKkBibQ3e0XUHbvCo9Tr6PkguVfx8kpX-7eEn-AW8D1Eg/exec";

// === Popup Helpers ===
function showPopup(message, type = "info") {
  popupContent.textContent = message;
  popupContent.className = `popup-content ${type}`;
  popup.style.display = "flex";

  setTimeout(hidePopup, 3000);
}

function hidePopup() {
  popup.style.display = "none";
  popupContent.className = "popup-content";
}

popup.addEventListener("click", (e) => {
  if (e.target === popup) hidePopup();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hidePopup();
});

// === Live Date & Time (Africa/Accra) ===
function updateDateTime() {
  const now = new Date();

  function ordinal(n) {
    if (n > 3 && n < 21) return n + "th";
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
    hour12: false,
    timeZone: "Africa/Accra",
  });

  document.getElementById("date-time").textContent = `${weekday}, ${ordinal(
    day
  )} ${month}, ${year} at ${time}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');

  // Show loader + prevent double submit
  loader.style.display = "flex";
  submitBtn.disabled = true;

  const data = {
    name: document.getElementById("name").value.trim(),
    id: document.getElementById("id").value.trim(),
    residence: document.getElementById("residence").value.trim(),
    membership: document.getElementById("membership").value,
    type: document.getElementById("type").value,
    notes: document.getElementById("notes").value.trim(),
  };

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    form.reset();
    showPopup(
      "✅ Your attendance has been recorded.\nThank you for coming! 🥳",
      "success"
    );
  } catch (error) {
    showPopup("❌ Failed to submit attendance. Please try again.", "error");
  } finally {
    // Always clean up
    loader.style.display = "none";
    submitBtn.disabled = false;
  }
});
