import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/SettingsStyles.css";

const Settings = () => {
  const [selectedPlant, setSelectedPlant] = useState("");
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.plant) {
      setSelectedPlant(user.plant);
    }
  }, [user?.plant]);

  const handleSelectionChange = (e) => {
    const newPlant = e.target.value;
    setSelectedPlant(newPlant);
  };

  const handleSaveChanges = () => {
    updateUserModel(selectedPlant);
    window.location.reload();
  };

  const updateUserModel = (newPlant) => {
    axios
      .put("/api/v1/user/updatePlant", { plant: newPlant, userId: user._id })
      .then((response) => {
        console.log("Success:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
      <form className="user-input">
        <div className="individual">
          <h4>Temperature</h4>
          <input
            type="number"
            id="minTemp"
            name="minTemp"
            min="0"
            max="100"
            placeholder="Minimum temperature"
          />
          <input
            type="number"
            id="maxTemp"
            name="maxTemp"
            min="0"
            max="100"
            placeholder="Maximum temperature"
          />
        </div>

        <div className="individual">
          <h4>Humidity</h4>
          <input
            type="number"
            id="minHumid"
            name="minHumid"
            min="0"
            max="100"
            placeholder="Minimum humidity"
          />
          <input
            type="number"
            id="maxHumid"
            name="maxHumid"
            min="0"
            max="100"
            placeholder="Maximum humidity"
          />
        </div>

        <div className="individual">
          <h4>Soil Moisture</h4>
          <input
            type="number"
            id="minMoist"
            name="minMoist"
            min="0"
            max="100"
            placeholder="Minimum moisture"
          />
          <input
            type="number"
            id="maxMoist"
            name="maxMoist"
            min="0"
            max="100"
            placeholder="Maximum moisture"
          />
        </div>

        <input type="submit" value="Submit Values" className="paramSubmit" />
      </form>
    </Layout>
  );
};

export default Settings;
