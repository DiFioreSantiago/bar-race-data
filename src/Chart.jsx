import React, {useState,useEffect} from "react";
import ReactEcharts from "echarts-for-react";
import dataPaises from "./data.json";
import lifeExpectancy from "./life-expectancy-table.json";

// var chartDom = document.getElementById('main');
// var myChart = echarts.init(chartDom);

//Colores de barra correspondientes para cada pais
const countryColors = {
  Australia: "#00008b",
  Canada: "#f00",
  China: "#ffde00",
  Cuba: "#002a8f",
  Finland: "#003580",
  France: "#ed2939",
  Germany: "#000",
  Iceland: "#003897",
  India: "#f93",
  Japan: "#bc002d",
  "North Korea": "#024fa2",
  "South Korea": "#000",
  "New Zealand": "#00247d",
  Norway: "#ef2b2d",
  Poland: "#dc143c",
  Russia: "#d52b1e",
  Turkey: "#e30a17",
  "United Kingdom": "#00247d",
  "United States": "#b22234",
};

// const ProcessData = () => {
const updateFrequency = 2000;
const dimension = 0;

const Chart = () => {
  const flags = dataPaises;
  const data = lifeExpectancy;
  let startIndex = 10;
  const years = [];
  for (let i = 0; i < data.length; ++i) {
    if (years.length === 0 || years[years.length - 1] !== data[i][4]) {
      years.push(data[i][4]);
    }
  }
  let startYear = years[startIndex];
  const initalOption = {
    grid: {
      top: 10,
      bottom: 30,
      left: 150,
      right: 80,
    },
    xAxis: {
      max: "dataMax",
      axisLabel: {
        formatter: function (n) {
          return Math.round(n) + "";
        },
      },
    },
    dataset: {
      source: data.slice(1).filter(function (d) {
        return d[4] === startYear;
      }),
    },
    yAxis: {
      type: "category",
      inverse: true,
      max: 10,
      axisLabel: {
        show: true,
        fontSize: 14,
        formatter: function (value) {
          return value + "{flag|" + getFlag(value) + "}";
        },
        rich: {
          flag: {
            fontSize: 25,
            padding: 5,
          },
        },
      },
      animationDuration: 300,
      animationDurationUpdate: 300,
    },
    series: [
      {
        realtimeSort: true,
        seriesLayoutBy: "column",
        type: "bar",
        itemStyle: {
          color: function (param) {
            return countryColors[param.value[3]] || "#5470c6";
          },
        },
        encode: {
          x: dimension,
          y: 3,
        },
        label: {
          show: true,
          precision: 1,
          position: "right",
          valueAnimation: true,
          fontFamily: "monospace",
        },
      },
    ],
    // Disable init animation.
    animationDuration: 0,
    animationDurationUpdate: updateFrequency,
    animationEasing: "linear",
    animationEasingUpdate: "linear",
    graphic: {
      elements: [
        {
          type: "text",
          right: 160,
          bottom: 60,
          style: {
            text: startYear,
            font: "bolder 80px monospace",
            fill: "rgba(100, 100, 100, 0.25)",
          },
          z: 100,
        },
      ],
    },
  };
  const [option, setOption] = useState(initalOption);

  const getFlag = (countryname) => {
    if (!countryname) {
      return "";
    }
    return (
      flags.find(function (item) {
        return item.name === countryname;
      }) || {}
    ).emoji;
  };

  // myChart.setOption(option);

  for (let i = startIndex; i < years.length - 1; ++i) {
    (function (i) {
      setTimeout(function () {
        updateYear(years[i + 1]);
      }, (i - startIndex) * updateFrequency);
    })(i);
  }

  const updateYear = (year) => {
    let source = data.slice(1).filter(function (d) {
      return d[4] === year;
    });
    option.series[0].data = source;
    option.graphic.elements[0].style.text = year;
    setOption(option);
  };

  // option && myChart.setOption(option)

  return (
    <div>
      <ReactEcharts option={option} />
    </div>
  );
};

export default Chart;
