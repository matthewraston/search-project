var https = require('https');
var sponsoredGifs = require('./sponsoredgifs.js').sponsoredGifs;
var Promise = require('promise');

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
        ])
        .then(function (res) {
            return callback({
                sponsoredResults: res[0],
                gifResults: res[1],
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

function getGiphyPromise(query) {
    return new Promise(function (resolve, reject) {
        var gifSearch = query.replace(/ /g, '+');
        var numGifResults = 6;

        // do a giphy search
        https.get("https://api.giphy.com/v1/gifs/search?q=" + gifSearch + "&api_key=dc6zaTOxFJmzC&limit=" + numGifResults + "&fmt=json", function (res) {
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