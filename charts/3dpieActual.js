 //get API json 
 $.getJSON('https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=ts_dashboard_test&rows=1000&apikey=0f36dcd81171f4408301b87c9afc8f8e1294f744eafa61a0dbda3ea4&callback=?', function(data) {
    //To hold our JSON data after we've parsed it into highcharts format 
    var chartData2 = [];
    //Loops through our data and formats it for high charts, stores into chartData array
    for (var i = 0; i < data.records.length; i++) {
       chartData2.push([data.records[i].fields.description, data.records[i].fields['2017_actual']])
    }

    Highcharts.chart('container2', {
       chart: {
          type: 'pie',
          options3d: {
             enabled: true,
             alpha: 45,
             beta: 0
          }
       },
       title: {
          text: '2017 Actual Budget'
       },
       tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
       },
       plotOptions: {
          pie: {
             allowPointSelect: true,
             cursor: 'pointer',
             depth: 35,
             dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: {
                   color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
             }
          }
       },
       series: [{
          name: 'Budget',
          colorByPoint: true,
          data: chartData2
       }]
    });
 });
 