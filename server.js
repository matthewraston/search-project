var express = require('express');
var http = require('http');
var app = express();
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
var Handlebars = require('handlebars');

// may need a different key?
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

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
    // get random gif backgroundGif
    var backgroundGif = backgroundGifs[Math.floor(Math.random()*backgroundGifs.length)];
   res.render('index', {
        backgroundGif: backgroundGif
   });
});

// exclusion list for common words
var exclusionList = [
    "the", "to", "on", "in", "off", "am", "is", "are", "was", "were", "been",
    "be", "can", "has", "shall", "will", "do", "does", "did", "have", "should",
    "may", "might", "would", "must", "could", "had", "of", "it"
];

var backgroundGifs = ["http://i.imgur.com/xpqt0rt.gif", "http://i.imgur.com/b4VFbMq.gif"];

// global list of sponsored gifs
var sponsoredGifs = [
    {
        url: "http://i.imgur.com/xpqt0rt.gif",
        tags: "office, karen, shrug, impression"
    },
    {
        url: "http://i.imgur.com/067JD.gif",
        tags: "tim, dance, rave, long, timothy"
    },
    {
        url: "http://i.imgur.com/k3IukIS.gif",
        tags: "maybe, not, fuck, you, yourself, mark, whalberg"
    },
    {
        url: "http://i.imgur.com/JolxCAB.gif",
        tags: "shut, up, point"
    },
    {
        url: "http://i.imgur.com/zlwAn.gif",
        tags: "ha, fuck, you, kanye, west"
    },
    {
        url: "http://i.imgur.com/ATeJY.gif",
        tags: "good, job, fist, bump, handshake, fail"
    },
    {
        url: "http://i.imgur.com/ZVq46.gif",
        tags: "suprise, supplies, racist"
    },
    {
        url: "http://i.imgur.com/zBjp1OG.gif",
        tags: "excellent, thumbs, up"
    },
    {
        url: "http://i.imgur.com/BNeufNH.gif",
        tags: "polish, polishing, gun, salute, lick, licking, lips"
    },
    {
        url: "http://i.imgur.com/v45lXnM.gif",
        tags: "oh, i, like, that"
    },
    {
        url: "http://i.imgur.com/vvhZhUc.gif",
        tags: "minions, yay, cheer, clap"
    },
    {
        url: "http://i.imgur.com/TwEYLwE.gif",
        tags: "nice, got, game, of, thrones, lannister"
    },
    {
        url: "http://i.imgur.com/1rpqkYk.jpg",
        tags: "get, fucked, simon, pegg, shaun, of, the, dead"
    },
    {
        url: "http://i.imgur.com/bSYLra2.jpg",
        tags: "haters, gonna, hate, spray"
    },
    {
        url: "http://i.imgur.com/7C3z0.gif",
        tags: "thats, waisis, racist"
    },
    {
        url: "http://i.imgur.com/1iyOm62.jpg",
        tags: "jim, the, office, yes"
    },
    {
        url: "http://i.imgur.com/NIVsFp9.gif",
        tags: "this, is, tough, michael, scott, the, office"
    },
    {
        url: "http://i.imgur.com/u3gXqFK.gif",
        tags: "this, is, the, worst, michael, scott, the, office"
    },
    {
        url: "http://i.imgur.com/FoalZNw.gif",
        tags: "nope, jim, the, office"
    },
    {
        url: "http://25.media.tumblr.com/3dce1b99635522b64e1cc4ef69d9a6bc/tumblr_mhbnkszwRr1r6epwko4_r1_250.gif",
        tags: "get, your, sweet, ass, out, of, here, before, i, do, something, crazy, the, office, erin"
    },
    {
        url: "http://i.giphy.com/5wWf7GW1AzV6pF3MaVW.gif",
        tags: "pam, jim, high, five, the, office"
    },
    {
        url: "http://24.media.tumblr.com/493b7094c4842b79c41a3016ccfdc676/tumblr_mz5ytsXBOP1qmfruwo2_250.gif",
        tags: "oh, my, god, its, happening, the, office, michael, scott"
    },
    {
        url: "http://i.imgur.com/0f9a5Qp.gif",
        tags: "it, all, happened, so, fast, kevin, the, office"
    },
    {
        url: "http://replygif.net/i/272.gif",
        tags: "no, god, the, office, michael, scott"
    },
    {
        url: "http://i.imgur.com/3wxS5dZ.gif",
        tags: "bitch, ryan, the, office"
    },
    {
        url: "http://31.media.tumblr.com/3973d9726d6a7f3c9e7e24ebdbcbb192/tumblr_mqwa9veB521rynk4uo1_500.gif",
        tags: "this, is, bullshit, shit, the, office, michael, scott, wedding"
    },
    {
        url: "http://i46.tinypic.com/4u9our.gif",
        tags: "thanks, for, the, info, michael, scott, the, office, point"
    },
    {
        url: "http://i.imgur.com/I3I217P.gif",
        tags: "sorry, i, annoyed, you, with, friendship, friend, andy, the, office"
    },
    {
        url: "http://24.media.tumblr.com/b67868fdbdf9b0d380e1ef546a64bd1e/tumblr_mxrkkdSy0D1qgiq62o1_500.gif",
        tags: "jlaw, law, jennifer, lawrence, hmmm, ok, sure"
    },
    {
        url: "http://25.media.tumblr.com/a590f435dc771a5fdcbf69d3f60880ae/tumblr_n1o8f5Bxoj1s9q9dro4_r1_250.gif",
        tags: "jlaw, law, jennifer, lawrence, yeah, yes, fist, pump"
    },
    {
        url: "https://31.media.tumblr.com/843b30370a6fe74beeac8be3d5d6fff3/tumblr_inline_n2wuk8uJyA1ri1boe.gif",
        tags: "jlaw, law, jennifer, lawrence, were, gonna, die"
    },
    {
        url: "http://25.media.tumblr.com/c3a013a0d02045530c21151fb1fb3932/tumblr_mr1aqjoiW61snnccgo2_250.gif",
        tags: "jlaw, law, jennifer, lawrence, crazy, laugh, ha"
    },
    {
        url: "http://31.media.tumblr.com/ba2de30560320ebcda29d386c107c4f5/tumblr_mr9vl6wdvi1s3am50o6_500.gif",
        tags: "jlaw, law, jennifer, lawrence, what, no, idea"
    },
    {
        url: "http://31.media.tumblr.com/aaa7d9c849407ab4c6db4432a555e056/tumblr_mj1k17kIL61qfjyrro1_500.gif",
        tags: "jlaw, law, jennifer, lawrence, wink"
    },
    {
        url: "http://25.media.tumblr.com/89f353e1b6a90845673b29eecc8e2ad3/tumblr_mzdbkaRymV1rjqnnfo1_500.gif",
        tags: "jlaw, law, jennifer, lawrence, wheres, the, pizza"
    },
    {
        url: "http://25.media.tumblr.com/73227be3f7515705da2f2834eae8cfc8/tumblr_n1vb2dDthH1rp3edho2_500.gif",
        tags: "jlaw, law, jennifer, lawrence, pizza, fixes, everything"
    },
    {
        url: "http://media.tumblr.com/be76b3fb0c6f9756da126784df8e0478/tumblr_inline_mjb1rbfoRd1qz4rgp.gif",
        tags: "jlaw, law, jennifer, lawrence, oh, my, god"
    },
    {
        url: "http://media.tumblr.com/f44136e3856f28df4fb0aec45ed66bd2/tumblr_inline_mi2ly8j3Kc1qz4rgp.gif",
        tags: "jlaw, law, jennifer, lawrence, meh, dunno, dont, know, shrug"
    },
    {
        url: "http://rack.0.mshcdn.com/media/ZgkyMDEzLzA5LzEyLzc4L2plbm5pZmVybGF3LjVkMDk4LmdpZgpwCXRodW1iCTg1MHg1OTA-CmUJanBn/2ce4f512/b74/jennifer-lawrence.jpg",
        tags: "jlaw, law, jennifer, lawrence, im, starving, hungry"
    },
    {
        url: "http://25.media.tumblr.com/4975ffc536cdfb0f67a915733eddc32e/tumblr_n2v7d0M7Wb1r64iyzo7_250.gif",
        tags: "b99, brooklyn, nine, nine-nine, yes"
    },
    {
        url: "http://25.media.tumblr.com/6485f5bdacc349034c2d3a730d8e0441/tumblr_n0d9h7M4lC1sfso15o2_r1_250.gif",
        tags: "b99, brooklyn, nine, nine-nine, point, nod"
    },
    {
        url: "http://25.media.tumblr.com/16a15f086acef6d200be73a5b2775647/tumblr_mtawats7u21qatzuvo1_r1_250.gif",
        tags: "b99, brooklyn, nine, nine-nine, smack, computer, doesnt, work"
    },
    {
        url: "http://25.media.tumblr.com/bbbba5bb6f9beae792a7831b0fff6a73/tumblr_n2cpmw92j01rhjaxao1_r1_500.gif",
        tags: "b99, brooklyn, nine, nine-nine, fist, bump"
    },
    {
        url: "http://31.media.tumblr.com/5f0e2771cc05ef33b55ee2d6b0e562bf/tumblr_n2otdzIjmR1sm8qcpo4_250.gif",
        tags: "b99, brooklyn, nine, nine-nine, smart"
    },
    {
        url: "http://24.media.tumblr.com/c231c49db5ec334bc5e284d5e388dbc3/tumblr_n2v5hnuM1U1tv1iqko2_250.gif",
        tags: "b99, brooklyn, nine, nine-nine, what"
    },
    {
        url: "http://24.media.tumblr.com/5ac7fb6748524de93bbdfc76a2963ccd/tumblr_n2v7d0M7Wb1r64iyzo3_250.gif",
        tags: "b99, brooklyn, nine, nine-nine, lonely, eating, all, by, myself, sad"
    },
    {
        url: "http://24.media.tumblr.com/a3f1a08f5897ba1d3f484bea26316e40/tumblr_n30te5kRIR1qe3p9bo2_250.gif",
        tags: "b99, brooklyn, nine, nine-nine, what, does, that, even, mean"
    },
    {
        url: "http://31.media.tumblr.com/e0b2480316833c3f619d281d766c65ab/tumblr_n322l4KkbL1qeztjpo4_250.gif",
        tags: "b99, brooklyn, nine, nine-nine, smile, excited"
    },
    {
        url: "http://i.imgur.com/xxLByfM.gif",
        tags: "b99, brooklyn, nine, nine-nine, hot, damn"
    },
    {
        url: "http://i.imgur.com/Eey3gPg.gif",
        tags: "the, it, crowd, not, listening"
    },
    {
        url: "http://i.imgur.com/ET0qANB.gif",
        tags: "the, it, crowd, really"
    },
    {
        url: "http://i.imgur.com/zToUeDY.gif",
        tags: "the, it, crowd, god, goddamn, right, we, are"
    },
    {
        url: "http://i.imgur.com/xvODbd3.gif",
        tags: "the, it, crowd, now, that, makes, sense, point"
    },
    {
        url: "http://s3-ak.buzzfeed.com/static/2014-03/tmp/webdr02/6/10/anigif_4388c3e9ea2653ef4c2b9aee78bec2a2-13.gif",
        tags: "friends, im, not, even, sorry, joey"
    },
    {
        url: "http://images.tangomag.com/sites/default/files/image_list/tampax-commercial.gif",
        tags: "friends, clap, joey, chandler, applause"
    },
    {
        url: "http://static.tumblr.com/ut9qusm/Z3lm27ije/sb.gif",
        tags: "friends, ross, forced, smile, fake"
    },
    {
        url: "http://25.media.tumblr.com/tumblr_magn76pxdR1rxbaego1_500.gif",
        tags: "friends, joey, im, sorry, speech, marks, quotes, quotation, fake, not"
    },
    {
        url: "http://31.media.tumblr.com/813f0b6ebe01406b860552a6924bcfdb/tumblr_mq8rtvjfzm1rvn11po2_250.gif",
        tags: "friends, joey, go, get, a beer"
    },
    {
        url: "http://media.tumblr.com/21ceda19ed2a77e318b99957b836fae1/tumblr_inline_mkzjtpkesL1qz4rgp.gif",
        tags: "friends, i, have, no, idea, whats, what, is, going, on, but, im, excited, confusion, chandler"
    },
    {
        url: "http://24.media.tumblr.com/57590501f9f114ef2ce90ce3dd2728b2/tumblr_n571mqE2LZ1qfcx4to2_250.gif",
        tags: "friends, no, noooo, rachel"
    },
    {
        url: "http://img-2.onedio.com/img/719/bound/2r0/53cf6f97fcb59be70dc736ea.gif",
        tags: "friends, point, smile, joey, chandler"
    },
    {
        url: "http://s3-ec.buzzfed.com/static/2014-07/7/13/enhanced/webdr06/anigif_enhanced-buzz-15059-1404752785-9.gif",
        tags: "friends, yay, cheer, applause, rachel, pheobe"
    },
    {
        url: "http://media.giphy.com/media/JPsFUPp3vLS5q/giphy.gif",
        tags: "friends, thumbs, up, joey, chandler"
    },
    {
        url: "http://i.imgur.com/YXe4sMy.gif",
        tags: "friends, no, idea, whats, what, is, going, on, laugh, joey"
    },
    {
        url: "http://gifs.gifme.io/i/fa0daf8d89.gif",
        tags: "help, is, on, the, way, mrs, doubtfire"
    },
    {
        url: "http://24.media.tumblr.com/b83893185509190459f88f18705a5eb0/tumblr_mjq4uxQ2Hx1qgojgxo1_250.gif",
        tags: "lots, of, wink, milana, vayntrub"
    },
    {
        url: "http://1.bp.blogspot.com/--2pNZLzyuKI/UuzPSLHMxHI/AAAAAAAAP8c/hO0Qzg2xpq0/s1600/terrrific.gif",
        tags: "terrific"
    },
    {
        url: "http://25.media.tumblr.com/tumblr_m3k5sueZCY1qbx51ho1_250.gif",
        tags: "thumbs, up, eating, lean"
    },
    {
        url: "http://weknowgifs.com/wp-content/uploads/2013/03/ha-gay-gif.gif",
        tags: "ha, gay, community, chang"
    },
    {
        url: "http://37.media.tumblr.com/9cdfe96fa6c430bc8122ffb87a950d44/tumblr_mk31vklp5O1s9n4cro1_500.gif",
        tags: "burn, ashton, kutcher"
    },
    {
        url: "http://i.imgur.com/ZzQzSAq.gif",
        tags: "champagne, spray, bottle, glasses, spit"
    },
    {
        url: "http://i.imgur.com/03LFCen.gif",
        tags: "coke, spray, bottle, spit"
    },
    {
        url: "http://media.tumblr.com/c0f0d53d2bdbf4c95786a5b62236b579/tumblr_inline_mt5g1hGdrt1rmbzz2.gif",
        tags: "something, somethings, fuck, fucky"
    },
    {
        url: "http://media.tumblr.com/tumblr_mc0kuckMPY1r0eaxj.gif",
        tags: "bin, bags, fuck, yeah, police"
    },
    {
        url: "http://www.reactiongifs.us/wp-content/uploads/2014/03/fellow_kids_steve_buscemi.gif",
        tags: "steve, stevef, fitzpas, hello, fellow, kids, how, do, you, do"
    },
    {
        url: "http://ic.pics.livejournal.com/lostacanthus/9391304/223996/223996_original.gif",
        tags: "community, thumbs, up, abed"
    },
    {
        url: "http://i.imgur.com/cGRddvY.gif",
        tags: "community, fuck, you, middle, finger, swag, guitar, guitars, troy, abed, pierce"
    },
    {
        url: "http://i.imgur.com/6EiwdC1.gif",
        tags: "community, cool, abed"
    },
    {
        url: "http://i.imgur.com/Y82ad.gif",
        tags: "community, troy, dont, eat, the, crab, dip, yeah"
    },
    {
        url: "http://www.movingimage.us/images/exhibitions/media/reaction_gif/troy-abed-community.gif",
        tags: "community, troy, abed, agree, point"
    },
    {
        url: "http://www.reactiongifs.com/r/wrong-gif.gif",
        tags: "community, wrong, jeff"
    },
    {
        url: "http://i.imgur.com/lQCPfP2.gif",
        tags: "community, troy, thumbs, up, smile, party, hat"
    },
    {
        url: "http://i.imgur.com/Retvnms.gif",
        tags: "community, hot, damn, annie"
    },
    {
        url: "http://media2.giphy.com/media/qHho9D3nk3nS8/giphy.gif",
        tags: "modern, family, phil, thumbs, up, point"
    },
    {
        url: "http://i.imgur.com/BgrgQT8.gif",
        tags: "harpreet, buff, gym, indian, muscle, flex"
    },
    {
        url: "http://i.imgur.com/M78oa6v.gif",
        tags: "dog, smile"
    },
    {
        url: "http://i.imgur.com/E8gfNu0.gif",
        tags: "racoon, roll, rolling, hallway, keep"
    },
    {
        url: "http://media0.giphy.com/media/rgHiXa9AMQaQw/200.gif",
        tags: "open, door, swag, style, awesome"
    },
    {
        url: "http://i.imgur.com/NIsHR8v.jpg",
        tags: "safe"
    },
    {
        url: "http://ak-hdl.buzzfed.com/static/2015-05/31/16/enhanced/webdr07/anigif_enhanced-buzz-24879-1433105746-7.gif",
        tags: "limsan, stop, whining, woman, up"
    },
    {
        url: "http://media.giphy.com/media/HVr4gFHYIqeti/giphy.gif",
        tags: "going, on, an, adventure, hobbit"
    },
    {
        url: "http://media.giphy.com/media/aKrVpcf1NxjRS/giphy.gif",
        tags: "i, know, what, i, fucking, said"
    },
    {
        url: "http://media2.giphy.com/media/CuNDSZsB4W9PO/giphy.gif",
        tags: "drinking, beer, german, market"
    },
    {
        url: "http://media2.giphy.com/media/YFIn0ICJFwGNa/200.gif",
        tags: "im, so, happy"
    },
    {
        url: "http://i.imgur.com/l4fOevB.gif",
        tags: "i'll, ill, allow, it, senor, chang, community"
    },
    {
        url: "http://i.imgur.com/uqMrxRZ.gif",
        tags: "respect, tip, hat, cap, cool"
    },
    {
        url: "http://i.imgur.com/XS5LK.gif",
        tags: "i, understood, that, reference, cap, captain, america, avengers"
    },
    {
        url: "http://i.imgur.com/8TP1Cx6.gif",
        tags: "thats, a, bold, strategy, cotton, lets, see, if, it, pays, off, espn8, ocho, dodgeball"
    },
    {
        url: "http://www.bite.ca/wp-content/uploads/2012/05/cool-abeds-dance.gif",
        tags: "fujayel, abed, dance, community"
    },
    {
        url: "http://i.imgur.com/ZBEqUej.gif",
        tags: "stop, girl"
    },
    {
        url: "http://24.media.tumblr.com/8bab1a47117f17b7dc6ac1d850a331f9/tumblr_ms8x03ZObJ1s2wo6co1_400.gif",
        tags: "tina, fey, high, five, point"
    },
    {
        url: "http://i.imgur.com/w8mSch7.gif",
        tags: "tina, fey, thumbs, up"
    },
    {
        url: "http://www.movingimage.us/images/exhibitions/media/reaction_gif/nope-tracy-jordan.gif",
        tags: "tracey, morgan, no, nope, hell, no"
    },
    {
        url: "http://i.imgur.com/VLsdeap.gif",
        tags: "alastair, thats, my, fetish"
    },
    {
        url: "http://gifs.gifme.io/i/fb2568b6b5.gif",
        tags: "oooo, ooooh, oooh, cat"
    },
    {
        url: "http://31.media.tumblr.com/4dfc5199fa920ff4566ede871f4e9857/tumblr_inline_n58htpFlM41szdaf5.gif",
        tags: "matt, mattll, matt'll, we, have, a, gif, for, that"
    },
    {
        url: "http://33.media.tumblr.com/bb11a3f6d420cfd54af86e281ada4616/tumblr_nels64g9mG1s48ibpo1_500.gif",
        tags: "gasp, andy"
    },
    {
        url: "http://i.imgur.com/dPYWMET.gif",
        tags: "dont, care"
    },
    {
        url: "http://gifs.gifbin.com/042011/1303921718_ralph-wiggum-discovers-easter-eggs.gif",
        tags: "easter, egg"
    }
];

app.get('/search', function (req, res) {
    var searchTerm = req.query.searchTerm;
    var mode = 0;
    if (req.query.mode)
    {
        mode = 1;
    }
    console.log("searched for: " + searchTerm);

    var gifSearch = searchTerm.replace(/ /g, '+');
    var gifResults = [];
    var majesticSearchResults = [];
    var sponsoredResults = [];
    var sponsoredGifResults = [];
    var youtubeResults = [];
    var numGifResults = 6;

    // check the search term against sponsored gifs...
    var searchComponents = searchTerm.split(" ");
    gifsloop: for(var i = 0; i < sponsoredGifs.length; i++)
    {
        var tags = sponsoredGifs[i]["tags"].split(", ");
        searchtermloop: for(var j = 0; j < searchComponents.length; j++)
        {
            // next loop if search component is in the exclusion list
            if (exclusionList.indexOf(searchComponents[j].toLowerCase()) > -1)
            {
                continue searchtermloop;
            }

            // task - more occurences in tags, more search relevence
            tagsloop: for(var k = 0; k < tags.length; k++)
            {
                // match - add to gif results, next gif loop
                if(searchComponents[j].toLowerCase() == tags[k].toLowerCase())
                {
                    // search sponsoredResults to see if the gif has already been found
                    // and add 1 to its score
                    var exists = 0;
                    for(var l = 0; l < sponsoredResults.length; l++)
                    {
                        var gif = sponsoredResults[l];
                        if (gif.url == sponsoredGifs[i]["url"])
                        {
                            gif.score++;
                            gif.tags += " " + tags[k].toLowerCase();
                            exists = 1;
                        }
                    }

                    if (!exists)
                    {
                        // otherwise, create a new result
                        var gif = ({url: sponsoredGifs[i]["url"], score: 1, tags: tags[k].toLowerCase()});
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
    if (sponsoredResults.length >= 5)
    {
        sponsoredGifResults = sponsoredResults.splice(0, 5);
    }
    else
    {
        sponsoredGifResults = sponsoredResults.splice(0, sponsoredResults.length);
    }

    // do a majestic search
    http.get("http://api.majestic.com/api/json?app_api_key=CD7525F601EA2CE773BDD24A220358C1&cmd=SearchByKeyword&count=5&datasource=fresh&scope=2&query=" + searchTerm, function (res) {
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
        if (parsedData["DataTables"]["Results"]["Data"].length > 0)
        {
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

    youTube.search(searchTerm, 1, function(error, result) {
        if (error) {
            console.log(error);
        }
        else {
            var jsonResult = JSON.stringify(result);
            var videoResults = JSON.parse(jsonResult);
            if (videoResults["items"].length > 0)
            {
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

        if (results["data"].length > 0)
        {
            for (var i = 0; i < results["data"].length; i++)
            {
                gifResults.push({
                    url: results["data"][i]["images"]["original"]["url"]
                });
            }
        }

        var noResults;
        if (gifResults.length == 0 && majesticSearchResults.length == 0 && sponsoredGifResults.length == 0 && youtubeResults.length == 0)
        {
            noResults = 1;
        }

        res.render('results', {
            searchTerm: searchTerm,
            mode: mode,
            gifResults: gifResults,
            majesticSearchResults: majesticSearchResults,
            sponsoredResults: sponsoredGifResults,
            youtubeResults: youtubeResults,
            noResults: noResults
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