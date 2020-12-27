import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerServiceService } from './../player-service.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient, private service: PlayerServiceService, private elementRef: ElementRef) { }
  _token = '';
  client_id = 'c950c38b7fd143859e60579877d1ab8b';
  redirect = 'http://localhost:4200/callback';
  _device_id = '';
  seed_genre = [];
  seed_artist = [];
  seed_track = [];
  headers() {
    return new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this._token,
    })
  }
  //stackoverflow
  decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    let x = txt.value;
    txt.remove();
    return x;
  }
  openplaylist(url) {
    console.log(url)
  }
  playlists(uri) {
    this.service.setAll();
    this.service.getList(uri);
  }
  artists(uri) {
    this.service.setAll();
    this.service.getArtists(uri);
  }
  albums(uri) {
    this.service.setAll();
    this.service.getAlbums(uri);
  }
  artist = [];
  nextartisturi = '';
  topartist() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/top/artists?limit=50", options).subscribe(data => {
      this.artist.push(...data['items']);
      this.nextartisturi = data['next'];
      for (let i = 0; i < 2; i++)
        this.seed_artist.push(this.artist[Math.floor((Math.random() * 5 * i)) % 5]['uri'].split(":")[2]);
      for (let i = 0; i < 2; i++)
        this.seed_genre.push(this.artist[Math.floor((Math.random() * 5 * i)) % 5]['genres'][0].split(" ")[0]);
    },err=>console.log(err),()=>this.toptracks())
  }
  nextartist() {
    let options = { headers: this.headers() };
    this.http.get(this.nextartisturi, options).subscribe(e => {
      this.artist.push(...e['items']);
      this.nextartisturi = e['next'];
    });
  }
  tracks = [];
  nexttrackuri = '';
  toptracks() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/top/tracks?limit=50", options).subscribe(data => {
      this.tracks.push(...data['items']);
      this.nexttrackuri = data['next'];
      for (let i = 0; i < 1; i++)
        this.seed_track.push(this.artist[Math.floor((Math.random() * 5 * i)) % 5]['uri'].split(":")[2]); 
    },(err)=>console.log(err),()=>this.recentlyplayed())
  }
  nexttrack() {
    let options = { headers: this.headers() };
    this.http.get(this.nexttrackuri, options).subscribe(e => {
      this.tracks.push(...e['items']);
      this.nexttrackuri = e['next']
    })
  }
  recents = [];
  nextrecenturi = '';
  recentlyplayed() {
    this.recents = [];
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/player/recently-played?limit=50", options).subscribe(data => {
      this.recents.push(...data['items']);
      console.log(this.recents)
      this.nextrecenturi = data['next'];
      console.log(this.nextartisturi)
    },err=>console.log(err),()=>this.savedSongs());
  }
  nextrecent() {
    console.log(this.nextrecenturi)
    let options = { headers: this.headers() };
    this.http.get(this.nextrecenturi, options).subscribe(e => {
      this.recents.push(...e['items'])
      this.nextrecenturi = e['next'];
    })
  }
  featured = [];
  featuredPlaylist() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/browse/featured-playlists?country=IN&limit=15", options).subscribe(data => {
      this.featured.push(...data['playlists']['items']);
    },err=>console.log(err),()=>this.podcast());
  };

  pods = [];
  nextpodcast = '';
  podcast() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/shows?limit=11", options).subscribe(data => {
   this.pods.push(...data['items'])
   this.nextpodcast=data['next'];
    }, err => console.log(err),()=>this.releases())
  }
nextpod()
{
  let options = { headers: this.headers() };
  this.http.get(this.nextpodcast,options).subscribe(data=>{
    this.pods.push(...data['items'])
    this.nextpodcast=data['next'];
  })
}
podcasts(uri)
  {
    this.service.setAll();
    this.service.getPodcasts(uri);
  }
  recommended = [];
  recommended_tracks() {
    let options = { headers: this.headers() };
    let url = "https://api.spotify.com/v1/recommendations?market=US&seed_artists=" + encodeURIComponent(this.seed_artist.toString()) + "&seed_tracks=" + encodeURIComponent(this.seed_track.toString()) + "&seed_genres=" + encodeURIComponent(this.seed_genre.toString());
    this.http.get(url, options).subscribe(data => {
      this.recommended.push(...data['tracks']);
    });
  }
  release = [];
  releases() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/browse/new-releases?country=US&limit=50", options).subscribe(data => {
      this.release.push(...data['albums']['items']);
    },err=>console.log(err),()=>this.recommended_tracks());
  }
  saved = [];
  savednexturi='';
  savedSongs() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/tracks?limit=50", options).subscribe(data => {
      for (let i = 0; i < 50; i++)
        if (data['items'][i]['track']['album']['images'][1]['url'])
          this.saved.push(data['items'][i]);
      this.http.get("https://api.spotify.com/v1/me/tracks?offset=50&limit=50", options).subscribe(data => {
        this.savednexturi=data['next'];
        for (let i = 0; i < 50; i++)
          if (data['items'][i]['track']['album']['images'][1]['url'])
            this.saved.push(data['items'][i]);
      });
    },err=>console.log(err),()=>this.featuredPlaylist());
  }
  nextsaved()
  {
    let options = { headers: this.headers() };
    this.http.get(this.savednexturi,options).subscribe(data=>{
      for (let i = 0; i < 50; i++){
        if (data['items'][i]['track']['name'])
      this.saved.push(data['items'][i]);
      }
    if(data['next']==this.savednexturi)
    this.savednexturi=null;
    else
      this.savednexturi=data['next'];
    })
  }
 
  play(uri) {
    this.service.play(uri, true);
  }
  pause() {
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/player/pause?device_id=" + this._device_id, {}, options).subscribe()
  }
addtoq(uri)
{
  this.service.addtoq(uri);
}
  search() {
    this.service.setAll();
    this.service.setSearch(true);
  }
  library() { }
  ngOnInit(): void {
    this.service.on=false;
    this._device_id = localStorage.getItem('device');
    this._token = localStorage.getItem('access');
    this.topartist();
  }
}
