const form = document.getElementById("attendanceForm");
// const messageBox = document.getElementById("message");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyjEf09bnAaZ46rlgKxrfRfKz_hqt5EZ0lEBByXfQGzG4S9p2MV08C7wsOb_cdzujlb/exec";

// === Popup helpers ===
function showPopup(message, type = "info") {
  popupContent.textContent = message;
  popupContent.className = `popup-content ${type}`;
  popup.style.display = "flex";

  // Auto-hide after 3 seconds
  setTimeout(hidePopup, 3000);
}

function hidePopup() {
  popup.style.display = "none";
  popupContent.className = "popup-content";
}

// Close on background click or Esc
popup.addEventListener("click", (e) => {
  if (e.target === popup) hidePopup();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hidePopup();
});

// === Live Date & Time for Ghana (Africa/Accra) ===
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

  const formatted = `${weekday}, ${ordinal(day)} ${month}, ${year} at ${time}`;
  document.getElementById("date-time").textContent = formatted;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// === Location Check (Church Premises) ===
const CHURCH_LAT = 6.672607148959226;
const CHURCH_LNG = -1.566895388468553;
const RADIUS_METERS = 100; // allowed radius around church

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// === Attendance Form Submission ===
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // 1. Get user location before allowing attendance
  if (!navigator.geolocation) {
    showPopup(
      "⚠️ Location is required but not supported on this device.",
      "error"
    );
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const distance = getDistanceFromLatLonInM(
        userLat,
        userLng,
        CHURCH_LAT,
        CHURCH_LNG
      );

      if (distance > RADIUS_METERS) {
        showPopup(
          "⚠️ You must be within the church premises to take attendance.",
          "error"
        );
        return;
      }

      // 2. Proceed with attendance submission
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
          headers: { "Content-Type": "application/json" },
        });

        form.reset();
        showPopup(
          "✅ Your attendance has been recorded.\nThank you for coming!🥳",
          "success"
        );
      } catch (error) {
        showPopup("❌ Failed to submit attendance. Try again.", "error");
      }
    },
    () => {
      showPopup(
        "⚠️ Please allow location access to record attendance.",
        "error"
      );
    }
  );
});
