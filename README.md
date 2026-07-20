# bh-mapa-verde 

Mapa interativo dos parques públicos de Belo Horizonte — JS puro, Leaflet e um dataset em JSON. Sem framework, sem build, só fetch e render.

![status](https://img.shields.io/badge/status-em%20desenvolvimento-6fae4a)
![stack](https://img.shields.io/badge/stack-vanilla%20JS-1a2818)

## Sobre

Atlas verde de Belo Horizonte: um mapa navegável com os principais parques da cidade, área, horário de funcionamento, infraestrutura disponível (banheiro, playground, trilha, quadra, etc.) e link direto para rota no Google Maps.

## Stack

- **JavaScript vanilla** (sem framework, sem build step)
- **[Leaflet](https://leafletjs.com/)** para o mapa
- **OpenStreetMap** para os tiles
- Dados servidos como **JSON** estático (`parks.json`)

## Estrutura

```
├── index.html      # markup principal
├── style.css       # tema visual (dark, verde/paper)
├── config.js        # configuração do mapa (centro, zoom, tiles)
├── app.js          # lógica: mapa, marcadores, filtros, painel de detalhes
└── parks.json       # dataset dos parques
```

## Rodando local

Basta servir os arquivos com qualquer servidor estático (ex: extensão Live Server do VSCode) e abrir `index.html`. Não tem dependência de build — os arquivos JS/CSS já estão prontos pra rodar direto no navegador.

## Funcionalidades

- Mapa interativo com marcador por parque
- Lista lateral ordenada alfabeticamente
- Painel de detalhes ao clicar num parque (área, horário, endereço, infraestrutura)
- Filtro por tipo de infraestrutura (banheiro, trilha, playground, etc.)
- Link direto de rota via Google Maps

## Fonte dos dados

Fundação de Parques e Zoobotânica de Belo Horizonte (PBH).

## Licença

MIT