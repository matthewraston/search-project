var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
var Handlebars = require('handlebars');
var bodyParser = require('body-parser')

// configure app
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

// import helper JS
var searchProvider = require('./search.js');
var backgroundGifs = require('./sponsoredgifs.js').backgroundGifs;

// define the use of controllers
require('./staticcontent')(app);

// routes
app.get('/', function (req, res) {
    // get random gif backgroundGif
    var backgroundGif = backgroundGifs[Math.floor(Math.random() * backgroundGifs.length)];
    res.render('index', {
        backgroundGif: backgroundGif
    });
});

app.get('/search', function (req, res) {
    var searchTerm = req.query.searchTerm;
    var mode = 0;

    if (req.query.mode) {
        mode = 1;
    }

    console.log("searched for: " + searchTerm);

    searchProvider.query(searchTerm, function (results) {
        var numberOfResults = results.gifResults.length + results.majesticSearchResults.length + results.sponsoredResults.length + results.youtubeResults.length;

        res.render('results', {
            searchTerm: searchTerm,
            mode: mode,
            gifResults: results.gifResults,
            majesticSearchResults: results.majesticSearchResults,
            sponsoredResults: results.sponsoredResults,
            youtubeResults: results.youtubeResults,
            noResults: numberOfResults == 0
        });
    });
});

app.post('/api/slack', function (req, res) {
    var searchTerm = req.body.text;
    var apiToken = req.body.token;
    var userName = req.body.user_name;
    var teamDomain = req.body.team_domain;

    console.log(userName + " searched from " + teamDomain + ".slack for: " + searchTerm);

    searchProvider.query(searchTerm, function (results) {
        var response;

        if (results.sponsoredResults.length > 0) {
            response = results.sponsoredResults[Math.floor(Math.random() * results.sponsoredResults.length)];
            response = response.url;
        } else if (results.gifResults.length > 0) {
            response = results.gifResults[Math.floor(Math.random() * results.gifResults.length)];
            response = response.url;
        } else if (results.youtubeResults.length > 0) {
            response = results.youtubeResults[Math.floor(Math.random() * results.youtubeResults.length)];
            response = response.title + ' - https://www.youtube.com/watch?v=' + response.id;
        } else if (results.majesticSearchResults.length > 0) {
            response = results.majesticSearchResults[Math.floor(Math.random() * results.majesticSearchResults.length)];
            response = response.title + ' (' + response.trustFlow + ' TF) - ' + response.url;
        }

        if (response != undefined) {
            res.send(response);
        } else {
            res.status(204);
        }
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

var server = app.listen(process.env.PORT || 3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});