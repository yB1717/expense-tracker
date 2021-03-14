import React from "react";
import { Line } from "react-chartjs-2";

const chart = (props) => {
  return (
    <Line
      data={{
        labels: props.label,
        datasets: [
          {
            label: "Expenditure",
            backgroundColor: props.bgColor,
            borderColor: props.borderColor,
            borderWidth: 2,
            data: props.data,
          },
        ],
      }}
      options={{
        title: {
          display: true,
          text: props.title,
          fontSize: 20,
        },
        legend: {
          display: true,
          position: "top",
          labels: {
            fontColor: "black",
            fontSize: 15,
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontSize: 15,
                fontColor: 'black'
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontSize: 15,
                fontColor: 'black'
              },
            },
          ],
        },
        responsive:true,
        maintainAspectRatio:false
      }}
    />
  );
};

export default chart;
