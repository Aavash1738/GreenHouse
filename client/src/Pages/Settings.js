import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/SettingsStyles.css";
import { useMqttClient } from "./mqttclient";
import thresholds from "../Data/threshold.json";
import TogglePanel from "../components/Toggle";

const Settings = () => {
  const topic = "ESP32_FINAL/sub";
  const { connectionStatus, connect, publish } = useMqttClient(topic);
  console.log(connectionStatus);

  useEffect(() => {
    connect();

    return () => {};
  }, []);
  let threshold =
    JSON.parse(localStorage.getItem("userThresholds")) || thresholds["default"];
  const [selectedPlant, setSelectedPlant] = useState("");
  const { user } = useSelector((state) => state.user);

  const [userParam, setUserParam] = useState(threshold);

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
      const savedThresholds = JSON.parse(
        localStorage.getItem("userThresholds")
      );
      const defaultThreshold = thresholds[user.plant] || thresholds["default"];
      setUserParam(savedThresholds || defaultThreshold);
    }
  }, [user?.plant]);

  const handleSelectionChange = (e) => {
    const newPlant = e.target.value;
    setSelectedPlant(newPlant);

    const newParams = thresholds[newPlant];
    if (newParams) {
      setUserParam(newParams);
      localStorage.setItem("userThresholds", JSON.stringify(newParams));
    }
  };

  const handleSaveChanges = () => {
    updateUserModel(selectedPlant);
    const payload = JSON.stringify(userParam);
    console.log("Publishing payload:", payload); // Debugging
    publish(payload);
    window.location.reload();
  };

  const purePublish = (value) => {
    publish(JSON.stringify(value));
    console.log("Child published");
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
            value={userParam.minTemp}
            min="0"
            max="100"
            title="Enter minimum temperature value"
            placeholder="Minimum temperature"
            onChange={(e) => handleInputChange("minTemp", e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            name="maxTemp"
            value={userParam.maxTemp}
            title="Enter maximum temperature value"
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
            value={userParam.minHumid}
            title="Enter minimum humidity value"
            min="0"
            max="100"
            placeholder="Minimum humidity"
            onChange={(e) => handleInputChange("minHumid", e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            name="maxHumid"
            value={userParam.maxHumid}
            min="0"
            max="100"
            title="Enter maximum humidity value"
            placeholder="Maximum humidity"
            onChange={(e) => handleInputChange("maxHumid", e.target.value)}
          />
        </div>

        <div className="individual">
          <h4>Soil Moisture</h4>
          <input
            type="number"
            name="minMoist"
            value={userParam.minMoist}
            title="Enter minimum moisture value"
            min="0"
            max="100"
            placeholder="Minimum moisture"
            onChange={(e) => handleInputChange("minMoist", e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            name="maxMoist"
            value={userParam.maxMoist}
            min="0"
            max="100"
            title="Enter maximum moisture value"
            placeholder="Maximum moisture"
            onChange={(e) => handleInputChange("maxMoist", e.target.value)}
          />
        </div>

        <input type="submit" value="Publish Values" className="paramSubmit" />
      </form>
      <TogglePanel publish={purePublish} />
    </Layout>
  );
};

export default Settings;
