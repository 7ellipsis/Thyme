import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {PlayerServiceService} from './../player-service.service';
import { newArray } from '@angular/compiler/src/util';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'],
})
export class CallbackComponent implements OnInit, AfterViewInit {

  constructor(private service:PlayerServiceService,private http: HttpClient, private elementRef: ElementRef) { 
   
  }
  
  title = 'thyme';
  _token = '';
  client_id = 'c950c38b7fd143859e60579877d1ab8b';
  redirect = 'http://localhost:4200/callback';
  _device_id = '';
  // scope = "user-read-recently-played playlist-modify user-read-email user-top-read playlist-read-private user-modify-playback-state streaming playlist-modify-private user-read-recently-played";
  refresh_token = '';
  base64 = '';
  show_home:boolean;
 show_search:boolean;
 show_album:boolean;
 show_artist:boolean;
 show_playlist:boolean;
client_secret = 'a0eecd14b2f64bd8b3c1e8ff33c90e0a';
redirect_uri = 'http://localhost:4200/callback';
scope = "user-read-private user-follow-read,user-follow-modify user-library-modify user-read-playback-state user-library-read playlist-modify user-read-email user-top-read playlist-read-private user-modify-playback-state streaming playlist-modify-private user-read-recently-played";
  ngAfterViewInit() {
    this.view();
  }
  
  headers() {
    return new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this._token,
    })
  }
  playlistspop = [];
  topplaylist() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me/playlists", options).subscribe(data => {
      this.playlistspop.push(...data['items']);
    });
  }
  createplaylist()
  {
    let options = { headers: this.headers() };
    let name=document.getElementById('playlistname') as HTMLInputElement;
    let desc=document.getElementById('playdesc') as HTMLInputElement;
    let obj={
      "name": name.value,
      "description": desc.value,
      "public": false
    }
    this.http.post("https://api.spotify.com/v1/users/"+this.service.userid+"/playlists",obj,options).subscribe(e=>console.log(e),err=>console.log(err),()=>{
      this.topplaylist();
    });
    //get location and redirect there);
  }
home(){
  return this.service.getHome();
}
search(){
  return this.service.getSearch();
}
artist(){
  return this.service.getArtist();
}
album(){
  return this.service.getAlbum();
}
playlist(){
  return this.service.getPlaylist();
}
librarys(){
  return this.service.getLibrary();
}
podcast(){
  return this.service.getPodcast();
}
account(){
  return this.service.getAccount();
}
about(){
  return this.service.getAbout();
}
view() {
  var side=document.createElement("script");
  side.type="text/javascript";
  side.innerHTML=`
  $(function() {$('.carousel').carousel({interval: 3000});});
  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }`
  this.elementRef.nativeElement.appendChild(side);
}
  auth() {
    //on refresh when cant login again and again
    window.location.replace(JSON.stringify('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + this.client_id +
    '&scope=' + encodeURIComponent(this.scope) +
    '&redirect_uri=' + encodeURIComponent(this.redirect_uri)));
  }
  searchs(){
    this.service.setAll();
    this.service.setSearch(true);
  }
  homes(){
    this.service.setAll();
    this.service.setHome(true);
  }
  abouts(){
    this.service.setAll();
    this.service.setAbout(true);
  }
  library(){
    this.service.setAll();
    this.service.setLibrary(true);
  }
  podcasts()
  {
    this.service.setAll();
    this.service.setPodcast(true);
  }
  playlists(uri){
    this.service.setAll();
    this.service.getList(uri);
  }
  accounts()
  {
    this.service.setAll();
    this.service.setAccount(true);
  }
  mydetails()
  {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me",options).subscribe(e=>{
      this.service.setname(e['display_name']);
       this.service.setuserid(e['id']);
    })
  }

firsttime(){
  let uri = window.location.href;
  let code = uri.split('code=')[1];
  if (code == undefined)
    this.auth();
    var base=btoa(this.client_id+':'+this.client_secret);
    var x={
      code:base
    }
 // this.http.get('/logdata').subscribe(x => {
    let headers = new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + x['code'],
    })
    this.base64 = x['code'];
    let options = { headers: headers };
    let body = `grant_type=authorization_code&redirect_uri=${this.redirect}&code=${code}`
    return this.http.post("https://accounts.spotify.com/api/token", body, options).subscribe(
      data => {
        localStorage.setItem('access', data['access_token']);
        this._token = data['access_token'];
        this.refresh_token = data['refresh_token'];
        localStorage.setItem('refresh', data['refresh_token']);
       
      },
      error => {
        console.log(JSON.parse(error))
      },
      () => {
        this._device_id = localStorage.getItem('device');
        this.service.setToken(this._token);
        this.service.setDevice(this._device_id);
        history.pushState({}, null, 'callback');
        this.mydetails();
        this.service.setHome(true);
        this.topplaylist();
      })
 // });
}


@HostListener('window:auth', ['$event'])
aut() {
 this.firsttime();
 console.log("called")
}
  ngOnInit(): void {
    //firsttime
    this.firsttime();
    
}
}
