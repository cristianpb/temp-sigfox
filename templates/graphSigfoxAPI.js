var ctx2 = document.getElementById('myChart2').getContext('2d');
var line_chart = new Chart(ctx2, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    datasets: [{
      label: 'Temperature',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgb(255, 99, 132)',
      fill: false,
      yAxisID: 'temp-y-axis',
      data: []
    },{
      label: 'Humidity',
      borderColor: 'rgb(132, 188, 188)',
      backgroundColor: 'rgb(132, 188, 188)',
      fill: false,
      yAxisID: 'hum-y-axis',
      data: []
    },
    ]
  },

  // Configuration options go here
  options: {
    scales: {
      xAxes: [{
        type: 'time',
      }],
      yAxes: [{
        id: 'temp-y-axis',
        type: 'linear',
        position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'Temperature'
        }
      }, {
        id: 'hum-y-axis',
        type: 'linear',
        position: 'right',
        scaleLabel: {
          display: true,
          labelString: 'Humidity'
        }
      }]
    },
    tooltips: {
      mode: 'nearest',
      intersect: false,
      callbacks: {
        title: function(tooltipItems, data) {
          return tooltipItems[0].xLabel.format("h:mma, D MMM YY");
        }
      }
    }

  }
});

function fill_chart2(chart, start, end, limit) {
  var query = "/api/sensor";
  var params = {};
  if (start) {
    params.start = start;
  }
  if (end) {
    params.end = end;
  }
  if (limit) {
    params.limit = limit;
  }

  $.getJSON(query, params,  function(data) {
    console.log(data);
    chart.data.datasets[0].data = data.map((item) => {
        return {x: moment(item.time), y: Number(item.dhtTemp)}
      })
    chart.data.datasets[1].data = data.map((item) => {
        return {x: moment(item.time), y: Number(item.dhtHum)}
      })
    chart.update();
  });
}

fill_chart2(line_chart, null, null, 100);

function all_data2(points) {
  fill_chart2(line_chart, null, null, points);
}

