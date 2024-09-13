import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsGauge from "highcharts/modules/solid-gauge";
import HighchartsMore from "highcharts/highcharts-more";
import "./../styles/MonitorStyles.css";

HighchartsMore(Highcharts);
HighchartsGauge(Highcharts);

const Monitor = () => {
  const [humArr, setHumArr] = useState([22, 56]);
  const [tempArr, setTempArr] = useState([10, 23]);
  const [upArr, setUpArr] = useState([]);
  const [moistureData, setMoistureData] = useState([56]);
  const [acidityData, setAcidityData] = useState([56]);

  // Options for Highcharts
  const temperatureHumidityOptions = {
    title: { text: "Temperature and Humidity" },
    yAxis: { title: { text: "Value" } },
    xAxis: { categories: upArr },
    series: [
      { name: "Humidity", data: humArr, color: "#1111FF" },
      { name: "Temperature", data: tempArr, color: "#FF1111" },
    ],
  };

  const moistureOptions = {
    chart: { type: "gauge" },
    title: { text: "Soil Moisture" },
    pane: {
      startAngle: -150,
      size: "80%",
      endAngle: 150,
      background: {
        backgroundColor: "transparent",
        borderWidth: 0,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 0,
      tickColor: "#ffffff",
      tickLength: 40,
      tickPixelInterval: 60,
      tickWidth: 2,
      lineWidth: 0,
      title: {
        text: "%",
      },
      labels: {
        distance: 15,
      },
      plotBands: [
        {
          from: 0,
          to: 36,
          color: "#FF1111",
          innerRadius: "87%",
          borderRadius: "50%",
        },
        {
          from: 35,
          to: 51,
          color: "#FFEE11",
          innerRadius: "87%",
          zIndex: 1,
        },
        {
          from: 50,
          to: 80,
          color: "#11FF11",
          innerRadius: "87%",
          zIndex: 1,
        },
        {
          from: 79,
          to: 100,
          color: "#FF1111",
          innerRadius: "87%",
          borderRadius: "50%",
        },
      ],
    },
    series: [
      {
        name: "Moisture",
        data: moistureData,
        dataLabels: {
          borderWidth: 1,
          style: {
            fontSize: "1em",
          },
        },
        tooltip: {
          valueSuffix: " %",
        },
      },
    ],
  };

  const acidityOptions = {
    chart: { type: "gauge" },
    title: { text: "Soil Acidity" },
    pane: {
      startAngle: -150,
      size: "80%",
      endAngle: 150,
      background: {
        backgroundColor: "transparent",
        borderWidth: 0,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: 0,
      tickColor: "#ffffff",
      tickLength: 40,
      tickPixelInterval: 60,
      tickWidth: 2,
      lineWidth: 0,
      title: {
        text: "%",
      },
      labels: {
        distance: 15,
      },
      plotBands: [
        {
          from: 0,
          to: 36,
          color: "#FF1111",
          innerRadius: "87%",
          borderRadius: "50%",
        },
        {
          from: 35,
          to: 51,
          color: "#FFEE11",
          innerRadius: "87%",
          zIndex: 1,
        },
        {
          from: 50,
          to: 80,
          color: "#11FF11",
          innerRadius: "87%",
          zIndex: 1,
        },
        {
          from: 79,
          to: 100,
          color: "#FF1111",
          innerRadius: "87%",
          borderRadius: "50%",
        },
      ],
    },
    series: [
      {
        name: "Soil Acidity",
        data: acidityData,
        dataLabels: {
          borderWidth: 1,
          style: {
            fontSize: "1em",
          },
        },
        tooltip: {
          valueSuffix: " %",
        },
      },
    ],
  };

  // Fetch data and update charts
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get("https://yourapi.com/data"); // Replace with actual URL
        const { humidity, temperature, timestamps } = response.data;

        setHumArr((prev) => [...prev, Number(humidity)]);
        setTempArr((prev) => [...prev, Number(temperature)]);
        setUpArr((prev) => [...prev, Number(timestamps)]);

        // Update chart data
        setMoistureData([Math.random() * 100]); // Replace with real data manipulation logic
        setAcidityData([Math.random() * 100]); // Replace with real data manipulation logic
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 3000); // Polling every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Layout>
      <div className="greenhouse-monitor">
        <div className="panel panel-info">
          <div className="panel-body">
            <HighchartsReact
              highcharts={Highcharts}
              options={temperatureHumidityOptions}
            />
            <div className="gauge-charts">
              <HighchartsReact
                highcharts={Highcharts}
                options={moistureOptions}
              />
              <HighchartsReact
                highcharts={Highcharts}
                options={acidityOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Monitor;
