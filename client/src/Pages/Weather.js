// src/components/Weather.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/WeatherStyles.css";
import Layout from "./../components/Layout";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "111c093984ed40d7bf7123909241609 "; // Replace with your WeatherAPI key

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to retrieve location. Please check your settings.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
      );
      setWeatherData(response.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching the weather data", err);
      setError("Error fetching weather data. Please try again later.");
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <Layout>
      <div className="weather-container">
        <h3>Current Weather</h3>
        {weatherData && (
          <div className="weather-info">
            <div className="location">
              <h4>{weatherData.location.name}</h4>
            </div>

            <div className="weather-details">
              <div className="temperature">
                <i className="fa-solid fa-temperature-low icon"></i>
                <h3>Temp</h3>
                <span className="value">{weatherData.current.temp_c} °C</span>
              </div>

              <div className="condition">
                <i className="fa-solid fa-sun icon"></i>
                <h3>Condition</h3>
                <span className="value">
                  {weatherData.current.condition.text}
                </span>
              </div>

              <div className="humidity">
                <i className="fa-solid fa-droplet icon"></i>
                <h3>Humidity</h3>
                <span className="value">{weatherData.current.humidity}%</span>
              </div>

              <div className="wind-speed">
                <i className="fa-solid fa-wind icon"></i>
                <h3>Wind speed</h3>
                <span className="value">
                  {weatherData.current.wind_kph} kph
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Weather;
