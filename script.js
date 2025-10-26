// script.js — menú / status / gallery (sin timeline)
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- MENU ---------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("hidden");
      menuToggle.setAttribute("aria-expanded", String(!menu.classList.contains("hidden")));
    });

    // Cerrar menú al hacer click en un link
    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", (ev) => {
        const href = a.getAttribute("href");
        if (href && href.startsWith("#")) {
          ev.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: "smooth" });
          menu.classList.add("hidden");
        } else {
          menu.classList.add("hidden");
        }
      });
    });
  }

  /* ---------- STATUS ONLINE / OFFLINE ---------- */
const statusBox = document.getElementById("statusBox");
const statusText = document.getElementById("statusText");

function updateStatus() {
  if (!statusBox || !statusText) return;

  if (navigator.onLine) {
    statusBox.classList.add("online");
    statusBox.classList.remove("offline");
    statusText.textContent = "Online";
  } else {
    statusBox.classList.add("offline");
    statusBox.classList.remove("online");
    statusText.textContent = "Offline";
  }
}

window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
updateStatus();


  /* ---------- FETCH data.json (for gallery) ---------- */
  async function fetchDataJSON() {
    try {
      const res = await fetch("data.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("No se pudo cargar data.json:", err);
      return null;
    }
  }

  /* ---------- RENDER GALLERY if exists ---------- */
  async function renderGalleryIfNeeded() {
    const galleryGrid = document.getElementById("gallery-grid") || document.querySelector(".gallery");
    if (!galleryGrid) return;
    const data = await fetchDataJSON();
    const images = (data && Array.isArray(data.gallery)) ? data.gallery : null;

    if (images && images.length) {
      galleryGrid.innerHTML = "";
      images.forEach(imgData => {
        const img = document.createElement("img");
        img.className = "gallery-img";
        img.src = imgData.src;
        img.alt = imgData.alt || "";
        img.loading = "lazy";
        galleryGrid.appendChild(img);
      });
      setupGalleryModal();
    }
  }

  /* ---------- GALLERY MODAL ---------- */
  function setupGalleryModal() {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close");
    if (!modal || !modalImg) return;

    document.querySelectorAll(".gallery img, .gallery .gallery-img").forEach(img => {
      img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src;
        captionText.innerHTML = img.alt || "";
      });
    });

    if (closeBtn) {
      closeBtn.onclick = () => { modal.style.display = "none"; };
    }

    modal.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  /* ---------- INIT ---------- */
  renderGalleryIfNeeded();
  setupGalleryModal(); // también para imágenes estáticas en HTML
});
/* -------- FRASES RETRO AUTOMÁTICAS -------- */
const retroPhrases = [
  "Explorador de ideas 🚀",
  "Amante de lo simple 🌿",
  "Retro vibes ✨",
  "Buscando el lado creativo 🎨",
  "Coleccionista de momentos 📼"
];

const retroText = document.getElementById("retroText");
let phraseIndex = 0;

function showPhrase() {
  retroText.classList.remove("typing"); // reinicia animación
  void retroText.offsetWidth; // truco para reiniciar CSS animation
  retroText.textContent = retroPhrases[phraseIndex];
  retroText.classList.add("typing");

  phraseIndex = (phraseIndex + 1) % retroPhrases.length; // siguiente
}

// Primera frase
showPhrase();
// Cambiar frase cada 5s
setInterval(showPhrase, 5000);
/* ---------- RENDER GALLERY if gallery container exists ---------- */
async function renderGalleryIfNeeded() {
  const galleryGrid = document.getElementById("gallery-grid") || document.querySelector(".gallery");
  if (!galleryGrid) return;
  try {
    const res = await fetch("data.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const images = (data && Array.isArray(data.gallery)) ? data.gallery : [];

    if (images.length) {
      galleryGrid.innerHTML = "";
      images.forEach(imgData => {
        const img = document.createElement("img");
        img.className = "gallery-img";
        img.src = imgData.src;
        img.alt = imgData.alt || "Foto";
        img.loading = "lazy";
        img.addEventListener("click", () => openModal(img));
        galleryGrid.appendChild(img);
      });
    }
  } catch (err) {
    console.error("No se pudieron cargar las fotos:", err);
  }
}

/* ---------- MODAL ---------- */
function openModal(img) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const caption = document.getElementById("caption");
  modal.style.display = "block";
  modalImg.src = img.src;
  caption.textContent = img.alt;
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  renderGalleryIfNeeded();

  const closeBtn = document.querySelector(".close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  const modal = document.getElementById("modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
});
