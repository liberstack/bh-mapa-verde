// app.js — Parques BH
(function () {
  "use strict";

  const cfg = PARKS_CONFIG;

  let parks = [];
  let activeMarker = null;
  let markersByName = {};
  let activeFilter = null;

  const FEATURE_LABELS = {
    banheiro: "🚻 Banheiro",
    estacionamento: "🅿️ Estacionamento",
    trilha: "🥾 Trilha",
    playground: "🧒 Playground",
    quadra: "🏀 Quadra",
    biblioteca: "📚 Biblioteca",
    "ciclovia próxima": "🚴 Ciclovia próxima",
    acessibilidade: "♿ Acessibilidade"
  };

  // ---------- Clock ----------
  function tickClock() {
    const el = document.getElementById("clock");
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString("pt-BR", { hour12: false });
  }
  tickClock();
  setInterval(tickClock, 1000);

  // ---------- Map ----------
  const map = L.map("map", { zoomControl: true }).setView(
    cfg.map.initialCenter,
    cfg.map.initialZoom
  );

  L.tileLayer(cfg.map.tileUrl, {
    minZoom: cfg.map.minZoom,
    maxZoom: cfg.map.maxZoom,
    attribution: cfg.map.tileAttribution
  }).addTo(map);

  function parkIcon(active) {
    return L.divIcon({
      className: "",
      html: `<svg class="park-marker${active ? " is-active" : ""}" width="22" height="22" viewBox="0 0 24 24">
               <path d="M12 2 C7 2 4 6 4 10 C4 15 12 22 12 22 C12 22 20 15 20 10 C20 6 17 2 12 2 Z" fill="currentColor" stroke="#0f1a0d" stroke-width="1"/>
               <circle cx="12" cy="10" r="3" fill="#0f1a0d"/>
             </svg>`,
      iconSize: [22, 22],
      iconAnchor: [11, 20]
    });
  }

  // ---------- Detail panel ----------
  function renderDetail(park) {
    const el = document.getElementById("detail");
    const chips = park.features
      .map((f) => `<span class="chip">${FEATURE_LABELS[f] || f}</span>`)
      .join("");
    const area = park.area_m2
      ? (park.area_m2 / 10000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " ha"
      : "—";

    el.innerHTML = `
      <h3 class="detail__name">${park.name}</h3>
      <div class="detail__region">${park.region}</div>
      <div class="detail__stats">
        <div><span>ÁREA</span><span>${area}</span></div>
        <div><span>HORÁRIO</span><span>${park.hours}</span></div>
      </div>
      <div class="detail__address mono">${park.address}</div>
      <div class="chips">${chips}</div>
      <p class="detail__note">${park.note}</p>
      <a class="detail__directions" target="_blank" rel="noopener"
         href="https://www.google.com/maps/dir/?api=1&destination=${park.lat},${park.lng}">
        📍 Como chegar
      </a>
    `;
  }

  function selectPark(park, { pan } = { pan: true }) {
    renderDetail(park);

    if (activeMarker) activeMarker.setIcon(parkIcon(false));
    const marker = markersByName[park.name];
    if (marker) {
      marker.setIcon(parkIcon(true));
      activeMarker = marker;
    }

    document.querySelectorAll(".park-list__items li").forEach((li) => {
      li.classList.toggle("is-active", li.dataset.name === park.name);
    });

    if (pan) map.flyTo([park.lat, park.lng], 15, { duration: 0.8 });
  }

  // ---------- Filter ----------
  function applyFilter(feature) {
    activeFilter = activeFilter === feature ? null : feature;

    document.querySelectorAll(".filter-bar button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.feature === activeFilter);
    });

    parks.forEach((park) => {
      const marker = markersByName[park.name];
      const li = document.querySelector(`.park-list__items li[data-name="${park.name}"]`);
      const visible = !activeFilter || park.features.includes(activeFilter);

      if (marker) {
        if (visible) {
          if (!map.hasLayer(marker)) marker.addTo(map);
        } else if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      }
      if (li) li.style.display = visible ? "" : "none";
    });
  }

  function buildFilterBar() {
    const bar = document.getElementById("filterBar");
    const allFeatures = [...new Set(parks.flatMap((p) => p.features))];
    allFeatures.forEach((f) => {
      const btn = document.createElement("button");
      btn.dataset.feature = f;
      btn.textContent = FEATURE_LABELS[f] || f;
      btn.addEventListener("click", () => applyFilter(f));
      bar.appendChild(btn);
    });
  }

  // ---------- Load parks ----------
  async function loadParks() {
    const res = await fetch(cfg.data.parks);
    parks = await res.json();

    document.getElementById("parkCount").textContent = `[${parks.length}]`;

    const list = document.getElementById("parkList");
    parks
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
      .forEach((park) => {
        const marker = L.marker([park.lat, park.lng], { icon: parkIcon(false) })
          .addTo(map)
          .on("click", () => selectPark(park, { pan: false }));
        markersByName[park.name] = marker;

        const li = document.createElement("li");
        li.dataset.name = park.name;
        li.innerHTML = `<span>${park.name}</span><span class="region">${park.region}</span>`;
        li.addEventListener("click", () => selectPark(park));
        list.appendChild(li);
      });

    buildFilterBar();
  }

  loadParks();
})();
