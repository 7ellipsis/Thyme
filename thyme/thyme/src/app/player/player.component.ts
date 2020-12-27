import { HostListener, Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { PlayerServiceService } from './../player-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
  .my-custom-class {
    background: black;
    color:white;
  }
  .my-custom-class .arrow:after {
    border-top-color: black;
    color:white;
  }
`]
})

export class PlayerComponent implements OnInit {

  currentid = '';
  headers() {
    return new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.service._token,
    })
  }
  likedSong: boolean;
  @HostListener('window:liked', ['$event'])
  liked(data) {
    this.currentid = data.data;
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/tracks/contains?ids=" + data.data, options).subscribe(e => this.likedSong = e[0], err => console.log(err, () => { }));
  }
  device = [];
  @HostListener('window:onstart', ['$event'])
  devices() {
    this.device = [];
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/player/devices", options).subscribe(data => {
      this.device.push(...data['devices']);
    }, err => console.log(err), () => {
      let obj = {
        "device_ids": [
          this.device[0]['id']
        ]
      }
      this.http.put("https://api.spotify.com/v1/me/player", obj, options).subscribe();
    })

  }

  plays(uri) {
    this.service.play("spotify:track:"+uri, true);
  }

  shufflecount = 0;
  shuffle() {
    this.shufflecount++;
    let state = true;
    if (this.shufflecount % 2 == 0)
      state = false;
    else
      state = true;
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/player/shuffle?state=" + state, {}, options).subscribe();
  }

  artistname = '';
  artistname1 = '';
  album = '';
  album1 = '';
  nextsrc = '';
  previoussrc = '';
  songname = '';
  songname1 = '';
  songid = '';
  songid1 = '';
  @HostListener('window:queue', ['$event'])
  queue(data) {
    if (data.next) {
      this.artistname = data.next.artists[0].name
      this.album = data.next.album.name
      this.songname = data.next.name;
      this.songid = data.next.id;
      this.nextsrc = data.next.album.images[0].url;
    }
    if (data.previous) {
      this.artistname1 = data.previous.artists[0].name
      this.album1 = data.previous.album.name
      this.previoussrc = data.previous.album.images[0].url
      this.songname1 = data.previous.name;
      this.songid1 = data.previous.id;
    }
  }

  repeatcount = 1;
  repeat() {
    this.repeatcount++;
    let state = '';
    if (this.repeatcount % 3 == 1) {
      state = 'off';
      document.getElementById("reverse").style.color = "white";
    }
    else if (this.repeatcount % 3 == 2) {
      state = 'context';
      document.getElementById("reverse").style.color = "green";
    }
    else {
      state = 'track';
      document.getElementById("reverse").style.color = "green";
    }
    console.log(state);
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/player/repeat?state=" + state, {}, options).subscribe(e => console.log(e));
  }


  value = 0;
  mutecount = 0;
  send = 0;
  mute() {
    this.mutecount++;
    if (this.mutecount % 2 != 0) {
      this.value = document.getElementById('volume')['value'];
      document.getElementById('volume')['value'] = 0;
      this.send = 0;
      document.getElementById("vols").classList.remove("fa-volume-up");
      document.getElementById("vols").classList.remove("fa-volume-down");
      document.getElementById("vols").classList.remove("fa-volume-off");
      document.getElementById("vols").classList.add("fa-volume-off");
      document.getElementById("vols").style.color = "red";
    }
    else {
      if (this.value > 65) {
        document.getElementById("vols").classList.add("fa-volume-up");
        document.getElementById("vols").style.color = "green";
      }
      else if (this.value > 0 && this.value < 65) {
        document.getElementById("vols").classList.add("fa-volume-down");
        document.getElementById("vols").style.color = "yellow";
      }
      else {
        document.getElementById("vols").classList.add("fa-volume-off");
        document.getElementById("vols").style.color = "red";
      }

      document.getElementById('volume')['value'] = this.value;
      this.send = this.value;
      document.getElementById('vols')
    }
    console.log(this.value)
    let options = { headers: this.headers() };
    this.http.put("https://api.spotify.com/v1/me/player/volume?volume_percent=" + this.send, {}, options).subscribe();
  }
  like(ele, uri) {
    var x = document.querySelector(".heartab");
    if (x.classList.contains("heart-blastab"))
      x.classList.remove("heart-blastab");
    else
      x.classList.add("heart-blastab");
    this.service.like(this.currentid);
    setTimeout(() => this.likedSong = true, 1000)
    document.getElementById("follow").style.display = 'block';

  }
  dislike(ele, uri) {
    var x = document.querySelector(".heartab");
    if (x.classList.contains("heart-blastab"))
      x.classList.remove("heart-blastab");
    else
      x.classList.add("heart-blastab");
    this.service.dislikesong(this.currentid);
    setTimeout(() => this.likedSong = false, 1000);
    document.getElementById("unfollow").style.display = 'block';


  }
  setDevice(device) {
    this.service._device_id = device.getAttribute("data-device");
    let options = { headers: this.headers() };
    let obj = {
      "device_ids": [
        device.getAttribute("data-device")
      ]
    }
    this.http.put("https://api.spotify.com/v1/me/player", obj, options).subscribe()
  }
  play() {
    this.service.play(undefined, false);
  }
  volume(vol) {
    this.service.volume(vol);
  }
  previous() {
    this.service.previous();
  }
  next() {
    this.service.next();
  }
  view() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://sdk.scdn.co/spotify-player.js";
    this.elementRef.nativeElement.appendChild(s);
    var sq = document.createElement("script");
    sq.type = "text/javascript";
    sq.src = "./../../assets/js/js.js";
    this.elementRef.nativeElement.appendChild(sq);
  }
  constructor(private service: PlayerServiceService, private elementRef: ElementRef, private http: HttpClient) { }
  ngOnInit(): void {
    this.view();
    document.getElementById("follow").style.display = 'none';
    document.getElementById("unfollow").style.display = 'none';
  }

}
