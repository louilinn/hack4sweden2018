// IMPORTED DATA (or mock data)
var xData = {};
var yData = {};
var regions = [];


function getDataSets(axis) {
    url = $("#" + axis + " :selected").val();
    getData(url, axis);
}

function getData(url, axis) {
    $.ajax({
        url: url,
        method: 'GET',
        async: false,
        cache: false,
        timeout: 5000,
        dataType: "json",
        success: function (data) {
            console.log("success");
            console.log("NY DATA:");
            console.log(data);
            axis === "x" ? xData = data : yData = data;
            convertedData = convertToPlotFormat(xData, yData);
            addData(myChart, Object.keys(xData), convertedData);
        },
        complete: function (data) {
            console.log("completed");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error connecting to the Node.js server... ' + textStatus + " " + errorThrown);
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
                    labelString: $("#x :selected").text()
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: $("#y :selected").text()
                }
            }]
        },
        // Hover settings
        tooltips: {
            backgroundColor: "#A4A4A4",
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