import { useState } from 'react';
import './App.css';
import DarkVeil from './DarkVeil';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    }
  };

  return (
    <div className="MainWrapper">
      <DarkVeil />

      <div className="App">
        <h1>🌦️</h1>

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

        {weatherData && (
          <div className="CardStyle" style={{ marginTop: '20px' }}>
            <h2>{weatherData.name}</h2>
            <p>🌡️ Temperature: {weatherData.main.temp}°C</p>
            <p>🌤️ Condition: {weatherData.weather[0].description}</p>
            <p>💨 Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
