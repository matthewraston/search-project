var http = require('http');
var sponsoredGifs = require('./sponsoredgifs.js').sponsoredGifs;

// may need a different key?
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

// exclusion list for common words
var exclusionList = [
    "the", "to", "on", "in", "off", "am", "is", "are", "was", "were", "been",
    "be", "can", "has", "shall", "will", "do", "does", "did", "have", "should",
    "may", "might", "would", "must", "could", "had", "of", "it"
];

module.exports = {
    query: function (query, callback) {
        var gifSearch = query.replace(/ /g, '+');
        var gifResults = [];
        var majesticSearchResults = [];
        var sponsoredResults = [];
        var sponsoredGifResults = [];
        var youtubeResults = [];
        var numGifResults = 6;

        // check the search term against sponsored gifs...
        var searchComponents = query.split(" ");

        gifsloop: for (var i = 0; i < sponsoredGifs.length; i++) {
                var tags = sponsoredGifs[i]["tags"].split(", ");
                searchtermloop: for (var j = 0; j < searchComponents.length; j++) {
                    // next loop if search component is in the exclusion list
                    if (exclusionList.indexOf(searchComponents[j].toLowerCase()) > -1) {
                        continue searchtermloop;
                    }

                    // task - more occurences in tags, more search relevence
                    tagsloop: for (var k = 0; k < tags.length; k++) {
                        // match - add to gif results, next gif loop
                        if (searchComponents[j].toLowerCase() == tags[k].toLowerCase()) {
                            // search sponsoredResults to see if the gif has already been found
                            // and add 1 to its score
                            var exists = 0;

                            for (var l = 0; l < sponsoredResults.length; l++) {
                                var gif = sponsoredResults[l];
                                if (gif.url == sponsoredGifs[i]["url"]) {
                                    gif.score++;
                                    gif.tags += " " + tags[k].toLowerCase();
                                    exists = 1;
                                }
                            }

                            if (!exists) {
                                // otherwise, create a new result
                                var gif = ({
                                    url: sponsoredGifs[i]["url"],
                                    score: 1,
                                    tags: tags[k].toLowerCase()
                                });

                                sponsoredResults.push(gif);
                            }
                        }
                    }
                }
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
            sponsoredGifResults = sponsoredResults.splice(0, 5);
        } else {
            sponsoredGifResults = sponsoredResults.splice(0, sponsoredResults.length);
        }

        // do a majestic search
        http.get("http://api.majestic.com/api/json?app_api_key=CD7525F601EA2CE773BDD24A220358C1&cmd=SearchByKeyword&count=5&datasource=fresh&scope=2&query=" + query, function (res) {
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
        }

        youTube.search(query, 1, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                var jsonResult = JSON.stringify(result);
                var videoResults = JSON.parse(jsonResult);
                if (videoResults["items"].length > 0) {
                    var video = {
                        "id": videoResults["items"][0]["id"]["videoId"],
                        "title": videoResults["items"][0]["snippet"]["title"]
                    };
                    youtubeResults.push(video);
                }
            }
        });

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

            if (results["data"].length > 0) {
                for (var i = 0; i < results["data"].length; i++) {
                    gifResults.push({
                        url: results["data"][i]["images"]["original"]["url"]
                    });
                }
            }

            return callback({
                gifResults: gifResults,
                majesticSearchResults: majesticSearchResults,
                sponsoredResults: sponsoredGifResults,
                youtubeResults: youtubeResults
            });
        }
    }
}