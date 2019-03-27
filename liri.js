require('dotenv').config();
let Spotify = require('node-spotify-api');
let axios = require("axios");
let moment = require('moment');
let fs = require('fs');

let keys = require("./keys.js");
let input = process.argv;
let queryString = "";
let command = input[2];
for (var i = 3; i < input.length; i++) {
    if (queryString === "") {
        queryString += input[i];
    }
    else {
        queryString += " " + input[i];
    }
}

function liri_spotify(track_name) {
    let spotify = new Spotify(keys.spotify);
    if (track_name === undefined) {
        spotify.search({ type: 'track', query: 'track:The+Sign+artist:Ace+of+Base', limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            let artists = data['tracks']["items"][0]['album']['artists'][0]['name'];
            let song_name = data['tracks']["items"][0]['name'];
            let preview_link = data['tracks']["items"][0]['external_urls']['spotify'];
            let album_name = data['tracks']["items"][0]['album']['name'];
            console.log("* Artist(s): " + artists);
            console.log("* Track: " + song_name);
            console.log("* Preview Link: " + preview_link);
            console.log("* Album: " + album_name);
        });
    }
    else {
        spotify.search({ type: 'track', query: track_name, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            let artists = data['tracks']["items"][0]['album']['artists'][0]['name'];
            let song_name = data['tracks']["items"][0]['name'];
            let preview_link = data['tracks']["items"][0]['external_urls']['spotify'];
            let album_name = data['tracks']["items"][0]['album']['name'];
            console.log("* Artist(s): " + artists);
            console.log("* Track: " + song_name);
            console.log("* Preview Link: " + preview_link);
            console.log("* Album: " + album_name);
        });
    }

}

function liri_concert(artist_name) {
    if (artist_name === undefined) {
        console.log("Please provide Artist field");
    }
    else {
        let queryUrl = "https://rest.bandsintown.com/artists/" + artist_name + "/events?app_id=codingbootcamp";
        axios.get(queryUrl).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log(response.data[i].venue.name);
                let city = response.data[i].venue.city;
                let region = response.data[i].venue.region;
                let country = response.data[i].venue.country;
                console.log(city + ", " + region + ", " + country);
                console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("-------------------------------------------------");
            }
        });
    }
}

function liri_movie(movie_name) {
    if (movie_name === undefined) {
        let queryUrl = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(function (response) {
            console.log("* Title: " + response.data.Title);
            console.log("* Year Released: " + response.data.Year);
            console.log("* IMDB Rating: " + response.data.imdbRating);
            console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("* Country Produced: " + response.data.Country);
            console.log("* Movie Language: " + response.data.Language);
            console.log("* Movie Plot: " + response.data.Plot);
            console.log("* Actors: " + response.data.Actors);
        });
    }
    else {
        movie_name = movie_name.split(" ");
        let movie_name_query = "";
        for (var i = 0; i < movie_name.length; i++) {
            if (movie_name_query === "") {
                movie_name_query += movie_name[i];
            }
            else {
                movie_name_query += "+" + movie_name[i];
            }

        }
        let queryUrl = "http://www.omdbapi.com/?t=" + movie_name_query + "&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(function (response) {
            console.log("* Title: " + response.data.Title);
            console.log("* Year Released: " + response.data.Year);
            console.log("* IMDB Rating: " + response.data.imdbRating);
            console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("* Country Produced: " + response.data.Country);
            console.log("* Movie Language: " + response.data.Language);
            console.log("* Movie Plot: " + response.data.Plot);
            console.log("* Actors: " + response.data.Actors);
        });
    }

}


/////main switch case function
function liri(a1, a2) {
    switch (a1) {
        case 'spotify-this-song':
            liri_spotify(a2);
            break;
        case 'do-what-it-says':
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }
                let dataArr = data.split(",");
                // remove the quotes from the title!
                let name = dataArr[1].slice(1,-1);
                switch (dataArr[0]) {
                    case 'spotify-this-song':
                        liri_spotify(name);
                        break;
                    case 'concert-this':
                        liri_concert(name);
                        break;
                    case 'movie-this':
                        liri_movie(name);
                        break;
                    default:
                }
            });
            break;
        case 'concert-this':
            a2 = a2.split(" ");
            let artist = "";
            //i=3 starts from the first input after concert-this
            for (var i = 0; i < a2.length; i++) {
                if (artist === "") {
                    artist += a2[i];
                }
                else {
                    artist += '%20' + a2[i];
                }
            }
            liri_concert(artist);
            break;
        case 'movie-this':
            liri_movie(a2);
            break;
        default:
            console.log('default case error');
    }
}

liri(command, queryString);

