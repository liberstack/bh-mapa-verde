// maps.js — mapa Leaflet e marcadores do Parques BH
const ParksMap = (function () {
  "use strict";

  const cfg = PARKS_CONFIG;

  const markersByIdx = {};
  let activeMarker = null;

  // ---------- Map ----------
  const map = L.map("map", { zoomControl: true }).setView(
    cfg.map.initialCenter,
    cfg.map.initialZoom,
  );

  L.tileLayer(cfg.map.tileUrl, {
    minZoom: cfg.map.minZoom,
    maxZoom: cfg.map.maxZoom,
    attribution: cfg.map.tileAttribution,
  }).addTo(map);

  // ---------- Marker ----------
  function parkIcon(active) {
    return L.divIcon({
      className: "",
      html: `<svg class="park-marker${active ? " is-active" : ""}" width="22" height="22" viewBox="0 0 24 24">
               <path d="M12 2 C7 2 4 6 4 10 C4 15 12 22 12 22 C12 22 20 15 20 10 C20 6 17 2 12 2 Z" fill="currentColor" stroke="#0f1a0d" stroke-width="1"/>
               <circle cx="12" cy="10" r="3" fill="#0f1a0d"/>
             </svg>`,
      iconSize: [22, 22],
      iconAnchor: [11, 20],
    });
  }

  function addMarker(park, onClick) {
    const marker = L.marker([park.lat, park.lng], { icon: parkIcon(false) })
      .addTo(map)
      .on("click", onClick);
    markersByIdx[park.idx] = marker;
    return marker;
  }

  function setActive(idx) {
    if (activeMarker) activeMarker.setIcon(parkIcon(false));
    const marker = markersByIdx[idx];
    if (marker) {
      marker.setIcon(parkIcon(true));
      activeMarker = marker;
    }
  }

  function setVisible(idx, visible) {
    const marker = markersByIdx[idx];
    if (!marker) return;
    if (visible) {
      if (!map.hasLayer(marker)) marker.addTo(map);
    } else if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  }

  function flyTo(park, zoom = 15) {
    map.flyTo([park.lat, park.lng], zoom, { duration: 0.8 });
  }

  return { map, addMarker, setActive, setVisible, flyTo };
})();
