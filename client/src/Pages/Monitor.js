import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsGauge from "highcharts/modules/solid-gauge";
import HighchartsMore from "highcharts/highcharts-more";
import "./../styles/MonitorStyles.css";
import { useSelector } from "react-redux";

const main_color = "#f0efef";
const back_color = "#228b22";
const main_green = "#11FF11";
const main_yellow = "#FFEE11";
const main_red = "#FF1111";
const main_blue = "#1111FF";

HighchartsMore(Highcharts);
HighchartsGauge(Highcharts);

const Monitor = () => {
  const { user } = useSelector((state) => state.user);
  const [humArr, setHumArr] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [timeArr, setTimeArr] = useState([]);
  const [moistArr, setMoistArr] = useState([]);
  const [acidityArr, setAcidityArr] = useState([]);
  const [lightArr, setLightArr] = useState([]);
  let isHeater, isWater, isFan, isVents, isLights;

  // Options for Highcharts
  const temperatureHumidityOptions = {
    chart: { backgroundColor: main_color },
    title: { text: "Temperature and Humidity" },
    yAxis: { title: { text: "Value" } },
    xAxis: { categories: timeArr },
    series: [
      { name: "Humidity", data: humArr, color: main_blue },
      { name: "Temperature", data: tempArr, color: main_red },
    ],
  };

  const moistureOptions = {
    chart: { type: "gauge", backgroundColor: main_color },
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
      tickColor: main_color,
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
          color: main_red,
          innerRadius: "87%",
          borderRadius: "50%",
        },
        {
          from: 35,
          to: 51,
          color: main_yellow,
          innerRadius: "87%",
          zIndex: 1,
        },
        {
          from: 50,
          to: 80,
          color: main_green,
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
        data: moistArr,
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
    chart: { type: "gauge", backgroundColor: main_color },
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
      tickColor: main_color,
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
        data: acidityArr,
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

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://sbucket1738.s3.amazonaws.com/${user?.name}/data`
        ); // Replace with actual URL
        let { humidity, temperature, timestamps } = response.data;
        /*{ humidity, temperature, acidity, moisture, light, vents, heater, fan, water, lights} = response.data;*/
        setHumArr((prev) => [...prev, Number(humidity)]);
        setTempArr((prev) => [...prev, Number(temperature)]);
        //setMoistArr((prev) => [...prev, Number(moisture)]);
        //setAcidityArr((prev) => [...prev, Number(acidity)]);
        //setLightArr((prev) => [...prev, Number(light)]);

        const date = new Date(timestamps);
        const setup =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log(setup);
        setTimeArr((prev) => [...prev, String(setup)]);
        isHeater = true;
        let ele = document.getElementsByClassName("heater")[0];
        if (isHeater) {
          ele.classList.add("act-heater");
        } else if (!isHeater && ele.classList.contains("act")) {
          ele.classList.remove("act-heater");
        }
        // Update chart data
        setMoistArr([Math.ceil(Math.random() * (60 - 40))]);
        setAcidityArr([Math.ceil(Math.random() * (60 - 40))]);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 10000); // Polling every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Layout>
      <div className="greenhouse-monitor">
        <div className="actuator-panel">
          <i class="fa-solid fa-fire heater pin"></i>
          <i class="fa-solid fa-droplet water pin"></i>
          <i class="fa-solid fa-fan fan pin"></i>
          <i class="fa-solid fa-wind vents pin"></i>
          <i class="fa-regular fa-lightbulb pin"></i>
        </div>
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
