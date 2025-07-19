import { useState } from 'react';
import './App.css';
import DarkVeil from './DarkVeil'; // Optional background component

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) throw new Error('City not found');

      const data = await response.json();
      setWeatherData(data);
      setError(null);
      setSubmitted(true);

      const { lon, lat } = data.coord;
      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const airData = await airRes.json();
      setAirQuality(airData.list[0]);
    } catch (err) {
      setWeatherData(null);
      setAirQuality(null);
      setError(err.message);
      setSubmitted(false);
    }
  };

  const getAQIDescription = (aqi) => {
    switch (aqi) {
      case 1: return 'Good';
      case 2: return 'Fair';
      case 3: return 'Moderate';
      case 4: return 'Poor';
      case 5: return 'Very Poor';
      default: return 'Unknown';
    }
  };

  return (
    <div className="MainWrapper">
      <DarkVeil />

      <div className="App">
        <h1>🌦️Weather</h1>

        {!submitted && (
          <>
            <input
              className="city-input"
              type="text"
              placeholder="Enter city (e.g. Kochi)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button className="btn" onClick={fetchWeather}>
              <span className="btn-text-one">Hover me</span>
              <span className="btn-text-two">Get Weather</span>
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}

        {submitted && weatherData && (
          <div className="ResultCard">
            <h2>{weatherData.name}</h2>
            <p>🌡️ Temperature: {weatherData.main.temp}°C</p>
            <p>🌤️ Condition: {weatherData.weather[0].description}</p>
            <p>💨 Wind Speed: {weatherData.wind.speed} m/s</p>

            {airQuality && (
              <>
                <h3 style={{ marginTop: '20px' }}>🧪 Air Quality Index</h3>
                <div className={`aq-box level-${airQuality.main.aqi}`}>
                  <p>
                    🌫️ AQI: {airQuality.main.aqi} – {getAQIDescription(airQuality.main.aqi)}
                  </p>
                </div>
                <div className="aq-details">
                  <p>🧪 CO: {airQuality.components.co} μg/m³</p>
                  <p>🧪 NO₂: {airQuality.components.no2} μg/m³</p>
                  <p>🧪 PM2.5: {airQuality.components.pm2_5} μg/m³</p>
                  <p>🧪 PM10: {airQuality.components.pm10} μg/m³</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
