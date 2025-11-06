import React, { useState } from "react";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = "0ce9c1caee6a51e25b10c39766378cfc";

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny size={70} color="#fbc02d" />;
      case "Clouds":
        return <WiCloud size={70} color="#90a4ae" />;
      case "Rain":
        return <WiRain size={70} color="#2196f3" />;
      case "Snow":
        return <WiSnow size={70} color="#81d4fa" />;
      case "Thunderstorm":
        return <WiThunderstorm size={70} color="#ff7043" />;
      case "Mist":
      case "Fog":
      case "Haze":
        return <WiFog size={70} color="#78909c" />;
      default:
        return <WiDaySunny size={70} color="#fbc02d" />;
    }
  };

  // Fetch weather + forecast
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city");
      return;
    }

    try {
      setError("");
      setWeather(null);
      setForecast([]);

      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        setError("City not found");
        return;
      }
      setWeather(data);

      // Forecast (5 days)
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();
      const daily = forecastData.list.filter((_, i) => i % 8 === 0);
      setForecast(daily);
    } catch (err) {
      setError("Failed to fetch weather");
    }
  };

  return (
    <div className="app">
      <button
        className="theme-toggle"
        onClick={() => document.body.classList.toggle("dark")}
      >
        ⚡
      </button>

      <h1 className="title">☁️ WeatherNow</h1>
      <p className="subtitle">
        Get real-time weather updates for any city around the world
      </p>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button onClick={fetchWeather}>🔍</button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Current Weather */}
      {weather && (
        <div className="weather-card">
          <div className="weather-left">
            <h2>{Math.round(weather.main.temp)}°C</h2>
            <p>Feels like {Math.round(weather.main.feels_like)}°C</p>

            {getWeatherIcon(weather.weather[0].main)}
          </div>

          <div className="weather-right">
            <h3>
              {weather.name}, {weather.sys.country}
            </h3>
            <p className="condition">{weather.weather[0].description}</p>
            <p>
              H: {Math.round(weather.main.temp_max)}° | L:{" "}
              {Math.round(weather.main.temp_min)}°
            </p>

            <div className="details-grid">
              <div className="detail-box">
                Pressure 🌡 {weather.main.pressure} hPa
              </div>
              <div className="detail-box">
                Humidity 💧 {weather.main.humidity}%
              </div>
              <div className="detail-box">
                Wind 💨 {weather.wind.speed} m/s {weather.wind.deg}°
              </div>
              <div className="detail-box">
                Visibility 👁 {weather.visibility / 1000} km
              </div>
            </div>

            <div className="sun-times">
              <span>
                Sunrise 🌅{" "}
                {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>
                Sunset 🌇{" "}
                {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Forecast */}
      {forecast.length > 0 && (
        <>
          <h3 className="text-center"> 5 Days Forecasts </h3>
          <div className="forecast-container">
            {forecast.map((day, i) => (
              <div key={i} className="forecast-card">
                <p>
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>

                {getWeatherIcon(day.weather[0].main)}
                <h4>{Math.round(day.main.temp)}°C</h4>
                <p>{day.weather[0].main}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
