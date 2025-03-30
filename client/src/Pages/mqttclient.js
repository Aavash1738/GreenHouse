import { useState } from "react";
import { startSession, publishMessage } from "./mqttUtils";

export const useMqttClient = (topic) => {
  const [mqttClient, setMqttClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [messages, setMessages] = useState([]);

  const onConnect = (client) => {
    setConnectionStatus("Connected successfully!");
    client.subscribe(topic);
    setMqttClient(client);
  };

  const onFailure = (err) => {
    console.error("Connection failed:", err);
    setConnectionStatus("Connection failed. Please try again.");
  };

  const onMessageArrived = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { topic: message.destinationName, payload: message.payloadString },
    ]);
  };

  const onConnectionLost = (err) => {
    console.error("Connection lost:", err);
    setConnectionStatus("Connection lost. Please reconnect.");
  };

  const connect = () => {
    startSession({ onConnect, onFailure, onMessageArrived, onConnectionLost });
  };

  const publish = (message) => {
    if (!mqttClient) {
      throw new Error("MQTT Client is not connected.");
    }
    publishMessage(mqttClient, topic, message);
  };

  return { connectionStatus, messages, connect, publish };
};
