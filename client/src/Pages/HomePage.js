import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { useSelector } from "react-redux";
import AWS from "aws-sdk";
import { message } from "antd";

const HomePage = () => {
  // Define state for temperature, humidity, and timestamps
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [moisture, setMoisture] = useState(null);
  const [light, setLight] = useState(null);
  const [timestamps, setTimestamps] = useState(null);
  const [time, setTime] = useState(null);

  const [actuator, setActuator] = useState({
    heater: false,
    water: false,
    fan: false,
    vents: false,
    lights: false,
  });

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
    AWS.config.update({
      region: process.env.REACT_APP_AWS_REGION,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    const getWeather = async () => {
      try {
        const params = {
          TableName: "Individual_tests",
          Key: {
            //DeviceID: "Latest",
            Username: user?.name,
          },
        };

        const response = await dynamoDB.get(params).promise();
        console.log(response);

        let {
          humidity,
          temperature,
          moisture,
          light,
          timestamps,
          heater_state,
          fan_state,
          light_state,
          water_state,
        } = response.Item.Data;
        const date = new Date(timestamps);
        const setup =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        setTime(setup);

        setTemperature(temperature);
        setHumidity(humidity);
        setMoisture(moisture);
        setLight(light);
        setTimestamps(timestamps);
        setActuator({
          heater: heater_state === 1,
          fan: fan_state === 1,
          lights: light_state === 1,
          water: water_state === 1 || false,
          vents: false,
        });
      } catch (error) {
        message.error({
          content:
            "The user doesn't have a registerd setup, please contact admin.",
          duration: 5, // in seconds
        });
        console.log(error);
      }
    };

    getUserData();
    if (user?.name) {
      getWeather();
      const interval = setInterval(getWeather, 10000); //Polling duration

      return () => clearInterval(interval);
    }
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
          <p>{actuator.water ? "Active" : "Inactive"}</p>
        </div>
        <div className="card">
          <i className="fas fa-lightbulb"></i>
          <h3>Lights</h3>
          <p>{actuator.lights ? "On" : "Off"}</p>
        </div>
        <div className="card">
          <i className="fas fa-fire-alt"></i>
          <h3>Heater</h3>
          <p>{actuator.heater ? "On" : "Off"}</p>
        </div>
        <div className="card">
          <i className="fas fa-wind"></i>
          <h3>Fan</h3>
          <p>{actuator.fan ? "On" : "Off"}</p>
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
