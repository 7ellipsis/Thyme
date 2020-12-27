import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerServiceService } from './../player-service.service';
@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.css']
})
export class PodcastComponent implements OnInit {
  headers() {
    return new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.service._token,
    })
  }
  constructor(private http: HttpClient, private service: PlayerServiceService) { }
  podcast = [];
  nextpodcast = '';
  podimage = '';
  podname = '';
  podartist = '';
  podURI = '';
  podfollowed: boolean = false;
  podrelease = '';
  podesc = '';
  poditems = 0;
  populate() {
    this.podURI = this.service.podURI;
    this.podcast = [];
    this.podcast = this.service.podcast;
    this.podname = this.service.podname;
    this.podartist = this.service.podartist;
    this.podimage = this.service.podimage;
    this.poditems = this.podcast.length;
    this.podfollowed = this.service.podfollowed;
    this.nextpodcast = this.service.nextpodcast;
  }

  nextpod() {
    this.service.nextpod();
  }
  count = 0;
  sort(num) {

    if (num == 0) {
      this.count++;
      this.podcast.reverse();
    } else {
      if (this.count > 0)
        this.podcast.reverse()
    }
  }

  like(uri) {

    var x = document.querySelector(".heart");
    if (x.classList.contains("heart-blast"))
      x.classList.remove("heart-blast");
    else
      x.classList.add("heart-blast");
    this.service.podcastlike(uri);
    setTimeout(() => this.podfollowed = true, 1000)
    document.getElementById("followe").style.display = 'block';
  
  }
  dislike(uri) {

    var x = document.querySelector(".heart");
    if (x.classList.contains("heart-blast"))
      x.classList.remove("heart-blast");
    else
      x.classList.add("heart-blast");
    this.service.podcastdislike(uri);
    setTimeout(() => this.podfollowed = false, 1000)
    document.getElementById("unfollowe").style.display = 'block';
   

  }
  play(uri) {
    this.service.play(uri, true);
  }
  ngOnInit(): void {
    this.populate();
    document.getElementById("followe").style.display = 'none';
    document.getElementById("unfollowe").style.display = 'none';
  }

}
