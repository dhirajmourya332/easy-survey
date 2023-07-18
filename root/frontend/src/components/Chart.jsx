import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import DonughnutChart from "./DonutChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
// import { Pie } from "react-chartjs-2";

// export let data = {
//   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//   datasets: [
//     {
//       label: "# of Votes",
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.2)",
//         "rgba(54, 162, 235, 0.2)",
//         "rgba(255, 206, 86, 0.2)",
//         "rgba(75, 192, 192, 0.2)",
//         "rgba(153, 102, 255, 0.2)",
//         "rgba(255, 159, 64, 0.2)",
//       ],
//       borderColor: [
//         "rgba(255, 99, 132, 1)",
//         "rgba(54, 162, 235, 1)",
//         "rgba(255, 206, 86, 1)",
//         "rgba(75, 192, 192, 1)",
//         "rgba(153, 102, 255, 1)",
//         "rgba(255, 159, 64, 1)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

export default function Chart(props) {
  const [chartType, setChartType] = useState("pie");
  const title = props["chartData"]["title"];
  const options = props["chartData"]["options"];

  // const { chartType, options, data } = { ...props["chartData"] };
  // const [chart, setChart] = useState(null);

  // useEffect(() => {
  //   switch (chartType) {
  //     case "pie":
  //       setChart(<PieChart options={options} data={data} />);
  //       break;
  //     case "doughnut":
  //       setChart(<DonughnutChart options={options} data={data} />);
  //       break;
  //     case "bar":
  //       setChart(<BarChart options={options} data={data} />);
  //       break;

  //     case "line":
  //       setChart(<LineChart options={options} data={data} />);
  //       break;

  //     default:
  //       break;
  //   }
  // }, [chartType, data]);
  // const bb = {
  //   chartData: {
  //     options: [
  //       { option: "adsf", value: 1 },
  //       { option: "fd", value: 0 },
  //       { option: "drg", value: 1 },
  //       { option: "we", value: 1 },
  //     ],
  //     title: "asfasf",
  //   },
  // };
  // const aa = {
  //   id: "aiuejiawerjfarf",
  //   chartType: "line",
  //   options: {
  //     responsive: true,
  //     plugins: {
  //       legend: {
  //         position: "bottom",
  //       },
  //       title: {
  //         display: true,
  //         text: "Your fav season",
  //       },
  //     },
  //   },

  //   data: {
  //     labels: ["Winter", "Summer", "Rainy", "Spring"],
  //     datasets: [
  //       {
  //         data: [12, 23, 34, 45],
  //       },
  //     ],
  //   },
  // };
  function renderChart() {
    const chart_options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: title,
        },
      },
    };
    const data = {
      labels: options.map((option) => {
        return option["option"];
      }),
      datasets: [
        {
          data: options.map((option) => {
            return option["value"];
          }),
        },
      ],
    };
    switch (chartType) {
      case "pie":
        return <PieChart options={chart_options} data={data} />;

      case "doughnut":
        return <DonughnutChart options={chart_options} data={data} />;

      case "bar":
        return <BarChart options={chart_options} data={data} />;

      case "line":
        return <LineChart options={chart_options} data={data} />;

      default:
        break;
    }
  }
  return (
    <div className="flex-flex-col gap-5 w-full p-3 bg-white rounded-lg">
      <div className="flex w-full justify-center font-bold text-lg p-2 rounded-md bg-slate-50">
        {title}
      </div>
      <div className="flex items-center justify-center max-h-screen">
        {renderChart()}
      </div>
      <div className="flex flex-col gap-1 bg-slate-50 p-3 py-3 rounded-md">
        <h3 className="font-bold">Chart types</h3>
        <div className="flex flex-row gap-1 p-3 rounded-sm ">
          <button
            className={`py-1 px-4 rounded-md border border-teal-500 ${
              chartType === "pie"
                ? "bg-teal-500 text-white"
                : "bg-white text-teal-800 hover:bg-teal-500 hover:text-white"
            }`}
            onClick={() => {
              setChartType("pie");
            }}
          >
            Pie
          </button>
          <button
            className={`py-1 px-4 rounded-md border border-teal-500 ${
              chartType === "doughnut"
                ? "bg-teal-500 text-white"
                : "bg-white text-teal-800 hover:bg-teal-500 hover:text-white"
            }`}
            onClick={() => {
              setChartType("doughnut");
            }}
          >
            Dougnhut
          </button>
          <button
            className={`py-1 px-4 rounded-md border border-teal-500 ${
              chartType === "bar"
                ? "bg-teal-500 text-white"
                : "bg-white text-teal-800 hover:bg-teal-500 hover:text-white"
            }`}
            onClick={() => {
              setChartType("bar");
            }}
          >
            Bar
          </button>
          <button
            className={`py-1 px-4 rounded-md border border-teal-500 ${
              chartType === "line"
                ? "bg-teal-500 text-white"
                : "bg-white text-teal-800 hover:bg-teal-500 hover:text-white"
            }`}
            onClick={() => {
              setChartType("line");
            }}
          >
            Line
          </button>
        </div>
      </div>
    </div>
  );
}
