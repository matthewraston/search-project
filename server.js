var express = require('express');
var http = require('http');
var app = express();
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
var Handlebars = require('handlebars');

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
    var gifResults = [];
    var majesticSearchResults = [];
    var numGifResults = 5;

    // do a majestic search
    http.get("http://api.majestic.com/api/json?app_api_key=CD7525F601EA2CE773BDD24A220358C1&cmd=SearchByKeyword&count=" + numGifResults + "&datasource=fresh&scope=2&query=" + searchTerm, function (res) {
        var data = "";

        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function () {
            getMajesticDataSuccess(data);
        });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });

    var getMajesticDataSuccess = function (response) {
        var parsedData = JSON.parse(response);
        for (var i = 0; i < parsedData["DataTables"]["Results"]["Data"].length; i++) {
            majesticSearchResults.push({
                url: parsedData["DataTables"]["Results"]["Data"][i]["Item"],
                title: parsedData["DataTables"]["Results"]["Data"][i]["Title"],
                trustFlow: parsedData["DataTables"]["Results"]["Data"][i]["TrustFlow"]
            });
        }
    }

    // do a giphy search
    http.get("http://api.giphy.com/v1/gifs/search?q=" + gifSearch + "&api_key=dc6zaTOxFJmzC&limit=" + numGifResults + "&fmt=json", function (res) {
        // add gif results to gifResults
        var data = "";

        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function () {
            gifSearchSuccess(data);
        });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });

    var gifSearchSuccess = function (response) {
        var results = JSON.parse(response);
        for (var i = 0; i < numGifResults; i++)
        {
            gifResults.push({
                url: results["data"][i]["images"]["fixed_height"]["url"]
            });
        }

        res.render('results', {
            gifResults: gifResults,
            majesticSearchResults: majesticSearchResults
        });
    }

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