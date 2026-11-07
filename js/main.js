const grid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");
let activeCategory = "All";

function renderEvents() {
  const q = searchInput.value.toLowerCase();
  const list = events.filter(e =>
    (activeCategory === "All" || e.category === activeCategory) &&
    e.name.toLowerCase().includes(q)
  );
  grid.innerHTML = list.map(e => `
    <article class="card">
      <img src="${e.image}" alt="${e.name}" loading="lazy">
      <div class="card-body">
        <span class="tag">${e.category}</span>
        <h3>${e.name}</h3>
        <p class="meta">📅 ${new Date(e.date).toDateString()} · 📍 ${e.venue}</p>
        <p>${e.description}</p>
        <a class="btn" href="event.html?id=${e.id}">View & Register</a>
      </div>
    </article>`).join("");
  noResults.hidden = list.length > 0;
}

searchInput.addEventListener("input", renderEvents);

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    activeCategory = btn.dataset.cat;
    renderEvents();
  });
});

// Dark mode
const toggle = document.getElementById("themeToggle");
const saved = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", saved);

toggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

renderEvents();
