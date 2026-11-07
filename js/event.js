// Apply saved theme
document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "light");

// Find the event from the URL (event.html?id=1)
const id = Number(new URLSearchParams(location.search).get("id"));
const ev = events.find(e => e.id === id) || events[0];

// Show event details
document.getElementById("eventDetails").innerHTML = `
  <img src="${ev.image}" alt="${ev.name}" style="width:100%;max-height:350px;object-fit:cover;border-radius:12px">
  <h1>${ev.name}</h1>
  <p class="meta">📅 ${new Date(ev.date).toLocaleString()} · 📍 ${ev.venue}</p>
  <div id="countdown"></div>
  <p>${ev.description}</p>`;

// Countdown timer
function updateCountdown() {
  const diff = new Date(ev.date) - new Date();
  const el = document.getElementById("countdown");
  if (diff <= 0) { el.textContent = "Event started!"; return; }
  const d = Math.floor(diff / 864e5),
        h = Math.floor(diff / 36e5) % 24,
        m = Math.floor(diff / 6e4) % 60,
        s = Math.floor(diff / 1e3) % 60;
  el.textContent = `⏳ ${d}d ${h}h ${m}m ${s}s`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Fill the event dropdown
const select = document.getElementById("eventSelect");
select.innerHTML = events.map(e =>
  `<option value="${e.id}" ${e.id === ev.id ? "selected" : ""}>${e.name}</option>`
).join("");

// Form elements (using getElementById avoids clashes with form.name)
const form = document.getElementById("regForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

// Show an error message, return true if there is no error
const setErr = (errId, msg) => {
  document.getElementById(errId).textContent = msg;
  return msg === "";
};

// Validation and saving
form.addEventListener("submit", e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  const ok = [
    setErr("nameErr", /^[A-Za-z ]{3,}$/.test(name) ? "" : "Enter a valid name (min 3 letters)"),
    setErr("emailErr", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter a valid email"),
    setErr("phoneErr", /^[6-9]\d{9}$/.test(phone) ? "" : "Enter a valid 10-digit phone number"),
    setErr("eventErr", select.value ? "" : "Select an event")
  ].every(Boolean);

  if (!ok) return;

  // Save registration in Local Storage
  const regs = JSON.parse(localStorage.getItem("registrations")) || [];
  regs.push({
    name,
    email,
    phone,
    eventId: select.value,
    time: new Date().toISOString()
  });
  localStorage.setItem("registrations", JSON.stringify(regs));

  // Show confirmation
  document.getElementById("confirmation").innerHTML =
    `<div class="success">✅ Thanks ${name}! You're registered for "${select.options[select.selectedIndex].text}".</div>`;

  form.reset();
});
