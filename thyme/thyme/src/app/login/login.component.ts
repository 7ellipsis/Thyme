import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerServiceService } from './../player-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  client_id = 'c950c38b7fd143859e60579877d1ab8b';
  client_secret = 'a0eecd14b2f64bd8b3c1e8ff33c90e0a';
   redirect_uri = 'http://localhost:4200/callback';
   scope = "user-read-private user-follow-read,user-follow-modify user-library-modify user-read-playback-state user-library-read playlist-modify user-read-email user-top-read playlist-read-private user-modify-playback-state streaming playlist-modify-private user-read-recently-played";
  constructor(private http: HttpClient,private service: PlayerServiceService) { }
  
  login() {
      const headers = new HttpHeaders()
          .set('Content-Type', 'application/json')
   this.http.get('http://localhost:3000/auth',{headers:headers}).subscribe(e=>{
     window.location.replace(e.toString());
  })
  // window.location.replace('https://accounts.spotify.com/authorize' +
  // '?response_type=code' +
  // '&client_id=' + this.client_id +
  // '&scope=' + encodeURIComponent(this.scope) +
  // '&redirect_uri=' + encodeURIComponent(this.redirect_uri));
}
  ngOnInit(): void {
  }

}
