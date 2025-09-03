import { useState } from 'react';
import './App.css';
import DarkVeil from './DarkVeil';
import RotatingText from './RotatingText';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

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
    <>
      <div className="MainWrapper">
        <DarkVeil />

        <div className="App" style  = {{ padding: '20px', textAlign: 'center', marginLeft:'50px' }}>
          {/* ✅ RotatingText just above the card */}
          <div className="flex justify-center mt-4 mb-6">
            <RotatingText
              texts={['Weather', 'Air Quality', 'UV Index', 'Forecast']}
              mainClassName="text-2xl sm:text-4xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 rounded-2xl shadow-xl text-center"
              staggerFrom="last"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-1"
              transition={{ type: "tween", duration: 0.6, ease: "easeInOut" }}
              rotationInterval={2000}
            />
          </div>

          <h1 className="text-4xl">🌦️</h1>

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
                    <p> CO: {airQuality.components.co} μg/m³</p><br />
                    <p> NO₂: {airQuality.components.no2} μg/m³</p><br />
                    <p> PM2.5: {airQuality.components.pm2_5} μg/m³</p><br />
                    <p> PM10: {airQuality.components.pm10} μg/m³</p><br />
                  </div>

                  {/* ✅ Rain Prediction */}
                  <div className="text-lg mt-4 p-4 rounded-xl shadow-lg backdrop-blur-md bg-gradient-to-r from-blue-900/40 to-indigo-700/40 border border-blue-200/20 text-white transition-all duration-300">
                    <p>
                      🌧️ <span className="font-semibold">Rain Prediction:</span>{' '}
                      <span className="text-blue-200">
                        {weatherData.rain?.['1h']
                          ? `${weatherData.rain['1h']} mm expected (last 1h)`
                          : weatherData.rain?.['3h']
                          ? `${weatherData.rain['3h']} mm expected (last 3h)`
                          : 'No rain expected'}
                      </span>
                    </p>
                  </div>
                </>
              )}

              <div className="Home">
                <button
                  className="btn"
                  onClick={() => {
                    setSubmitted(false);
                    setWeatherData(null);
                    setAirQuality(null);
                    setError(null);
                    setCity('');
                  }}
                >
                  <span className="btn-text-one">Hover me</span>
                  <span className="btn-text-two">Home</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Show ScrollStack only when not submitted */}
        {!submitted && (
          <ScrollStack style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ScrollStackItem>
              <h2>Clothes</h2>
              <p>clothes for each weather reccommended here</p>
            </ScrollStackItem>
            <ScrollStackItem>
              <h2>Moon</h2>
              <p>Moon shapes fetched here</p>
            </ScrollStackItem>
            <ScrollStackItem>
              <h2>Todays Weather Wisdom</h2>
              <p>Weather related facts fetched here</p>

          
            </ScrollStackItem>
          </ScrollStack>
        )}
      </div>
    </>
  );
}

export default App;
