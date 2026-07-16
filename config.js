// config.js — fonte única de configuração do Parques BH
const PARKS_CONFIG = {
  map: {
    initialCenter: [-19.9227, -43.9345], // Centro de BH
    initialZoom: 12,
    minZoom: 11,
    maxZoom: 17,
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  data: {
    parks: "parks.json"
  }
};
