import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerServiceService } from './../player-service.service';
@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  headers() {
    return new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.service._token,
    })
  }
  artist = [];
  nextartisturi = '';
  topartist() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/following?type=artist&limit=50", options).subscribe(data => {
    console.log(data)  
    this.artist.push(...data['artists']['items']);
      this.nextartisturi = data['artists']['next'];
    }, err => console.log(err))
  }
  nextartist() {
    let options = { headers: this.headers() };
    this.http.get(this.nextartisturi, options).subscribe(data => {
      this.artist.push(...data['artists']['items']);
      this.nextartisturi = data['artists']['next'];
    })
  }
  playlistspop = [];
  nextplaylisturi=''
;  topplaylist() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/playlists?limit=50", options).subscribe(data => {
    for(let i=0;i<data['items'].length;i++){
      if(data['items'][i]['images'].length>0)
      this.playlistspop.push(data['items'][i]);
    }  
    
      this.nextplaylisturi=data['next'];
    });
  }
  nextplaylist(){
    let options = { headers: this.headers() };
    this.http.get(this.nextplaylisturi,options).subscribe(e=>{
      this.playlistspop.push(...e['items']);
      this.nextplaylisturi=e['next'];
    })
  }
  albums = [];
  nextalbumuri = '';
  getalbums() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/albums?limit=50", options).subscribe(data => {
      this.albums.push(...data['items']);
      this.nextalbumuri = data['next'];
    });
  }
  getnextalbums() {
    let options = { headers: this.headers() };
    this.http.get(this.nextalbumuri, options).subscribe(data => {
      this.albums.push(...data['items']);
      this.nextalbumuri = data['next'];
    })
  }
  saved = [];
  savednexturi = '';
  savedSongs() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/tracks?limit=50", options).subscribe(data => {
    for (let i = 0; i < 50; i++)
        if (data['items'][i]['track']['album']['images'][1]['url'])
          this.saved.push(data['items'][i]);
          this.savednexturi=data['next'];
    }, err => console.log(err));
  }
  nextsaved() {
    let options = { headers: this.headers() };
    this.http.get(this.savednexturi, options).subscribe(data => {
      for (let i = 0; i < 50; i++) {
        if (data['items'][i]['track']['name'])
          this.saved.push(data['items'][i]);
      }
      if (data['next'] == this.savednexturi)
        this.savednexturi = null;
      else
        this.savednexturi = data['next'];
    })
  }
  
  pods = [];
  nextpodcast = '';
  
  podcast() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/shows", options).subscribe(data => {
   this.pods.push(...data['items'])
   this.nextpodcast=data['next'];
   console.log(data);
    }, err => console.log(err))
  }
nextpod()
{
  let options = { headers: this.headers() };
  this.http.get(this.nextpodcast,options).subscribe(data=>{
    this.pods.push(...data['items'])
    this.nextpodcast=data['next'];
  })
}

  play(uri) {
    this.service.play(uri, true);
  }
  artists(uri) {
    this.service.setAll();
    this.service.getArtists(uri);
  }
  playlists(uri) {
    this.service.setAll();
    this.service.getList(uri);
  }
  albumsop(uri) {
    this.service.setAll();
    this.service.getAlbums(uri);
  }
  podcasts(uri)
  {
    this.service.setAll();
    this.service.getPodcasts(uri);
  }
  artistopen() {
    this.podcastblock = false;
    this.playlistblock = false;
    this.albumsblock = false;
    this.artistblock = true;
    this.trackblock = false;
  }
  playlistopen() {
    this.podcastblock = false;
    this.playlistblock = true;
    this.albumsblock = false;
    this.artistblock = false;
    this.trackblock = false;
  }
  albumopen() {
    this.podcastblock = false;
    this.playlistblock = false;
    this.albumsblock = true;
    this.artistblock = false;
    this.trackblock = false;
  }
  podcastopen() {
    this.podcastblock = true;
    this.playlistblock = false;
    this.albumsblock = false;
    this.artistblock = false;
    this.trackblock = false;
  }
  trackopen() {
    this.podcastblock = false;
    this.playlistblock = false;
    this.albumsblock = false;
    this.artistblock = false;
    this.trackblock = true;
  }
  constructor(private http: HttpClient, private service: PlayerServiceService) { }
  artistblock = false;
  podcastblock = false;
  playlistblock = false;
  albumsblock = false;
  trackblock = false;
  ngOnInit(): void {
    this.topartist();
    this.topplaylist();
    this.getalbums();
    this.savedSongs();
    this.podcast();
  }

}
