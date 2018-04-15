// IMPORTED DATA (or mock data)

var xData = {};
var yData = {};
var regions = [];
var region_codes = [];
var xDescription = '';
var yDescription = '';
var correlation_value = 0;
correlation(xData, yData);

var region_by_code = {
    '0': "Riket",
    '1': "Stockholms län",
    '3': "Uppsala län",
    '4': "Södermanlands län",
    '5': "Östergötlands län",
    '6': "Jönköpings län",
    '7': "Kronobergs län",
    '8': "Kalmar län",
    '9': "Gotlands län",
    '10': "Blekinge län",
    '12': "Skåne län",
    '13': "Hallands län",
    '14': "Västra Götalands län",
    '17': "Värmlands län",
    '18': "Örebro län",
    '19': "Västmanlands län",
    '20': "Dalaranas län",
    '21': "Gävleborgs län",
    '22': "Västernorrlands län",
    '23': "Jämtlands län",
    '24': "Västerbottens län",
    '25': "Norrbottens län"
};


function getDataSets(axis) {
    url = $("#" + axis + " :selected").val();
    getData(url, axis);
};

function getData(url, axis) {
    $.ajax({
        url: url,
        method: 'GET',
        async: true,
        cache: true,
        timeout: 5000,
        dataType: "json",
        success: function (response) {
            data = response.data;

            description = response.data;
            axis === 'x' ? xDescription = response.description : yDescription = response.description;
            axis === "x" ? xData = data : yData = data;
            console.log(xData, yData);
            convertedData = convertToPlotFormat(xData, yData);
            addData(myChart, Object.keys(xData), convertedData);
            correlation(xData, yData);
        },
        complete: function (data) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error connecting to the server... ' + textStatus + " " + errorThrown);
        }
    });
};

function addData(chart, labels, data) {
    myBubbleChart.destroy();
    myBubbleChart = replot(labels, data);
};

function intersectionKeys(o1, o2) {
    return Object.keys(o1).filter(key => key in o2)
};

function correlation(xData, yData) {
  x = [];
  y = [];
  console.log(region_codes);
  region_codes.forEach((code) => {
    x.push(xData[code]);
    y.push(yData[code]);
  });
  var data = new Array(x, y);
  console.log(data);
  correlation_value = pearsonCorrelation(data,0,1).toFixed(2);
  console.log(correlation_value);
  var div = document.getElementById("corr");
  div.innerHTML = "<h2>Korrelationen är: " + correlation_value +"</h2>";
};

// GRAPHICAL SETUP AND PARAMETERS
var ctx = document.getElementById("myChart");
const radius = 10;

// PARSING DATA
function convertToPlotFormat(factor1, factor2) {
  region_codes = intersectionKeys(factor1, factor2);
    datapoints = [];
    region_codes.forEach((key) => {
        datapoints.push({
            x: factor1[key],
            y: factor2[key],
            r: radius
        });
    });
    return datapoints;
};

// INIT
datapoints = convertToPlotFormat(xData, yData);
var myBubbleChart = replot(regions, datapoints);

function replot(labels, datapoints) {
    // CHART CREATION
    var plotData = {
        datasets: [{
            label: 'Vald data',
            data: datapoints,
            backgroundColor: "#42d9f4",
            borderColor: "#000000"
        }],
        labels: labels
    };
    var options = {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: xDescription //$("#x :selected").text()
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: yDescription //$("#y :selected").text()
                }
            }]
        },
        // Hover settings
        tooltips: {
            backgroundColor: "#A4A4A4",
            displayColors: false,
            callbacks: {
                label: function (tooltipItem, data) {
                    console.log(tooltipItem.index);
                    console.log(region_codes[tooltipItem.index]);
                    var label = region_by_code[region_codes[tooltipItem.index]] + ': ' || '';
                    if (label) {
                        label = [label];
                        var coordinates = '['+Math.round(tooltipItem.xLabel, 1) + ', ' + Math.round(tooltipItem.yLabel, 1)+']';
                        label.push(coordinates);
                    }

                    return label;
                }
            }
        },
        legend: {
            display: false
        },
    };
    var myBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: plotData,
        options: options
    });
    return myBubbleChart;
};

// Choose parameters
$("select").change(function (e) {
    getDataSets(e.target.id);
    myBubbleChart.update();
})

// --------------------------------------------------------------------------
//--------------- CORRELATION FUNCTION --------------------------------------
//---------------------------------------------------------------------------
/**
 *  @fileoverview Pearson correlation score algorithm.
 *  @author matt.west@kojilabs.com (Matt West)
 *  @license Copyright 2013 Matt West.
 *  Licensed under MIT (http://opensource.org/licenses/MIT).
 */

/**
 *  Calculate the person correlation score between two items in a dataset.
 *
 *  @param  {object}  prefs The dataset containing data about both items that
 *                    are being compared.
 *  @param  {string}  p1 Item one for comparison.
 *  @param  {string}  p2 Item two for comparison.
 *  @return {float}  The pearson correlation score.
 */
function pearsonCorrelation(prefs, p1, p2) {
  var si = [];

  for (var key in prefs[p1]) {
    if (prefs[p2][key]) si.push(key);
  }

  var n = si.length;

  if (n == 0) return 0;

  var sum1 = 0;
  for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];

  var sum2 = 0;
  for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];

  var sum1Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum1Sq += Math.pow(prefs[p1][si[i]], 2);
  }

  var sum2Sq = 0;
  for (var i = 0; i < si.length; i++) {
    sum2Sq += Math.pow(prefs[p2][si[i]], 2);
  }

  var pSum = 0;
  for (var i = 0; i < si.length; i++) {
    pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
  }

  var num = pSum - (sum1 * sum2 / n);
  var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
      (sum2Sq - Math.pow(sum2, 2) / n));

  if (den == 0) return 0;

  return num / den;
}
