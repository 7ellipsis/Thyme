var id;
var player;
var seek_value = 0;
var token = localStorage.getItem('access');
var duration = 0;
function mute() {
    document.getElementById("vols").classList.remove("fa-volume-up");
    document.getElementById("vols").classList.remove("fa-volume-down");
    document.getElementById("vols").classList.remove("fa-volume-off");
    document.getElementById("vols").classList.add("fa-volume-off");
    document.getElementById("vols").style.color = "red";
    document.getElementById("volume").value = 0;
}
function icon(e) {
    if (e >= 65) {
        document.getElementById("vols").classList.remove("fa-volume-up");
        document.getElementById("vols").classList.remove("fa-volume-down");
        document.getElementById("vols").classList.remove("fa-volume-off");
        document.getElementById("vols").classList.add("fa-volume-up");
        document.getElementById("vols").style.color = "forestgreen";
    }
    else if (e > 0 && e < 65) {
        document.getElementById("vols").classList.remove("fa-volume-up");
        document.getElementById("vols").classList.remove("fa-volume-down");
        document.getElementById("vols").classList.remove("fa-volume-off");
        document.getElementById("vols").classList.add("fa-volume-down");
        document.getElementById("vols").style.color = "yellow";
    }
    else {
        document.getElementById("vols").classList.remove("fa-volume-up");
        document.getElementById("vols").classList.remove("fa-volume-down");
        document.getElementById("vols").classList.remove("fa-volume-off");
        document.getElementById("vols").classList.add("fa-volume-off");
        document.getElementById("vols").style.color = "red";
    }

}
function seek(vol) {
    player.getCurrentState().then(state => {
        if (!state)
            return;
        let {
            current_track,
            next_tracks: [next_track]
        } = state.track_window;
        duration = current_track.duration_ms;
        seek_value = vol;
        player.seek(Math.ceil(duration * vol / 100)).then(() => { });
    });
}

var x = false;
function seekbar(state, durat) {
    console.log(durat)
    if (state == "play" && x == false) {
        x = setInterval(() => {
            document.getElementById('p').value = +document.getElementById('p').value + 1;
        }, durat / 100)
    }
    if (state == "pause") {
        clearInterval(x);
        x = false;
    }
}
function playerss() {
    player.togglePlay().then(() => {
        player.addListener('player_state_changed', state => {
            document.getElementById("playicon").classList.remove("fa-play");
            document.getElementById("playicon").classList.remove("fa-pause");
            duration = state.duration;
            if (state.paused == false) {
                document.getElementById("playicon").classList.add("fa-pause");

            }
            else if (state.paused) {

                document.getElementById("playicon").classList.add("fa-play");

            }
            else {
                document.getElementById("playicon").classList.add("fa-play");

            }
        });
    });
}



window.onSpotifyWebPlaybackSDKReady = () => {
    token = localStorage.getItem('access');
    player = new Spotify.Player({
        name: 'Thyme',
        getOAuthToken: cb => { cb(token); },
    });
    player.addListener('player_state_changed', state => {
        player.getCurrentState().then(state => {
            console.log(state)
            if (!state) {
                console.error('User is not playing music through the Web Playback SDK');
                return;
            }
            let {
                current_track,
                next_tracks: [next_tracks],
                previous_tracks: [previous_tracks]
            } = state.track_window;
            function queue()
            {
                var event=new CustomEvent('queue')
                event.previous= previous_tracks;
                event.next=next_tracks;
                window.dispatchEvent(event);
            }
            queue();
            document.getElementById("playicon").classList.remove("fa-play");
            document.getElementById("playicon").classList.remove("fa-pause");
            duration = current_track.duration_ms;
            document.getElementById('p').value = (state.position / duration) * 100;
            document.getElementById("image").style.backgroundImage = 'url(' + current_track.album.images[2].url + ')';
            document.getElementById("namecurr").innerHTML = current_track.name;
            document.getElementById("namecurr1").innerHTML = current_track.name;
            function like() {
                var event = new CustomEvent('liked');
                event.data = current_track.id;
                window.dispatchEvent(event);
            }
            like();
            document.getElementById("albumcurr").innerHTML = current_track.artists[0].name + "-" + current_track.album.name;
            if (state.paused == false) {
                seekbar("play", duration);
                document.getElementById("playicon").classList.add("fa-pause");

            }
            else {
                seekbar("pause", duration);
                document.getElementById("playicon").classList.add("fa-play");

            }
        });
    });


    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => {
        function auth() {
            var event = new CustomEvent('auth');
            window.dispatchEvent(event);
        }
        if(JSON.stringify(message).toLowerCase().includes('authentication'))
        auth();
    });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
    var duration = 0;
    // Ready
    function dispatch() {
        var event = new CustomEvent('onstart', {});
        window.dispatchEvent(event);
    }
   
    player.addListener('ready', ({ device_id }) => {
        id = device_id;
        localStorage.setItem('device', id);
        console.log('Ready with Device ID', device_id);
        dispatch();
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
};
const play = ({
    spotify_uri,
    playerInstance: {
        _options: {
            getOAuthToken,
            id
        }
    }
}) => {
    getOAuthToken(access_token => {
        fetch('https://api.spotify.com/v1/me/player/play?device_id=' + id, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            },
        });
    });
};





////////////////////////////////////////////////////////////
