// main.js — Parques BH (UI, filtros e carregamento de dados)
(function () {
  "use strict";

  const cfg = PARKS_CONFIG;

  let parks = [];
  let activeFilter = null;

  const FEATURE_LABELS = {
    banheiro: "🚻 Banheiro",
    estacionamento: "🅿️ Estacionamento",
    trilha: "🥾 Trilha",
    playground: "🧒 Playground",
    quadra: "🏀 Quadra",
    biblioteca: "📚 Biblioteca",
    ciclovia: "🚴 Ciclovia próxima",
    acessibilidade: "♿ Acessibilidade",
    mirante: "🔭 Mirante",
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

  // ---------- Detail panel ----------
  function renderDetail(park) {
    const el = document.getElementById("detail");
    const chips = park.features
      .map((f) => `<span class="chip">${FEATURE_LABELS[f] || f}</span>`)
      .join("");
    const area = park.area_m2
      ? (park.area_m2 / 10000).toLocaleString("pt-BR", {
          maximumFractionDigits: 1,
        }) + " ha"
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
    ParksMap.setActive(park.idx);

    document.querySelectorAll(".park-list__items li").forEach((li) => {
      li.classList.toggle("is-active", Number(li.dataset.idx) === park.idx);
    });

    if (pan) ParksMap.flyTo(park);
  }

  // ---------- Filter ----------
  function applyFilter(feature) {
    activeFilter = activeFilter === feature ? null : feature;

    document
      .querySelectorAll(".filter-bar button[data-feature]")
      .forEach((btn) => {
        const isActive = btn.dataset.feature === activeFilter;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

    const clearBtn = document.querySelector(".filter-bar__clear");
    if (clearBtn) clearBtn.hidden = !activeFilter;

    parks.forEach((park) => {
      const li = document.querySelector(
        `.park-list__items li[data-idx="${park.idx}"]`,
      );
      const visible = !activeFilter || park.features.includes(activeFilter);

      ParksMap.setVisible(park.idx, visible);
      if (li) li.style.display = visible ? "" : "none";
    });
  }

  function buildFilterBar() {
    const bar = document.getElementById("filterBar");

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "filter-bar__clear";
    clearBtn.textContent = "✕ Limpar filtro";
    clearBtn.hidden = true;
    clearBtn.addEventListener("click", () => {
      if (activeFilter) applyFilter(activeFilter);
    });
    bar.appendChild(clearBtn);

    const allFeatures = [...new Set(parks.flatMap((p) => p.features))].sort(
      (a, b) =>
        (FEATURE_LABELS[a] || a).localeCompare(FEATURE_LABELS[b] || b, "pt-BR"),
    );
    allFeatures.forEach((f) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.feature = f;
      btn.textContent = FEATURE_LABELS[f] || f;
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", () => applyFilter(f));
      bar.appendChild(btn);
    });
  }

  // ---------- Load parks ----------
  function showLoadError(err) {
    console.error("Falha ao carregar parks.json:", err);
    const detail = document.getElementById("detail");
    if (detail) {
      detail.innerHTML = `
        <p class="detail__placeholder">
          ⚠️ Não foi possível carregar os dados dos parques.<br>
          Verifique se o arquivo <code class="mono">parks.json</code> está acessível
          (se estiver abrindo o <code class="mono">index.html</code> direto do disco,
          sirva os arquivos por um servidor local em vez de abrir via <code class="mono">file://</code>).
        </p>`;
    }
    const countEl = document.getElementById("parkCount");
    if (countEl) countEl.textContent = "[erro]";
  }

  async function loadParks() {
    try {
      const res = await fetch(cfg.data.parks);
      if (!res.ok)
        throw new Error(`HTTP ${res.status} ao buscar ${cfg.data.parks}`);
      parks = await res.json();
    } catch (err) {
      showLoadError(err);
      return;
    }

    parks.forEach((park, i) => {
      park.idx = i;
    });

    document.getElementById("parkCount").textContent = `[${parks.length}]`;

    const list = document.getElementById("parkList");
    parks
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
      .forEach((park) => {
        ParksMap.addMarker(park, () => selectPark(park, { pan: false }));

        const li = document.createElement("li");
        li.dataset.idx = park.idx;
        li.tabIndex = 0;
        li.setAttribute("role", "button");
        li.setAttribute("aria-label", `${park.name}, ${park.region}`);
        li.innerHTML = `<span>${park.name}</span><span class="region">${park.region}</span>`;
        li.addEventListener("click", () => selectPark(park));
        li.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectPark(park);
          }
        });
        list.appendChild(li);
      });

    buildFilterBar();
  }

  loadParks();
})();
