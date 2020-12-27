import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerServiceService } from './../player-service.service';
import { FilterPipe }from './../filter.pipe';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-show-playlist',
  templateUrl: './show-playlist.component.html',
  styleUrls: ['./show-playlist.component.css']
})
export class ShowPlaylistComponent implements OnInit {
  searchText;
  headers() {
    return new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.service._token,
    })
  }
  constructor(private service: PlayerServiceService, private http: HttpClient) { }
  play(uri) {
    this.service.play(uri, true);
  }
  addtoq(uri)
{
  this.service.addtoq(uri);
}
  like(uri, ele) {
    if (uri.includes("playlist")) {
      var x = document.querySelector(".heart");
      if (x.classList.contains("heart-blast"))
        x.classList.remove("heart-blast");
      else
        x.classList.add("heart-blast");
      this.service.playlistlike(uri.split(':')[2]);
      setTimeout(() => this.playlistfollowed = true, 1000)
    }
    else {
      let k = document.getElementById(ele.getAttribute('id'));
      if (k.classList.contains("heart-blasta"))
        k.classList.remove("heart-blasta");
      else
        k.classList.add("heart-blasta");
      this.service.likesong(uri.split(':')[2]);
      setTimeout(() => this.myList[ele.getAttribute('id').split('+')[1]]['track']['liked'] = true, 1000)
    }
    document.getElementById("follow3").style.display = 'block';
    
  }
  dislike(uri, ele) {
    if (uri.includes("playlist")) {
      var x = document.querySelector(".heart");
      if (x.classList.contains("heart-blast"))
        x.classList.remove("heart-blast");
      else
        x.classList.add("heart-blast");
      this.service.playlistdislike(uri.split(':')[2]);
      setTimeout(() => this.playlistfollowed = false, 1000)
    }
    else {
      let k = document.getElementById(ele.getAttribute('id'));
      if (k.classList.contains("heart-blasta"))
        k.classList.remove("heart-blasta");
      else
        k.classList.add("heart-blasta");
      this.service.dislikesong(uri.split(':')[2]);
      setTimeout(() => this.myList[ele.getAttribute('id').split('+')[1]]['track']['liked'] = false, 1000)
    }
    document.getElementById("unfollow3").style.display = 'block';
    

  }
  imgUri = ''
  myList = [];
  real = [];
  owner = '';
  name = '';
  followers = '';
  description = '';
  playlistURI = '';
  playlistfollowed: boolean;
  nextplaylist = ''
  items;
  populate() {
    this.imgUri='';
    this.items=this.service.items;
    this.playlistURI = this.service.playlistURI;
    this.imgUri = this.service.imageUri
    this.owner = this.service.owner
    this.name = this.service.name
    this.followers = this.service.followers
    this.description = this.service.description;
    this.playlistfollowed = this.service.playlistfollowed;
    this.nextplaylist = this.service.nextplaylist;
    for (let i = 0; i < this.service.myList[0].length; i++) {
      if (this.service.myList[0][i]['track'] != null) {
        var time = Math.floor(+this.service.myList[0][i]['track']['duration_ms'] / 1000);
        let min = Math.floor(time / 60);
        let sec: any = time - (min * 60);
        if (Math.floor(sec / 10) == 0)
          sec = "0" + sec;
        this.myList.push(this.service.myList[0][i]);
        this.myList[i]['track']['duration_ms'] = min + ":" + sec;
      }
    }
    if(this.nextplaylist)
    this.nextplaylistsongs();
  }
  nextplaylistsongs() {
    let x = [];
    let y = [];
    let z;
    let options = { headers: this.headers() };
    this.http.get(this.nextplaylist, options).subscribe(e => {
      x.push(e['items']);
      this.nextplaylist = e['next'];
      x[0].forEach((k, j) => {
        if (k['track'])
          y.push(k['track']['id'])
      });
    }, err => console.log(err), () => {
      this.http.get("https://api.spotify.com/v1/me/tracks/contains?ids=" + encodeURIComponent(y.join(',')), options).subscribe(e => {
        z = e;
      }, err => console.log(err), () => {
        x[0].forEach((k, j) => {
          if (k['track'])
            k['track']['liked'] = z[j];
        })
        for (let i = 0; i < x[0].length; i++) {
          if (x[0][i]['track'] != null) {
            var time = Math.floor(+x[0][i]['track']['duration_ms'] / 1000);
            let min = Math.floor(time / 60);
            let sec: any = time - (min * 60);
            if (Math.floor(sec / 10) == 0)
              sec = "0" + sec;
            x[0][i]['track']['duration_ms'] = min + ":" + sec;
          }
        }
        this.myList.push(...x[0]);
        if(this.nextplaylist)
        this.nextplaylistsongs();
      })
    })
  }
  ngOnInit(): void {
    this.populate();
    document.getElementById("follow3").style.display = 'none';
    document.getElementById("unfollow3").style.display = 'none';

  }

}