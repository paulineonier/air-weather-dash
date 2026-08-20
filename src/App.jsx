import React, { useState, useEffect } from 'react';
import './style.css';

export default function App() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const getWeatherInfo = (code) => {
    if (code === 0) return 'Soleil radieux';
    if (code <= 3) return 'Ensoleillé & nuageux';
    if (code <= 48) return 'Brouillard';
    if (code <= 67) return 'Pluie';
    if (code <= 77) return 'Neige';
    if (code <= 99) return 'Orage';
    return 'Variable';
  };

  const getAQIInfo = (aqi) => {
    if (aqi <= 20) return { label: 'Excellente', color: '#10b981' };
    if (aqi <= 40) return { label: 'Bonne', color: '#84cc16' };
    if (aqi <= 60) return { label: 'Moyenne', color: '#f59e0b' };
    if (aqi <= 80) return { label: 'Médiocre', color: '#f97316' };
    return { label: 'Mauvaise', color: '#ef4444' };
  };

  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  };

  const fetchMetrics = async (lat, lon, name) => {
    setLoading(true);
    setError('');
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const weather = await weatherRes.json();

      const airRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm10,pm2_5`
      );
      const air = await airRes.json();

      setWeatherData({
        location: name,
        currentTemp: Math.round(weather.current.temperature_2m),
        weatherCode: weather.current.weather_code,
        wind: weather.current.wind_speed_10m,
        humidity: weather.current.relative_humidity_2m,
        aqi: air.current.european_aqi,
        pm25: air.current.pm2_5,
        pm10: air.current.pm10,
        daily: weather.daily
      });
    } catch (err) {
      setError("Impossible de charger les données pour cette localisation.");
    } finally {
      setLoading(false);
    }
  };

  const searchCity = async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError(`Ville "${cityName}" introuvable.`);
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      await fetchMetrics(latitude, longitude, `${name}, ${country}`);
    } catch (err) {
      setError("Erreur lors de la recherche de la ville.");
      setLoading(false);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchMetrics(pos.coords.latitude, pos.coords.longitude, "Ma position"),
        () => setError("Accès à la géolocalisation refusé.")
      );
    } else {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  useEffect(() => {
    searchCity('Paris');
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Air-Weather-Dash</h1>
        <p className="subtitle">Votre météo claire et la qualité de l'air au quotidien</p>
      </header>

      <div className="search-bar">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchCity(city)}
          placeholder="Entrez une ville (ex: Paris, Marseille, Lyon)..."
        />
        <button className="btn-primary" onClick={() => searchCity(city)}>
          Rechercher
        </button>
        <button className="btn-secondary" onClick={handleGeolocation}>
          Ma position
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading && <div className="loading-text">Recherche des prévisions en cours...</div>}

      {!loading && weatherData && (
        <>
          <div className="grid-top">
            <div className="card">
              <div>
                <h2>{weatherData.location}</h2>
                <div className="weather-header">
                  <span className="temp-main">{weatherData.currentTemp}°C</span>
                  <span className="badge-weather">{getWeatherInfo(weatherData.weatherCode)}</span>
                </div>
              </div>
              <div className="details-row">
                <div>Vent : <strong>{weatherData.wind} km/h</strong></div>
                <div>Humidité : <strong>{weatherData.humidity}%</strong></div>
              </div>
            </div>

            <div className="card">
              <div>
                <h2>Qualité de l'Air</h2>
                <div className="aqi-header">
                  <span
                    className="badge-aqi"
                    style={{ backgroundColor: getAQIInfo(weatherData.aqi).color }}
                  >
                    Indice {weatherData.aqi} — {getAQIInfo(weatherData.aqi).label}
                  </span>
                </div>
              </div>
              <div className="details-row">
                <div>Particules PM2.5 : <strong>{weatherData.pm25} µg/m³</strong></div>
                <div>Particules PM10 : <strong>{weatherData.pm10} µg/m³</strong></div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="section-title">Prévisions sur 7 jours</h2>
            <div className="forecast-grid">
              {weatherData.daily.time.map((time, index) => (
                <div key={time} className="forecast-card">
                  <span className="forecast-day">{formatDay(time)}</span>
                  <span className="forecast-cond">{getWeatherInfo(weatherData.daily.weather_code[index])}</span>
                  <span className="forecast-temp">
                    {Math.round(weatherData.daily.temperature_2m_max[index])}° / <span className="temp-min">{Math.round(weatherData.daily.temperature_2m_min[index])}°</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-explanation">
            <h3>Comprendre vos données météo & air en un coup d'œil</h3>
            <div className="explanation-grid">
              <div className="explanation-item">
                <h4>Comment sont calculées les prévisions à 7 jours ?</h4>
                <p>
                  Les superordinateurs analysent des milliards de données (température, pression, vents) à travers le monde pour simuler l'évolution du temps au fil des jours.
                </p>
              </div>
              <div className="explanation-item">
                <h4>Que signifient les particules PM2.5 et PM10 ?</h4>
                <p>
                  Ce sont de très fines poussières en suspension dans l'air (issues du trafic ou du chauffage). Plus le chiffre est bas, plus l'air que vous respirez est pur.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}