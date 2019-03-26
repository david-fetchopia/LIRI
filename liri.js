require('dotenv').config();
let Spotify = require('node-spotify-api');
let keys = require("./keys.js");

let input = process.argv;

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
            console.log(artists);
            console.log(song_name);
            console.log(preview_link);
            console.log(album_name);
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
            console.log(artists);
            console.log(song_name);
            console.log(preview_link);
            console.log(album_name);
        });
    }
    
}




/////switch case
switch(input[2]) {
    case 'spotify-this-song':
        liri_spotify(input[3]);
        break;
    default:
        console.log('default case error');
}

