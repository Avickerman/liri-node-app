// Still running with some errors


require("dotenv").config();

var request = require('request');


var keys = require("./keys.js");
const fs = require('fs');
var spotify = new spotify(keys.spotify);
// var client = new Twitter(keys.twitter);


var cmdArgs = process.argv;

var liriCommand = cmdArgs[2];

var liriArg = '';
for (var i = 3; i < cmdArgs.length; i++) {
    liriArg += cmdArgs[i] + ' ';
}

function retrieveTweets() {
    fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
        if (err) throw err;
    });
    var client = new Twitter(keys.twitter);

    var params = { screen_name: '@Andrew12633910', count: 20 };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            var errorStr = 'ERROR: Could not retrieve user tweets...' + error;

            fs.appendFile('./log.txt', errorStr, (err) => {
                if (err) throw err;
                console.log(errorStr);
            });
            return;
        } else {
            var outputStr = '------------------------\n' +
                'User Tweets:\n' +
                '------------------------\n\n';
            for (var i = 0; i < tweets.length; i++) {
                outputStr += 'Created on: ' + tweets[i].created_at + '\n' +
                    'Tweet content: ' + tweets[i].text + '\n' +
                    '------------------------\n';
            }
            fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
                if (err) throw err;
                console.log(outputStr);
            });
        }
    });
}

function spotifySong(song) {
    fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song ' + song + '\n\n', (err) => {
        if (err) throw err;
    });


    var search;
    if (song === '') {
        search = 'The Sign Ace Of Base';
    } else {
        search = song;
    }
    
    spotify.search({ type: 'track', query: search }, function (error, data) {
        if (error) {
            var errorStr1 = 'ERROR: Could not spotify track...' + error;

            fs.appendFile('./log.txt', errorStr1, (err) => {
                if (err) throw err;
                console.log(errorStr1);
            });
            return;
        } else {
            var songInfo = data.tracks.items[0];
            if (!songInfo) {
                var errorStr2 = 'ERROR';

                fs.appendFile('./log.txt', errorStr2, (err) => {
                    if (err) throw err;
                    console.log(errorStr2);
                });
                return;
            } else {
                // * Artist(s)
                // * The song's name
                // * A preview link of the song from Spotify
                // * The album that the song is from
                var outputStr = '------------------------\n' +
                    'Song Information:\n' +
                    '------------------------\n\n' +
                    'Song Name: ' + songInfo.name + '\n' +
                    'Artist: ' + songInfo.artists[0].name + '\n' +
                    'Album: ' + songInfo.album.name + '\n' +
                    'Preview Here: ' + songInfo.preview_url + '\n';

                fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
                    if (err) throw err;
                    console.log(outputStr);
                });
            }
        }
    });
}

function OMDBInfo(movie) {
    fs.appendFile('./log.txt', 'User Command: node liri.js movie-this ' + movie + '\n\n', (err) => {
        if (err) throw err;
    });
    var search;
    if (movie === '') {
        search = 'Mr. Nobody';
    } else {
        search = movie;
    }
    search = search.split(' ').join('+');
    var queryStr = 'http://www.omdbapi.com/?t=' + search + "&y=&plot=short&apikey=trilogy";

    request(queryStr, function (error, response, body) {
        if (error || (response.statusCode !== 200)) {
            var errorStr1 = 'ERROR...' + error;

            fs.appendFile('./log.txt', errorStr1, (err) => {
                if (err) throw err;
                console.log(errorStr1);
            });
            return;
        } else {
            var data = JSON.parse(body);
            if (!data.Title && !data.Released && !data.imdbRating) {
                var errorStr2 = 'ERROR...';

                fs.appendFile('./log.txt', errorStr2, (err) => {
                    if (err) throw err;
                    console.log(errorStr2);
                });
                return;
            } else {
                // * Title of the movie.
                // * Year the movie came out.
                // * IMDB Rating of the movie.
                // * Rotten Tomatoes Rating of the movie.
                // * Country where the movie was produced.
                // * Language of the movie.
                // * Plot of the movie.
                // * Actors in the movie.
                var outputStr = '------------------------\n' +
                    'Movie Information:\n' +
                    '------------------------\n\n' +
                    'Movie Title: ' + data.Title + '\n' +
                    'Year Released: ' + data.Released + '\n' +
                    'IMBD Rating: ' + data.imdbRating + '\n' +
                    'Country Produced: ' + data.Country + '\n' +
                    'Language: ' + data.Language + '\n' +
                    'Plot: ' + data.Plot + '\n' +
                    'Actors: ' + data.Actors + '\n' +
                    'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
                    'Rotten Tomatoes URL: ' + data.tomatoURL + '\n';

                fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
                    if (err) throw err;
                    console.log(outputStr);
                });
            }
        }
    });
}

function doAsYerTold() {
    fs.appendFile('./log.txt', 'User Command: node liri.js do-what-it-says\n\n', (err) => {
        if (err) throw err;
    });

    fs.readFile('./random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log('ERROR: Reading random.txt...' + error);
            return;
        } else {
            var cmdString = data.split(',');
            var command = cmdString[0].trim();
            var param = cmdString[1].trim();

            switch (command) {
                case 'my-tweets':
                    retrieveTweets();
                    break;

                case 'spotify-this-song':
                    spotifySong(param);
                    break;

                case 'movie-this':
                    OMDBInfo(param);
                    break;
            }
        }
    });
}


if (liriCommand === 'my-tweets') {
    retrieveTweets();

} else if (liriCommand === `spotify-this-song`) {
    spotifySong(liriArg);

} else if (liriCommand === `movie-this`) {
    OMDBInfo(liriArg);

} else if (liriCommand === `do-what-it-says`) {
    doAsYerTold();

} else {

    fs.appendFile('./log.txt', 'User Command: ' + cmdArgs + '\n\n', (err) => {
        if (err) throw err;

        outputStr = 'Usage:\n' +
            '    node liri.js my-tweets\n' +
            '    node liri.js spotify-this-song "<song_name>"\n' +
            '    node liri.js movie-this "<movie_name>"\n' +
            '    node liri.js do-what-it-says\n';


        fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
            if (err) throw err;
            console.log(outputStr);
        });
    });
}









