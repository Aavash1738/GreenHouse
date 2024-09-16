import React, { useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { user } = useSelector((state) => state.user);
  //user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api//v1/user/getUserData",
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
    getUserData();
  }, []);

  return (
    <Layout>
      <h3>
        Hello <span id="username">{user?.name}</span>. Welcome to your GreenSync
        console.
      </h3>
      <h6>
        Monitor, control and optimize your greenhouse environment from anywhere.
      </h6>
      <div class="card-container">
        <div class="card">
          <i class="fas fa-thermometer-half"></i>
          <h3>Temperature</h3>
          <p>24°C</p>
        </div>

        <div class="card">
          <i class="fas fa-cloud-showers-heavy"></i>
          <h3>Humidity</h3>
          <p>65%</p>
        </div>

        <div class="card">
          <i class="fas fa-sun"></i>
          <h3>Light Level</h3>
          <p>750 lx</p>
        </div>

        <div class="card">
          <i class="fa-solid fa-droplet"></i>
          <h3>Soil Moisture</h3>
          <p>30%</p>
        </div>

        <div class="card">
          <i class="fa-solid fa-seedling"></i>
          <h3>NPK sensor</h3>
          <p>Closed</p>
        </div>

        <div class="card">
          <i class="fas fa-water"></i>
          <h3>Watering Status</h3>
          <p>Active</p>
        </div>

        <div class="card">
          <i class="fas fa-lightbulb"></i>
          <h3>Light On/Off</h3>
          <p>On</p>
        </div>

        <div class="card">
          <i class="fas fa-fire-alt"></i>
          <h3>Heater</h3>
          <p>Off</p>
        </div>

        <div class="card">
          <i class="fas fa-wind"></i>
          <h3>Fan</h3>
          <p>On</p>
        </div>

        <div class="card">
          <i class="fa-solid fa-spray-can"></i>
          <h3>Humidifier</h3>
          <p>Active</p>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
