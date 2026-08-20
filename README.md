# Air-Weather-Dash — Dashboard Météo & Qualité de l'Air

Air-Weather-Dash est une application web moderne et asynchrone permettant de suivre en temps réel la météo et l'indice de qualité de l'air (AQI) pour n'importe quelle ville dans le monde ou en utilisant la géolocalisation.

Démo en ligne : https://paulineonier.github.io/air-weather-dash/

---

## Fonctionnalités

- Recherche mondiale : Géocodage dynamique de n'importe quelle ville ou commune via l'API Open-Meteo.
- Géolocalisation en 1 clic : Détection automatique de votre position via l'API native navigator.geolocation.
- Données Météorologiques : Température, conditions météo (codes WMO), vitesse du vent et taux d'humidité.
- Qualité de l'Air (AQI) : Calcul de l'Indice de Qualité de l'Air européen et mesure des particules fines (PM2.5 et PM10).
- Insight Data Science / Machine Learning : Explication pédagogique sur l'utilisation de ces séries temporelles environnementales pour entraîner des modèles prédictifs (XGBoost, LSTM).

---

## Stack Technique & Architecture

| Composant | Technologie utilisée |
| :--- | :--- |
| Interface Frontend | HTML5, CSS3 (CSS Grid, Flexbox, Dark Theme native) |
| Logique Applicative | JavaScript ES6+ (async/await, Fetch API, DOM Manipulation) |
| APIs Externes | Open-Meteo API (Météo, Géocodage, Air Quality — Sans clé API) |
| Déploiement / CI-CD | GitHub Actions (.github/workflows/deploy.yml) vers GitHub Pages |

---

## Structure du projet

```text
air-weather-dash/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Workflow GitHub Actions pour le déploiement
├── index.html              # Structure HTML du dashboard
├── style.css               # Styles CSS (Design sombre & responsive)
├── main.js                 # Appels API async/await & dynamique JS
└── README.md               # Documentation du projet