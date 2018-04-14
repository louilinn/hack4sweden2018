var path = require('path');

var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../app', 'index.html'));
});

app.get('/data', function (req, res) {
    res.send(exampleData);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

var exampleData =
    {
        "regions": [1, 2, 3],
        "sunHours": [10, 4, 5]
    };

var exampleData2 =
    {
        "1": 222.5,
        "3": 36.3,
        "4": 33.0,
        "5": 50.9
    };
