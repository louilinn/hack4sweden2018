function getData() {
    $.ajax({
        url: '/data',
        method: 'GET',
        async: false,
        cache: false,
        timeout: 5000,
        dataType: "json",
        success: function (data) {
            console.log("success");
            console.log("RECEIVED DATA:");
            console.log(data);
            // addData(myChart, data.regions, data.sunHours);
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
    labels = labels.map(String);
    labels.forEach((l) => {
        chart.data.labels.push(l);
    })
    data.forEach((d) => {
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(d);
        });
    })
    chart.update();
};
//getData();

// GRAPHICAL SETUP AND PARAMETERS
var ctx = document.getElementById("myChart");
const radius = 10;

// DATA CHOICES
choiceFactor1 = "Självmord";
choiceFactor2 = "Sjukskrivning";

// IMPORTED DATA (or mock data)
const suicide = { "1": 222.5, "2": 100, "3": 36.3, "4": 33.0 };
const mock = { "1": 22, "3": 3.3, "4": 3.1, "5": 3.0 };
const regions = ["Umea", "Malmö", "Sthlm"];

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
datapoints = convertToPlotFormat(mock, suicide);

// CHART CREATION
var plotData = {
    datasets: [{
        label: 'Vald data',
        data: datapoints,
        backgroundColor: "#42d9f4",
        borderColor: "#000000"
    }],
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
                labelString: $("#select1 :selected").text()
            }
        }],
        yAxes: [{
            ticks: {
                beginAtZero: true
            },
            scaleLabel: {
                display: true,
                labelString: choiceFactor2
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

// Choose parameters
$("select").change(() => {
    console.log("CHANGE");
    myBubbleChart.options.scales.xAxes[0].scaleLabel.labelString = $("#select1 :selected").text()
    myBubbleChart.options.scales.yAxes[0].scaleLabel.labelString = $("#select2 :selected").text()
    myBubbleChart.update();
})