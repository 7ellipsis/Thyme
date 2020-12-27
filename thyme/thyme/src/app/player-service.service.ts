import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PlayerServiceService {
  //https://codepen.io/skptricks/pen/ddbjVV heart animations. thanks
  _token = '';
  on=true;
  _device_id = '';
  setDevice(id) {
    this._device_id = id;
  }
  setToken(token) {
    this._token = token;
  }
  username = '';
  setname(name) {
    this.username = name;
  }
  userid = '';
  setuserid(id) {
    this.userid = id;
  }
  show_home: boolean = false;
  show_search: boolean = false;
  show_album: boolean = false;
  show_artist: boolean = false;
  show_playlist: boolean = false;
  show_track: boolean = false;
  show_library: boolean = false;
  show_podcast: boolean = false;
  show_account: boolean = false;
  show_about: boolean = false;
  setAll() {
    this.setHome(false);
    this.setSearch(false);
    this.setAlbum(false);
    this.setArtist(false);
    this.setPlaylist(false);
    this.setTrack(false);
    this.setLibrary(false);
    this.setPodcast(false);
    this.setAccount(false);
    this.setAbout(false);
  }
  getHome() {
    return this.show_home;
  }
  setHome(bool) {
    this.show_home = bool;
  }
  getLibrary() {
    return this.show_library;
  }
  setLibrary(bool) {
    this.show_library = bool;
  }
  getSearch() {
    return this.show_search;
  }
  setSearch(bool) {
    this.show_search = bool;
  }
  getAlbum() {
    return this.show_album;
  }
  setAlbum(bool) {
    this.show_album = bool;
  }
  getArtist() {
    return this.show_artist;
  }
  setArtist(bool) {
    this.show_artist = bool;
  }
  getPlaylist() {
    return this.show_playlist;
  }
  setPlaylist(bool) {
    this.show_playlist = bool;
  }
  getTrack() {
    return this.show_track;
  }
  setTrack(bool) {
    this.show_track = bool;
  }
  getPodcast() {
    return this.show_podcast;
  }
  setPodcast(bool) {
    this.show_podcast = bool;
  }
  getAccount() {
    return this.show_account;
  }
  setAccount(bool) {
    this.show_account = bool;
  }
  getAbout() {
    return this.show_about;
  }
  setAbout(bool) {
    this.show_about = bool;
  }
  decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    let x = txt.value;
    txt.remove();
    return x;
  }
  podcast = [];
  nextpodcast = '';
  podimage = '';
  podname = '';
  podartist = '';
  podURI = '';
  podfollowed: boolean;
  podrelease = '';
  podesc = '';
  getPodcasts(uri) {
    console.log(uri)
    let options = { headers: this.headers() };
    this.podcast = [];
    this.http.get(uri + "?limit=10", options).subscribe(e => {
      this.podcast.push(...e['episodes']['items']);
      this.nextpodcast = e['episodes']['next'];
      this.podimage = e['images'][0]['url'];
      this.podname = e['name'];
      this.podartist = e['publisher'];
      this.podURI = e['id'];
      this.podesc = e['description'];
    }, err => console.log(err), () => {
      this.http.get("https://api.spotify.com/v1/me/shows/contains?ids=" + this.podURI, options).subscribe(
        (e) => { this.podfollowed = e[0] }, err => console.log(err), () => {
          for (let i = 0; i < this.podcast.length; i++) {
            var time = Math.floor(+this.podcast[i]['duration_ms'] / 1000);
            let min = Math.floor(time / 60);
            let sec: any = time - (min * 60);
            if (Math.floor(sec / 10) == 0)
              sec = "0" + sec;
            this.podcast[i]['duration_ms'] = min + ":" + sec;
          }
          this.setPodcast(true);
        })

    });
  }
  nextpod() {
    let options = { headers: this.headers() };
    this.http.get(this.nextpodcast, options).subscribe(data => {
      this.podcast=[];
      this.podcast.push(...data['items'])
      for (let i = 0; i < this.podcast.length; i++) {
        if (!this.podcast[i]['duration_ms'].toString().includes(':')) {
          var time = Math.floor(+this.podcast[i]['duration_ms'] / 1000);
          let min = Math.floor(time / 60);
          let sec: any = time - (min * 60);
          if (Math.floor(sec / 10) == 0)
            sec = "0" + sec;
          this.podcast[i]['duration_ms'] = min + ":" + sec;
        }
      }
      this.nextpodcast = data['next'];
    })
  }
  myList = [];
  imageUri = '';
  owner = '';
  name = '';
  followers = '';
  description = '';
  playlistURI = '';
  playlistsong = [];
  playlistfollowed: boolean;
  boolplaylistsong;
  nextplaylist = '';
  items;
  getList(uri) {
    let options = { headers: this.headers() };
    this.myList = [];
    if (uri == "liked") {
      this.http.get("https://api.spotify.com/v1/me/tracks?limit=50", options).subscribe(data => {
        this.myList.push(data['items']);
        this.myList[0].forEach(e=>{
          console.log(e)
          this.addtoq(e['track']['uri'])
        })
        this.items = data['total'];
        this.nextplaylist = data['next'];
        this.owner = "You";
        this.name = 'Liked Songs';
        this.followers = 'private Playlist';
        this.description = 'Your Liked Songs';
        this.imageUri = './../assets/music.jpg';
        this.playlistsong = [];
        this.myList[0].forEach(x => {
          this.playlistsong.push(x['track']['id']);
        })
      }, err => console.log(err), () => {
        this.http.get("https://api.spotify.com/v1/me/tracks/contains?ids=" + encodeURIComponent(this.playlistsong.join(',')), options)
          .subscribe(e => this.boolplaylistsong = e, err => console.log(err), () => {
            this.myList[0].forEach((x, j) => {
              x['track']['liked'] = this.boolplaylistsong[j];
            })
            this.setPlaylist(true)
          })
      });
    }
    else {
      this.http.get(uri, options).subscribe(e => {
        this.items = e['tracks']['items']['length'];
        this.owner = JSON.stringify(e['owner']['display_name']);
        this.description = this.decodeHtml(e['description']);
        this.followers = e['followers']['total'];
        this.name = e['name'];
        if (e['images'].length > 0)
          this.imageUri = e['images'][0]['url'];
        this.playlistURI = e['uri'];
      }, err => console.log(err), () => {
        if (this.items > 0) {
          this.http.get<any>(uri + "/tracks?market=IN&limit=50", options)
            .subscribe(e => {
              this.nextplaylist = e['next'];
              this.playlistsong = [];
              this.myList.push(e['items']);
              this.myList[0].forEach((x, j) => {
                if (x['track'])
                  this.playlistsong.push(x['track']['id'])
              });
            }, (err) => console.log(err), () => {
              this.http.get("https://api.spotify.com/v1/playlists/" + this.playlistURI.split(':')[2] + "/followers/contains?ids=" + this.userid, options)
                .subscribe(e => this.playlistfollowed = e[0], (err) => console.log(err), () => {
                  this.http.get("https://api.spotify.com/v1/me/tracks/contains?ids=" + encodeURIComponent(this.playlistsong.join(',')), options)
                    .subscribe(e => this.boolplaylistsong = e, err => console.log(err),
                      () => {
                        this.myList[0].forEach((x, j) => {
                          if (x['track'])
                            x['track']['liked'] = this.boolplaylistsong[j];
                        })
                        this.setPlaylist(true)
                      })
                })
            })
        }
        else {
          this.setPlaylist(true)
        }
      })
    };
  }
  albumlike(uri) {
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/albums?ids=" + uri, {}, options).subscribe();
  }
  albumdislike(uri) {
    let options = { headers: this.headers() };
    this.http.delete("https://api.spotify.com/v1/me/albums?ids=" + uri, options).subscribe();
  }
  playlistlike(uri) {
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/playlists/" + uri + "/followers", { "public": false }, options).subscribe();
  }
  playlistdislike(uri) {
    let options = { headers: this.headers() };
    this.http.delete("https://api.spotify.com/v1/playlists/" + uri + "/followers", options).subscribe();
  }
  likesong(uri) {
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/tracks?ids=" + uri, {}, options).subscribe();
  }
  dislikesong(uri) {
    let options = { headers: this.headers() };
    this.http.delete("https://api.spotify.com/v1/me/tracks?ids=" + uri, options).subscribe();
  }
  podcastlike(uri) {
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/shows?ids=" + uri, {}, options).subscribe();
  }
  podcastdislike(uri) {
    let options = { headers: this.headers() };
    this.http.delete("https://api.spotify.com/v1/me/shows?ids=" + uri, options).subscribe();
  }

  album = [];
  albumName = '';
  albumImage = '';
  albumArtist = '';
  albumartistImage = '';
  albumTime = '';
  albumURI = '';
  albumFollowed: boolean;
  albumsong;
  boolalbumsong;
  nextalbumuri = '';
  getAlbums(uri) {
    this.album = [];
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/albums/" + uri.split(":")[2], options)
      .subscribe(e => {
        console.log(e);
        this.albumsong = [];
        this.nextalbumuri = e['next'];
        this.albumURI = e['uri'];
        this.album.push(e['tracks']);
        this.album[0]['items'].forEach((x, j) => {
          this.albumsong.push(x['id'])
        });
        this.albumName = e['name'];
        this.albumImage = e['images'][0];
        this.albumArtist = e['artists'][0]['name'];
      }, err => console.log(err), () => {
        this.http.get("https://api.spotify.com/v1/me/albums/contains?ids=" + this.albumURI.split(':')[2], options)
          .subscribe(e => this.albumFollowed = e[0], err => console.log(err), () => {
            this.http.get("https://api.spotify.com/v1/me/tracks/contains?ids=" + encodeURIComponent(this.albumsong.join(',')), options)
              .subscribe(e => {
                this.boolalbumsong = e;
              }, err => console.log(err), () => {
                this.album[0]['items'].forEach((x, j) => {
                  x['liked'] = this.boolalbumsong[j];
                })
                let time = 0;
                this.album[0]['items'].forEach(e => time += e['duration_ms']);
                time = Math.floor(time / 1000);
                let min = Math.floor(time / 60);
                let sec: any = time - (min * 60);
                if (Math.floor(sec / 10) == 0)
                  sec = "0" + sec;
                this.albumTime = min + ":" + sec;
                this.setAlbum(true);
              })
          })
      });
  }

  nextalbumsongs() {
    let x = [];
    let y = [];
    let z;
    let options = { headers: this.headers() };
    this.http.get(this.nextalbumuri, options).subscribe(e => {
      x.push(e['tracks']);
      x[0]['items'].forEach((k, j) => {
        y.push(k['id'])
      });
    }, (err) => console.log(err), () => {
      this.http.get("https://api.spotify.com/v1/me/tracks/contains?ids=" + encodeURIComponent(y.join(',')), options).subscribe(e => {
        z = e;
        x[0]['items'].forEach((k, j) => {
          k['liked'] = this.boolalbumsong[j];
        })
      })
    })
  }
  addtoq(uri){
    let options = { headers: this.headers() };
    this.http.post("https://api.spotify.com/v1/me/player/queue?uri=" + uri,{}, options).subscribe(e=>console.log(e));
  } 
  followuser(uri) {
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/following?type=artist&ids=" + uri, {}, options).subscribe(e => console.log(e));
  }
  unfollowuser(uri) {
    let options = { headers: this.headers() };
    this.http.delete("https://api.spotify.com/v1/me/following?type=artist&ids=" + uri, options).subscribe(e => console.log(e));
  }

  artistName = '';
  artistFollowers = '';
  artistTracks = [];
  artistAlbum = [];
  artistSingles = [];
  artistAppear = [];
  artistgenre = '';
  artistImage = '';
  artistid = '';
  artistFollowed: boolean;
  getArtists(uri) {
    this.artistTracks = [];
    this.artistAlbum = [];
    this.artistSingles = [];
    this.artistAppear = [];
    let options = { headers: this.headers() };
    this.http.get(uri, options)
      .subscribe(e => {
        this.artistFollowers = e['followers']['total'];
        this.artistgenre = e['genres'].join(",");
        this.artistImage = e['images'][0]['url'];
        this.artistName = e['name'];
        this.artistid = e['id'];
      }, err => console.log(err),
        () => {
          this.http.get(uri + "/top-tracks?country=IN", options)
            .subscribe(e => {
              this.artistTracks.push(e['tracks']);
            }, err => console.log(err),
              () => {
                this.http.get(uri + "/albums", options)
                  .subscribe(e => {
                    this.artistAlbum.push(e['items']);
                  }, err => console.log(err), () => {
                    this.http.get(uri + "/albums?include_groups=single", options)
                      .subscribe(e => {
                        this.artistSingles.push(e['items']);
                      }, err => console.log(err), () => {
                        this.http.get(uri + "/albums?include_groups=appears_on", options)
                          .subscribe(e => {
                            this.artistAppear.push(e['items'])
                          }, err => console.log(err), () => {
                            this.http.get("https://api.spotify.com/v1/me/following/contains?type=artist&ids=" + this.artistid, options)
                              .subscribe(e => {
                                this.artistFollowed = e[0]
                              }, err => console.log(err), () => {
                                this.setArtist(true);
                              })
                          })
                      })
                  })
              });
        })
  }
  like(uri) {
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/tracks?ids=" + uri, {}, options).subscribe()
  }

  pause() {
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/player/pause?device_id=" + this._device_id, {}, options).subscribe();
  }
  playing = true;

  play(uri, playing) {
    console.log(uri)
    let playback = {
      "position_ms": 0
    };
    let options = { headers: this.headers() };
    if (uri) {
      if (uri.includes("playlist") || uri.includes("album")) {
        console.log(uri)
        playback["context_uri"] = uri;
      }
      else
        playback["uris"] = [uri];
      this.http.put("https://api.spotify.com/v1/me/player/play?device_id=" + this._device_id, JSON.stringify(playback), options).subscribe();
    }
    else
      this.http.put("https://api.spotify.com/v1/me/player/play?device_id=" + this._device_id, {}, options).subscribe()
  }
  recent_s;
  recent(song) {
    this.recent_s = song;
  }
  volume(vol) {
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/player/volume?volume_percent=" + vol, {}, options).subscribe()
  }
  next() {
    let options = { headers: this.headers() };
    this.http.post("https://api.spotify.com/v1/me/player/next?device_id=" + this._device_id, {}, options).subscribe((data) => console.log(data), (err => console.log(err)));
  }
  previous() {
    let options = { headers: this.headers() };
    this.http.post("https://api.spotify.com/v1/me/player/previous?device_id=" + this._device_id, {}, options).subscribe();
  }
  headers() {
    return new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this._token,
    })
  }
  constructor(private http: HttpClient) {

  }
  
}
