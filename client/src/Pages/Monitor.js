import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsGauge from "highcharts/modules/solid-gauge";
import HighchartsMore from "highcharts/highcharts-more";
import "./../styles/MonitorStyles.css";
import { useSelector } from "react-redux";
import DataTable from "../components/Table";
import _ from "lodash";

const main_color = "#6bbf59";
const back_color = "#ffddff";
const main_green = "#11FF11";
const main_yellow = "#FFEE11";
const main_red = "#FF1111";
const main_blue = "#1111FF";

HighchartsMore(Highcharts);
HighchartsGauge(Highcharts);

const Monitor = () => {
  const { user } = useSelector((state) => state.user);
  const [tableData, setTableData] = useState(
    JSON.parse(localStorage.getItem("tableData")) || []
  );
  const [humArr, setHumArr] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [timeArr, setTimeArr] = useState([]);
  const [moistArr, setMoistArr] = useState([]);
  const [acidityArr, setAcidityArr] = useState([]);
  const [lightArr, setLightArr] = useState([]);
  const [actuator, setActuator] = useState({
    heater: true,
    water: true,
    fan: true,
    vents: true,
    lights: true,
  });

  const temperatureHumidityOptions = {
    chart: {
      backgroundColor: back_color,
      borderRadius: 10,
      spacing: 20,
    },
    title: { text: "Temperature and Humidity" },
    yAxis: {
      max: 100,
      min: 0,
      gridLineColor: "rgba(25, 127, 7, 0.2)",
      gridLineWidth: 0.8,
      gridLineDashStyle: "Dash",
      tickInterval: 20,
      title: { text: "Value" },
      plotBands: [
        {
          from: 60,
          to: 75,
          color: "rgba(126, 126, 255, 0.3)", // Semi-transparent blue
        },
        {
          from: 21, // Start of the colored section
          to: 13, // End of the colored section
          color: "rgba(255, 126, 126, 0.3)", // Semi-transparent green
        },
        ,
      ],
    },
    xAxis: { categories: timeArr },
    series: [
      { name: "Humidity", data: humArr, color: main_blue },
      { name: "Temperature", data: tempArr, color: main_red },
    ],
  };

  const moistureOptions = {
    chart: {
      type: "gauge",
      backgroundColor: back_color,
      borderRadius: 10,
      spacing: 20,
    },
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
      tickColor: back_color,
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
        data: [moistArr[moistArr.length - 1]], // Use the most recent value
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
    chart: {
      type: "gauge",
      backgroundColor: back_color,
      borderRadius: 10,
      spacing: 20,
    },
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
      tickColor: back_color,
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
        data: [acidityArr[0]],
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
    const keys = Object.keys(actuator);
    keys.forEach((value) => {
      let ele = document.getElementsByClassName(value)[0];
      if (actuator[value]) {
        ele.classList.add(`act-${value}`);
      } else {
        ele.classList.remove(`act-${value}`);
      }
    });
  }, [actuator]); // Runs whenever actuator.heater changes

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://sbucket1738.s3.amazonaws.com/${user?.name}/data`
        );
        console.log(response);

        let { humidity, temperature, moisture, light, timestamps } =
          response.data;

        setHumArr((prevData) => [...prevData, Number(humidity)].slice(-8));
        setTempArr((prevData) => [...prevData, Number(temperature)].slice(-8));
        setMoistArr((prevData) => [...prevData, Number(moisture)].slice(-8));
        setLightArr((prevData) => [...prevData, Number(light)].slice(-8));
        setAcidityArr((prevData) =>
          [Math.ceil(Math.random() * (60 - 40)), ...prevData].slice(-8)
        );

        // Assuming response.data contains properties for actuator states
        // const { humidity, temperature, acidity, moisture, light, heater, water, fan, vents, lights } =
        //   response.data;
        // setActuator((prevState) => ({
        //   ...prevState,
        //   heater: heater,
        //   water: water,
        //   fan: fan,
        //   vents: vents,
        //   lights: lights,
        // }));
        const date = new Date(timestamps);
        const setup =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        setTimeArr((prev) => [...prev, String(setup)]);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 5000); // Polling every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const validateArray = (arr) =>
      arr.filter((val) => !isNaN(val) && val !== null && val !== undefined);

    const validTempArr = validateArray(tempArr);
    const validHumArr = validateArray(humArr);
    const validMoistArr = validateArray(moistArr);
    const validAcidityArr = validateArray(acidityArr);

    const tempData = [
      _.mean(validTempArr) || 0,
      _.max(validTempArr) || 0,
      _.min(validTempArr) || 0,
    ];
    const humData = [
      _.mean(validHumArr) || 0,
      _.max(validHumArr) || 0,
      _.min(validHumArr) || 0,
    ];
    const moistData = [
      _.mean(validMoistArr) || 0,
      _.max(validMoistArr) || 0,
      _.min(validMoistArr) || 0,
    ];
    const acidityData = [
      _.mean(validAcidityArr) || 0,
      _.max(validAcidityArr) || 0,
      _.min(validAcidityArr) || 0,
    ];

    const updatedTableData = [
      {
        Parameter: "Temperature",
        Average: tempData[0].toFixed(2),
        Maximum: tempData[1].toFixed(2),
        Minimum: tempData[2].toFixed(2),
      },
      {
        Parameter: "Humidity",
        Average: humData[0].toFixed(2),
        Maximum: humData[1].toFixed(2),
        Minimum: humData[2].toFixed(2),
      },
      {
        Parameter: "Moisture",
        Average: moistData[0].toFixed(2),
        Maximum: moistData[1].toFixed(2),
        Minimum: moistData[2].toFixed(2),
      },
      {
        Parameter: "Acidity",
        Average: acidityData[0].toFixed(2),
        Maximum: acidityData[1].toFixed(2),
        Minimum: acidityData[2].toFixed(2),
      },
    ];

    setTableData(updatedTableData);
    localStorage.setItem("tableData", JSON.stringify(updatedTableData));
  }, [tempArr, humArr, moistArr, acidityArr]);

  return (
    <Layout>
      <div className="greenhouse-monitor">
        <div className="actuator-panel">
          <i className="fa-solid fa-fire heater pin"></i>
          <i className="fa-solid fa-droplet water pin"></i>
          <i className="fa-solid fa-fan fan pin"></i>
          <i className="fa-solid fa-wind vents pin"></i>
          <i className="fa-regular fa-lightbulb lights pin"></i>
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
        <div className="stats">
          {tableData.length > 0 && <DataTable data={tableData} />}
        </div>
      </div>
    </Layout>
  );
};

export default Monitor;
