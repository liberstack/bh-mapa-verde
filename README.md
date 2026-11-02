# Parques BH

Mapa interativo dos parques públicos de Belo Horizonte. Você clica em um marcador (ou em um item da lista) e vê os detalhes do parque: área, horário, endereço, estrutura disponível e um link de rota no Google Maps.

Feito com JavaScript puro, Leaflet e um arquivo JSON. Sem framework, sem build, sem dependências para instalar.

---

## Como rodar

O projeto carrega o `parks.json` com `fetch`, e o navegador bloqueia isso quando a página é aberta direto do disco (`file://`). Por isso, sirva a pasta com um servidor local.

Com Python:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

Também funciona com a extensão Live Server do VS Code.

---

## Estrutura de pastas

```
parques-bh/
├── index.html
├── README.md
└── src/
    ├── scripts/
    │   ├── config.js
    │   ├── maps.js
    │   └── main.js
    ├── styles/
    │   └── style.css
    └── data/
        └── parks.json
```

### O que cada arquivo faz

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Esqueleto da página: contêiner do mapa, lista, painel de detalhes e barra de filtros. Carrega CSS e scripts. |
| `src/scripts/config.js` | Configuração central: centro e zoom inicial do mapa, URL dos tiles e caminho do `parks.json`. |
| `src/scripts/maps.js` | Tudo que é Leaflet: cria o mapa, desenha os marcadores, destaca o marcador ativo, mostra e esconde marcadores, anima o voo até um parque. |
| `src/scripts/main.js` | Tudo que é interface: relógio, lista de parques, painel de detalhes, filtros e carregamento dos dados. |
| `src/styles/style.css` | Aparência da página. |
| `src/data/parks.json` | Os dados dos parques. |

### Por que separar em `maps.js` e `main.js`?

A ideia é dar uma responsabilidade para cada arquivo:

- `maps.js` não sabe nada sobre lista, filtros ou painel. Só sabe mexer no mapa.
- `main.js` não conhece Leaflet. Quando precisa do mapa, chama as funções do `ParksMap`.

Assim, se um dia você trocar o Leaflet por outra biblioteca, só o `maps.js` muda.

---

## Ordem dos scripts

Os scripts são carregados como arquivos comuns (sem módulos), então a ordem no `index.html` importa. Cada um depende do anterior:

```html
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="src/scripts/config.js"></script>
<script src="src/scripts/maps.js"></script>
<script src="src/scripts/main.js"></script>
```

1. **Leaflet** cria o objeto global `L`.
2. **config.js** cria `PARKS_CONFIG`.
3. **maps.js** usa `L` e `PARKS_CONFIG` para criar `ParksMap`.
4. **main.js** usa `PARKS_CONFIG` e `ParksMap`.

Se inverter essa ordem, o console mostra um erro do tipo `ParksMap is not defined`.

---

## Como os dados fluem

1. `main.js` lê o caminho em `PARKS_CONFIG.data.parks` e busca o `parks.json`.
2. Para cada parque, chama `ParksMap.addMarker(...)` e monta um item na lista.
3. Ao clicar em um marcador ou item, `selectPark` renderiza o painel de detalhes e pede ao `ParksMap` para destacar o marcador e voar até ele.
4. Ao clicar em um filtro, `applyFilter` esconde os parques que não têm aquela característica, tanto da lista quanto do mapa.

---

## Formato do `parks.json`

O arquivo é uma lista de objetos. Cada parque segue este formato:

```json
{
  "name": "Parque Municipal Américo Renné Giannetti",
  "region": "Centro-Sul",
  "lat": -19.9227,
  "lng": -43.9345,
  "area_m2": 182000,
  "hours": "06h às 18h",
  "address": "Av. Afonso Pena, s/n - Centro",
  "features": ["banheiro", "playground", "acessibilidade"],
  "note": "Texto curto com uma curiosidade ou observação."
}
```

Os valores acima são só um exemplo do formato.

### Características aceitas em `features`

`banheiro`, `estacionamento`, `trilha`, `playground`, `quadra`, `biblioteca`, `ciclovia`, `acessibilidade`, `mirante`.

Uma característica nova funciona sem mudar o código, mas aparece com o nome cru. Para ter um rótulo bonito, adicione-a em `FEATURE_LABELS`, no `main.js`.

---

## Como adicionar um parque

1. Abra `src/data/parks.json`.
2. Copie um objeto existente e cole ao final da lista.
3. Ajuste os campos (latitude e longitude podem ser copiadas do Google Maps ou do OpenStreetMap).
4. Salve e recarregue a página.

Não é preciso mexer em nenhum arquivo JavaScript.

---

## Como mudar o mapa

Tudo fica no `src/scripts/config.js`:

- `initialCenter` e `initialZoom`: onde o mapa começa.
- `minZoom` e `maxZoom`: limites de zoom.
- `tileUrl`: de onde vêm as imagens do mapa.

---

## Problemas comuns

**A lista fica vazia e aparece "[erro]".**
O `parks.json` não foi encontrado ou a página foi aberta via `file://`. Confira o caminho em `config.js` (`src/data/parks.json`) e use um servidor local.

**`ParksMap is not defined` ou `PARKS_CONFIG is not defined`.**
A ordem dos scripts no `index.html` está errada. Veja a seção "Ordem dos scripts".

**O mapa aparece cinza ou sem tamanho.**
O elemento `#map` precisa ter altura definida no CSS.

---

## Tecnologias

- HTML, CSS e JavaScript puros
- [Leaflet](https://leafletjs.com/) para o mapa
- [OpenStreetMap](https://www.openstreetmap.org/copyright) para os tiles

Mapa &copy; colaboradores do OpenStreetMap.