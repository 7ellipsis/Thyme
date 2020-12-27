import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerServiceService } from './../player-service.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private http: HttpClient, private service: PlayerServiceService) { }
  headers() {
    return new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.service._token,
    })
  }
  play(uri) {
    this.service.play(uri, true);
  }
  playlists(uri){
    this.service.setAll();
    this.service.getList(uri);
  }
  artists(uri){
    this.service.setAll();
    this.service.getArtists(uri);
  }
  albums(uri){
    this.service.setAll();
    this.service.getAlbums(uri);
  }
  podcasts(uri)
  {
    this.service.setAll();
    this.service.getPodcasts(uri);
  }
  pause() {
    this.service.pause();
  }
  artist = [];
  playlist = [];
  album = [];
  track = [];
  shows=[];
  episodes=[];
  app(search) {
    this.artist = [];
    this.playlist = [];
    this.album = [];
    this.track = [];
    this.shows=[];
  this.episodes=[];
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/search?q=" + encodeURIComponent(search) + "&type=album&limit=40", options).subscribe(data => {
      for (let i = 0; i < data['albums']['items'].length; i++)
        if (data['albums']['items'][i]['images'].length != 0)
          this.album.push(data['albums']['items'][i]);
      this.http.get("https://api.spotify.com/v1/search?q=" + encodeURIComponent(search) + "&type=artist&limit=10", options).subscribe(data => {
        for (let i = 0; i < data['artists']['items'].length; i++)
          if (data['artists']['items'][i]['images'].length != 0)
            this.artist.push(data['artists']['items'][i]);
        this.http.get("https://api.spotify.com/v1/search?q=" + encodeURIComponent(search) + "&type=playlist&limit=50", options).subscribe(data => {
          for (let i = 0; i < data['playlists']['items'].length; i++)
            if (data['playlists']['items'][i]['images'].length != 0)
              this.playlist.push(data['playlists']['items'][i]);
          this.http.get("https://api.spotify.com/v1/search?q=" + encodeURIComponent(search) + "&type=track&limit=50", options).subscribe(data => {
          for (let i = 0; i < data['tracks']['items'].length; i++)
              if (data['tracks']['items'][i]['album']['images'].length != 0)
                this.track.push(data['tracks']['items'][i]);
          });
          this.http.get("https://api.spotify.com/v1/search?q=" + encodeURIComponent(search) + "&type=show&limit=10", options).subscribe(data => {
                this.shows.push(...data['shows']['items']);
          });
          this.http.get("https://api.spotify.com/v1/search?q=" + encodeURIComponent(search) + "&type=episode&limit=30", options).subscribe(data => {
                  this.episodes.push(...data['episodes']['items']);
            });
        });
      });
    });
  }
  ngOnInit(): void {
  }

}
