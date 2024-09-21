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
    </Layout>
  );
};

export default Settings;
