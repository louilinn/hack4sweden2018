// IMPORTED DATA (or mock data)
var xData = {};
var yData = {};
var regions = [];
var xDescription = '';
var yDescription = '';

var region_by_code = {
    '0': "Riket",
    '1': "Stockholms län",
    '3': "Uppsala län",
    '4': "Södermanlands län",
    '5': "Östergötlands län",
    '6': "Jönköpings län",
    '7': "Kronobergs län",
    '8': "Kalmar län",
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
}

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
            axis === 'x' ? xDescription = response.description: yDescription = response.description;
            axis === "x" ? xData = data : yData = data;
            convertedData = convertToPlotFormat(xData, yData);
            addData(myChart, Object.keys(xData), convertedData);
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

// GRAPHICAL SETUP AND PARAMETERS
var ctx = document.getElementById("myChart");
const radius = 10;

// PARSING DATA
function convertToPlotFormat(factor1, factor2) {
    function intersectionKeys(o1, o2) {
        return Object.keys(o1).filter(key => key in o2)
    };
    const commonKeys = intersectionKeys(factor1, factor2);
    datapoints = [];
    commonKeys.forEach((key) => {
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
                    var label = regions[tooltipItem.index] || '';

                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.xLabel);
                    label += ", ";
                    label += Math.round(tooltipItem.yLabel);
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
