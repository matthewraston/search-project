var http = require('http');
var sponsoredGifs = require('./sponsoredgifs.js').sponsoredGifs;
var Promise = require('promise');

// may need a different key?
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

// exclusion list for common words
var exclusionList = [
    "the", "to", "on", "in", "off", "am", "is", "are", "was", "were", "been",
    "be", "can", "has", "shall", "will", "do", "does", "did", "have", "should",
    "may", "might", "would", "must", "could", "had", "of", "it", "a"
];

module.exports = {
    query: function (query, callback) {
        Promise.all([
            getSponsoredGifsPromise(query),
            getGiphyPromise(query),
            getYoutubePromise(query),
            getMajesticPromise(query),
        ])
        .then(function (res) {
            return callback({
                sponsoredResults: res[0],
                gifResults: res[1],
                youtubeResults: res[2],
                majesticSearchResults: res[3],
            });
        });
    }
}

function getSponsoredGifsPromise(query) {
    return new Promise(function (resolve, reject) {
        // check the search term against sponsored gifs...
        var searchComponents = query.split(" ");
        var sponsoredResults = [];

        for (var i = 0; i < sponsoredGifs.length; i++) {
            var sponsoredGif = sponsoredGifs[i];
            var tags = sponsoredGif.tags;
            var tagMatches = 0;

            // Find number of matching tags
            for (var j = 0; j < searchComponents.length; j++) {
                // Ignore ones in exclusion list 
                if (exclusionList.indexOf(searchComponents[j].toLowerCase()) > -1) {
                    continue;
                }

                for (var k = 0; k < tags.length; k++) {
                    if (searchComponents[j].toLowerCase() == tags[k].toLowerCase()) {
                        tagMatches++;
                    }
                }
            }

            if (tagMatches == 0) {
                continue;
            }
            
            var score = tagMatches / searchComponents.length;

            if (score <= 0.3 + 0.6 / searchComponents.length) {
                continue;
            }
            
            sponsoredResults.push({
                url: sponsoredGifs[i]["url"],
                score: score
            });
        }

        // order by score
        sponsoredResults.sort(function (a, b) {
            if (a.score > b.score) {
                return -1;
            }
            if (a.score < b.score) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });

        // only show 5 results
        if (sponsoredResults.length >= 5) {
            sponsoredResults = sponsoredResults.splice(0, 5);
        }
        
        resolve(sponsoredResults);
    });
}

function getMajesticPromise(query) {
    return new Promise(function (resolve, reject) {
        // do a majestic search
        http.get("http://api.majestic.com/api/json?app_api_key=CD7525F601EA2CE773BDD24A220358C1&cmd=SearchByKeyword&count=5&datasource=fresh&scope=2&query=" + query, function (res) {
            var data = "";

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                var parsedData = JSON.parse(data);
                var majesticSearchResults = [];

                if (parsedData["DataTables"]["Results"]["Data"].length > 0) {
                    for (var i = 0; i < parsedData["DataTables"]["Results"]["Data"].length; i++) {
                        majesticSearchResults.push({
                            url: parsedData["DataTables"]["Results"]["Data"][i]["Item"],
                            title: parsedData["DataTables"]["Results"]["Data"][i]["Title"],
                            trustFlow: parsedData["DataTables"]["Results"]["Data"][i]["TrustFlow"]
                        });
                    }

                    // order by Trust Flow
                    majesticSearchResults.sort(function (a, b) {
                        if (a.trustFlow > b.trustFlow) {
                            return -1;
                        }
                        if (a.trustFlow < b.trustFlow) {
                            return 1;
                        }
                        // a must be equal to b
                        return 0;
                    });
                }

                resolve(majesticSearchResults);
            });
        }).on('error', function (e) {
            console.log("Got error grabing Majestic data: " + e.message);
            reject(e);
        });
    });
}

function getYoutubePromise(query) {
    return new Promise(function (resolve, reject) {
        youTube.search(query, 1, function (error, result) {
            if (error) {
                console.log("Got error getting YouTube result: " + error);
                reject(error);
            } else {
                var youtubeResults = [];

                if (result["items"].length > 0) {
                    var video = {
                        "id": result["items"][0]["id"]["videoId"],
                        "title": result["items"][0]["snippet"]["title"]
                    };

                    youtubeResults.push(video);
                }

                resolve(youtubeResults);
            }
        });
    });
}

function getGiphyPromise(query) {
    return new Promise(function (resolve, reject) {
        var gifSearch = query.replace(/ /g, '+');
        var numGifResults = 6;

        // do a giphy search
        http.get("http://api.giphy.com/v1/gifs/search?q=" + gifSearch + "&api_key=dc6zaTOxFJmzC&limit=" + numGifResults + "&fmt=json", function (res) {
            // add gif results to gifResults
            var data = "";

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                var results = JSON.parse(data);
                var gifResults = [];

                for (var i = 0; i < results["data"].length; i++) {
                    gifResults.push({
                        url: results["data"][i]["images"]["original"]["url"]
                    });
                }

                resolve(gifResults);
            });
        }).on('error', function (e) {
            console.log("Got error getting Giphy results: " + e.message);
            reject(e);
        });
    });
}