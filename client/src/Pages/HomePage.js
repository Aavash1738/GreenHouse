import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { useSelector } from "react-redux";

const HomePage = () => {
  // Define state for temperature, humidity, and timestamps
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [moisture, setMoisture] = useState(null);
  const [light, setLight] = useState(null);
  const [timestamps, setTimestamps] = useState(null);
  const [time, setTime] = useState(null);

  const { user } = useSelector((state) => state.user);
  // Fetch user data
  const getUserData = async () => {
    try {
      await axios.post(
        "/api/v1/user/getUserData",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getWeather = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await axios.get(
          `https://sbucket1738.s3.amazonaws.com/${user?.name}/data`
        );
        console.log(response);
        // Set temperature, humidity, and timestamps state based on API response
        const data = response.data;
        const date = new Date(data.timestamps);
        const setup =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        setTime(setup);
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setMoisture(data.moisture);
        setLight(data.light);
        setTimestamps(data.timestamps);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
    if (user?.name) {
      getWeather();
    }

    const timer = setTimeout(() => {}, 5000);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [user?.name]);

  return (
    <Layout>
      <h3>
        Hello <span id="username">{user?.name}</span>. Welcome to your GreenSync
        console.
      </h3>
      <h6>Updated on {time}</h6>
      <h6>
        Monitor, control and optimize your greenhouse environment from anywhere.
      </h6>

      <div className="card-container">
        <div className="card">
          <i className="fas fa-thermometer-half"></i>
          <h3>Temperature</h3>
          <p>{temperature !== null ? `${temperature} °C` : "Loading..."}</p>
        </div>

        <div className="card">
          <i className="fas fa-cloud-showers-heavy"></i>
          <h3>Humidity</h3>
          <p>{humidity !== null ? `${humidity} %` : "Loading..."}</p>
        </div>

        {/* Other cards remain unchanged */}
        <div className="card">
          <i className={`fas ${light === 0 ? "fa-sun" : "fa-moon"}`}></i>
          <h3>Light Level</h3>
          <p>
            {light !== null ? (light === 0 ? "Bright" : "Dark") : "Loading..."}
          </p>
        </div>
        <div className="card">
          <i className="fa-solid fa-droplet"></i>
          <h3>Soil Moisture</h3>
          <p>{moisture !== null ? `${moisture} %` : "Loading..."}</p>
        </div>
        <div className="card invalid">
          <i className="fa-solid fa-seedling"></i>
          <h3>NPK sensor</h3>
          <p>Closed</p>
        </div>
        <div className="card">
          <i className="fas fa-water"></i>
          <h3>Watering Status</h3>
          <p>Active</p>
        </div>
        <div className="card">
          <i className="fas fa-lightbulb"></i>
          <h3>Light On/Off</h3>
          <p>On</p>
        </div>
        <div className="card">
          <i className="fas fa-fire-alt"></i>
          <h3>Heater</h3>
          <p>Off</p>
        </div>
        <div className="card">
          <i className="fas fa-wind"></i>
          <h3>Fan</h3>
          <p>On</p>
        </div>
        <div className="card invalid">
          <i className="fa-solid fa-spray-can"></i>
          <h3>Humidifier</h3>
          <p>Active</p>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
