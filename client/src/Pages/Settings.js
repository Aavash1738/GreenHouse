import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/SettingsStyles.css";
import { useMqttClient } from "./mqttclient";
import thresholds from "../Data/threshold.json";

const Settings = () => {
  const topic = "ESP32_FINAL/sub";
  const { connectionStatus, connect, publish } = useMqttClient(topic);
  console.log(connectionStatus);

  useEffect(() => {
    connect();

    return () => {};
  }, []);
  let threshold = localStorage.getItem("userThresholds") || thresholds;

  const [selectedPlant, setSelectedPlant] = useState("");
  const { user } = useSelector((state) => state.user);

  const [userParam, setUserParam] = useState({
    minTemp: threshold.minTemp,
    maxTemp: threshold.maxTemp,
    minHumid: threshold.minHumid,
    maxHumid: threshold.maxHumid,
    minMoist: threshold.minMoist,
    maxMoist: threshold.maxMoist,
  });

  const handleInputChange = (name, value) => {
    const newValue =
      isNaN(value) || value === "" ? threshold[name] : parseInt(value);

    const newUserParam = {
      ...userParam,
      [name]: newValue,
    };

    setUserParam(newUserParam);

    // Save the updated thresholds to localStorage
    const payload = JSON.stringify(newUserParam);
    localStorage.setItem("userThresholds", payload);
  };

  useEffect(() => {
    if (user?.plant) {
      setSelectedPlant(user.plant);
    }
  }, [user?.plant]);

  const handleSelectionChange = (e) => {
    setSelectedPlant(e.target.value);
  };

  const handleSaveChanges = () => {
    updateUserModel(selectedPlant);
    window.location.reload();
  };

  const updateUserModel = (newPlant) => {
    axios
      .put("/api/v1/user/updatePlant", { plant: newPlant, userId: user._id })
      .then((response) => console.log("Success:", response.data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Layout>
      <h3>Settings</h3>
      <div className="settings-container">
        <label htmlFor="plant-selection">
          Select a Plant/Vegetable. The controls will adapt for:
        </label>
        <select
          id="plant-selection"
          value={selectedPlant}
          onChange={handleSelectionChange}
        >
          <option value="tomatoes">Tomato</option>
          <option value="lettuce">Lettuce</option>
          <option value="pepper">Pepper</option>
          <option value="cucumber">Cucumber</option>
          <option value="peas">Peas</option>
          <option value="eggplant">Eggplant</option>
          <option value="strawberry">Strawberry</option>
          <option value="saffron">Saffron</option>
          <option value="asparagus">Asparagus</option>
        </select>
        <button className="settings-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>

      <h3 className="separation">Change control parameters</h3>
      <form
        className="user-input"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload

          const payload = JSON.stringify(userParam);
          localStorage.setItem("userThresholds", payload);
          console.log("Publishing payload:", payload); // Debugging
          publish(payload);
        }}
      >
        <div className="individual">
          <h4>Temperature</h4>
          <input
            type="number"
            name="minTemp"
            min="0"
            max="100"
            placeholder="Minimum temperature"
            onChange={(e) => handleInputChange("minTemp", e.target.value)}
          />
          <input
            type="number"
            name="maxTemp"
            min="0"
            max="100"
            placeholder="Maximum temperature"
            onChange={(e) => handleInputChange("maxTemp", e.target.value)}
          />
        </div>

        <div className="individual">
          <h4>Humidity</h4>
          <input
            type="number"
            name="minHumid"
            min="0"
            max="100"
            placeholder="Minimum humidity"
            onChange={(e) => handleInputChange("minHumid", e.target.value)}
          />
          <input
            type="number"
            name="maxHumid"
            min="0"
            max="100"
            placeholder="Maximum humidity"
            onChange={(e) => handleInputChange("maxHumid", e.target.value)}
          />
        </div>

        <div className="individual">
          <h4>Soil Moisture</h4>
          <input
            type="number"
            name="minMoist"
            min="0"
            max="100"
            placeholder="Minimum moisture"
            onChange={(e) => handleInputChange("minMoist", e.target.value)}
          />
          <input
            type="number"
            name="maxMoist"
            min="0"
            max="100"
            placeholder="Maximum moisture"
            onChange={(e) => handleInputChange("maxMoist", e.target.value)}
          />
        </div>

        <input type="submit" value="Publish Values" className="paramSubmit" />
      </form>
    </Layout>
  );
};

export default Settings;
