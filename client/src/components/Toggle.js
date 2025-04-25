import React, { useState, useEffect } from "react";
import "../styles/TogglePanel.css";
import thresholds from "../Data/threshold.json";

const defaultState = {
  pump: false,
  fan: false,
  light: false,
};

const ToggleButton = ({ label, isOn, onToggle }) => {
  return (
    <div className="toggle-container">
      <span className="toggle-label">{label}</span>
      <label className="switch">
        <input type="checkbox" checked={isOn} onChange={onToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

const TogglePanel = ({ publish }) => {
  const [states, setStates] = useState(() => {
    const saved = localStorage.getItem("toggleStates");
    return saved ? JSON.parse(saved) : defaultState;
  });
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    localStorage.setItem("toggleStates", JSON.stringify(states));
  }, [states]);

  const controls = [
    { label: "Water Pump", key: "pump" },
    { label: "Fan", key: "fan" },
    { label: "Light", key: "light" },
  ];

  const handleToggle = (key) => {
    if (isDisabled) return;

    const newState = !states[key];

    setStates((prev) => ({
      ...prev,
      [key]: newState,
    }));

    if (key === "pump" && newState) {
      console.log("Pump has been turned on");

      setIsDisabled(true);

      const userThresholds =
        JSON.parse(localStorage.getItem("userThresholds")) || {};
      const minMoistPrior =
        userThresholds.minMoist ?? thresholds.default.minMoist;

      publish({ minMoist: 100 });
      setTimeout(() => {
        publish({ minMoist: minMoistPrior }); // Reset moisture after 5 seconds
        setStates((prev) => ({
          ...prev,
          pump: false, // Turn off the pump toggle
        }));
        setIsDisabled(false);
        console.log("Pump turned off");
      }, 5000); // Reset delay of 5000ms (5 seconds)
    } else if (key === "fan" && newState) {
      console.log("Fan has been turned on");

      // Immediately toggle fan without delay

      publish({ maxTemp: 1 }); // Fan turns on
      console.log("Fan turned on immediately");
    } else if (key === "fan" && !newState) {
      console.log("Fan has been turned off");

      // Immediately turn off the fan without delay
      // let maxTempPrior = JSON.parse(
      //   localStorage.getItem("userThresholds")
      // ).maxTemp;
      let userThresholds =
        JSON.parse(localStorage.getItem("userThresholds")) || {};
      let maxTempPrior = userThresholds.minMoist ?? thresholds.default.maxTemp;

      publish({ maxTemp: maxTempPrior }); // Reset or adjust temperature settings when fan is off
      console.log("Fan turned off immediately");
    } else {
      console.log(`${key} turned ${!states[key] ? "on" : "off"}`);
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto", padding: "20px" }}>
      {controls.map(({ label, key }) => (
        <ToggleButton
          key={key}
          label={label}
          isOn={states[key]}
          onToggle={() => handleToggle(key)}
        />
      ))}
    </div>
  );
};

export default TogglePanel;
