var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
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
      //data: data.map((item) => {
      //  return {x: moment.unix(item.seconds), y: Number(item.temperature)}

      //})
    },{
      label: 'Humidity',
      borderColor: 'rgb(132, 188, 188)',
      backgroundColor: 'rgb(132, 188, 188)',
      fill: false,
      yAxisID: 'hum-y-axis',
      data: []
      //data: data.map((item) => {
      //  return {x: moment.unix(item.seconds), y: Number(item.humidity)}

      //})
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


function create_chart(chart, start, end, limit) {
  var query = "/data";
  if (start) {
    query += `?start=${start}`;
  } else if (limit) {
    query += `?limit=${limit}`;
  }
  if (end) {
    query += `&end=${end}`;
  }
  console.log(query);
  $.getJSON(query, function(data) {
    chart.data.datasets[0].data = data.map((item) => {
        return {x: moment.unix(item.seconds), y: Number(item.temperature)}
      })
    chart.data.datasets[1].data = data.map((item) => {
        return {x: moment.unix(item.seconds), y: Number(item.humidity)}
      })
    chart.update();
  });
}

create_chart(chart);

function all_data() {
  create_chart(chart);
}

function last_week() {
  var start = moment().unix();
  var end = moment().subtract(7,'d').unix();
  console.log(start);
  console.log(end);
  create_chart(chart, start, end);
}

function last_points() {
  var limit = 5;
  create_chart(chart, null, null, limit);
}
