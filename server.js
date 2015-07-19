var express = require('express');
var http = require('http');
var app = express();
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
var Handlebars = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');
HandlebarsIntl.registerWith(Handlebars);

// configure app
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use('/public', express.static('public'));

// define the use of controllers
require('./staticcontent')(app);

// routes
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/search', function (req, res) {
    var searchTerm = req.query.searchTerm;
    var gifSearch = searchTerm.replace(/ /g, '+');
    var gifResult = "";

    http.get("http://api.giphy.com/v1/gifs/search?q=" + gifSearch + "&api_key=dc6zaTOxFJmzC&limit=1&fmt=json", function (res) {
        // add gif results to gifResults
        var data = "";

        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function () {
            var results = JSON.parse(data);
            gifResult.url = results["data"][0]["embed_url"];
        });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });

    console.log(gifResult.gif);
    res.render('results', {
        gifResult: gifResult
    });
});

// error handling
app.use(function (err, req, res, next) {
    error500(res, err);
});

function error500(res, error) {
    console.error(error.stack || error);
    res.status(500).render('errors/500');
}

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});