export const datasets = {
  selectedData: ({ data, ...rest }) => ({
    showLine: false,
    fill: false,
    pointBorderColor: 'green',
    pointBackgroundColor: 'green',
    pointBorderWidth: 1,
    pointHoverRadius: 7,
    pointHoverBackgroundColor: 'green',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 3,
    pointHitRadius: 10,
    data: data,
    ...rest,
  }),
  unselectedData: ({ data, ...rest }) => ({
    showLine: false,
    pointBorderColor: 'red',
    pointBackgroundColor: 'red',
    pointBorderWidth: 1,
    pointHoverRadius: 7,
    pointHoverBackgroundColor: 'red',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 3,
    pointHitRadius: 10,
    data: data,
    ...rest,
  }),
  trendData: ({ data, ...rest }) => ({
    fill: false,
    lineTension: 0,
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderColor: 'rgba(75,192,192,1)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: 'green',
    pointBackgroundColor: 'green',
    pointBorderWidth: 0,
    pointHoverRadius: 0,
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 0,
    pointRadius: 0,
    pointHitRadius: 0,
    data: data,
    ...rest,
  }),
};

export const chartOptions = ({
  tooltipLabelCallback,
  xLabel,
  yLabel,
  xTicksMin,
  xTicksMax,
}) => ({
  legend: {
    display: false,
  },
  hover: {
    mode: 'point',
  },
  tooltips: {
    displayColors: false,
    bodyFontSize: 16,
    callbacks: {
      label: tooltipLabelCallback,
      // remove title
      title: (item, data) => null,
    },
  },
  scales: {
    yAxes: [
      {
        type: 'linear',
        scaleLabel: {
          display: true,
          labelString: yLabel,
          fontSize: 20,
          fontStyle: 'bold',
          fontFamily: 'KaTeX_Math',
          fontColor: '#212529',
        },
        ticks: {
          fontColor: '#212529',
          fontFamily: 'KaTeX_Math',
          fontSize: 17,
        },
      },
    ],
    xAxes: [
      {
        type: 'linear',
        scaleLabel: {
          display: true,
          labelString: xLabel,
          fontSize: 20,
          fontStyle: 'bold',
          fontFamily: 'KaTeX_Math',
          fontColor: '#212529',
        },
        offset: true,
        ticks: {
          min: xTicksMin,
          max: xTicksMax,
          fontColor: '#212529',
          fontFamily: 'KaTeX_Math',
          fontSize: 17,
        },
      },
    ],
  },
});
