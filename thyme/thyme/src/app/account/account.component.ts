import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerServiceService } from './../player-service.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  headers() {
    return new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.service._token,
    })
  }
  constructor(private service: PlayerServiceService, private http: HttpClient, private elementRef: ElementRef) { }
  username = '';
  userid='';
  email = '';
  userImage = '';
  dob = '';
  plan = '';
  followers='';
  country='';
  details() {
    let options = { headers: this.headers() };
    this.http.get("https://api.spotify.com/v1/me", options).subscribe(e => {
     this.username=e['display_name'];
 this.userImage=e['images'][0]['url'];
 this.email=e['email'];
 this.followers=e['followers']['total'];
 this.country=e['country'];
 this.plan=e['product'];
    })
  }
  ngOnInit(): void {
    this.details();
  }

}
