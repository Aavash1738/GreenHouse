import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsGauge from "highcharts/modules/solid-gauge";
import HighchartsMore from "highcharts/highcharts-more";
import "./../styles/MonitorStyles.css";
import { useSelector } from "react-redux";
import DataTable from "../components/Table";
import _ from "lodash";
import AWS from "aws-sdk";
import { message } from "antd";

//const main_color = "#6bbf59";
const back_color = "#ffddff";
const main_green = "#11FF11";
//const main_yellow = "#FFEE11";
const main_red = "#FF1111";
const main_blue = "#1111FF";

HighchartsMore(Highcharts);
HighchartsGauge(Highcharts);

const Monitor = () => {
  const { user } = useSelector((state) => state.user);
  const threshold = JSON.parse(localStorage.getItem("userThresholds"));
  const [tableData, setTableData] = useState([]);

  const [humArr, setHumArr] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  const [timeArr, setTimeArr] = useState([]);
  const [moistArr, setMoistArr] = useState([]);
  const [acidityArr, setAcidityArr] = useState([]);
  const [lightArr, setLightArr] = useState([]);
  const [actuator, setActuator] = useState({
    heater: false,
    water: false,
    fan: false,
    vents: false,
    lights: false,
  });

  const temperatureOptions = {
    chart: {
      backgroundColor: back_color,
      borderRadius: 10,
      spacing: 20,
    },
    title: { text: "Temperature" },
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
          from: threshold?.maxTemp || 25, // Start of the colored section
          to: threshold?.minTemp || 12, // End of the colored section
          // color: "rgba(255, 126, 126, 0.3)", // Semi-transparent green
          color: "rgba(122, 255, 20, 0.5)",
        },
        {
          from: 80,
          to: 100,
          color: "rgba(255, 0, 0, 0.7)",
        },
        ,
      ],
    },
    xAxis: { categories: timeArr },
    series: [{ name: "Temperature", data: tempArr, color: main_red }],
  };

  const humidityOptions = {
    chart: {
      backgroundColor: back_color,
      borderRadius: 10,
      spacing: 20,
    },
    title: { text: "Humidity" },
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
          from: threshold?.minHumid || 55,
          to: threshold?.maxHumid || 75,
          // color: "rgba(126, 126, 255, 0.3)", // Semi-transparent blue
          color: "rgba(122, 255, 20, 0.5)",
        },
        {
          from: 85,
          to: 100,
          color: "rgba(255, 0, 0, 0.7)",
        },
      ],
    },
    xAxis: { categories: timeArr },
    series: [{ name: "Humidity", data: humArr, color: main_blue }],
  };

  const moistureOptions = {
    chart: {
      backgroundColor: back_color,
      borderRadius: 10,
      spacing: 20,
    },
    title: { text: "Moisture" },
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
          from: threshold?.minMoist || 40,
          to: threshold?.maxMoist || 60,
          // color: "rgba(126, 126, 255, 0.3)", // Semi-transparent blue
          color: "rgba(122, 255, 20, 0.5)",
        },
        {
          from: 85,
          to: 100,
          color: "rgba(255, 0, 0, 0.7)",
        },
      ],
    },
    xAxis: { categories: timeArr },
    series: [{ name: "Moisture", data: moistArr, color: main_green }],
  };

  const lightOptions = {
    chart: {
      type: "gauge",
      backgroundColor: back_color,
      borderRadius: 10,
      spacing: 20,
    },
    title: { text: "Brightness" },
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
      tickWidth: 1,
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
          to: 100,
          color: {
            linearGradient: { x1: 0, x2: 1, y1: 1, y2: 0.8 }, // Horizontal gradient
            stops: [
              [0, "#000000"], // Black at 0%
              [0.5, "#FFA500"], // Orange at 50%
              [1, "#EFF500"], // Yellow at 100%
            ],
          },
          innerRadius: "87%",
          borderRadius: "50%",
        },
      ],
    },
    series: [
      {
        name: "Brightness",
        data: [lightArr[lightArr.length - 1]], // Use the most recent value
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
  }, [actuator]);

  useEffect(() => {
    AWS.config.update({
      region: process.env.REACT_APP_AWS_REGION,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    const fetchWeatherData = async () => {
      try {
        const params = {
          TableName: "Individual_tests",
          Key: {
            //DeviceID: "Latest",
            Username: user?.name,
          },
        };
        console.log(params);

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
        } = response.Item.Data ? response.Item.Data : response.Item.payload;

        setHumArr((prevData) => [...prevData, Number(humidity)].slice(-8));
        setTempArr((prevData) => [...prevData, Number(temperature)].slice(-8));
        setMoistArr((prevData) => [...prevData, Number(moisture)].slice(-8));
        setLightArr((prevData) => [...prevData, Number(light) * 100].slice(-8));
        setAcidityArr((prevData) =>
          [Math.ceil(Math.random() * (60 - 40)), ...prevData].slice(-8)
        );

        setActuator({
          heater: heater_state === 1 || false,
          fan: fan_state === 1 || false,
          lights: light_state === 1 || false,
          water: water_state === 1 || false,
          vents: false,
        });

        const date = new Date(timestamps);
        const setup =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        setTimeArr((prev) => [...prev, String(setup)]);
      } catch (error) {
        message.error({
          content:
            "The user doesn't have a registerd setup, please contact admin.",
          duration: 5, // in seconds
        });
        console.error("Error fetching data", error);
      }
    };

    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 10000); // Polling every 10 seconds
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

    localStorage.setItem("tableData", JSON.stringify(updatedTableData));

    setTableData(updatedTableData);
  }, [tempArr, humArr, moistArr, acidityArr]);

  useEffect(() => {
    const storedTableData = localStorage.getItem("tableData");
    if (storedTableData) {
      setTableData(JSON.parse(storedTableData));
    }
  }, []);

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
              options={temperatureOptions}
            />
            <HighchartsReact
              highcharts={Highcharts}
              options={humidityOptions}
            />
            <HighchartsReact
              highcharts={Highcharts}
              options={moistureOptions}
            />
            <div className="gauge-charts">
              <HighchartsReact highcharts={Highcharts} options={lightOptions} />
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
