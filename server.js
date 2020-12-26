var express = require('express');
var app = express();
var path = require('path');

var myLogger = function (req, res, next) {
    console.log('GET ' + req.path)
    next()
}

app.use(myLogger);
app.use(express.static('.'))

// viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.htm'));
});

.listen(process.env.PORT || 5000)

var PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log('Server started at http://localhost:' + PORT));
