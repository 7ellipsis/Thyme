import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerServiceService } from './../player-service.service';
@Component({
  selector: 'app-show-artist',
  templateUrl: './show-artist.component.html',
  styleUrls: ['./show-artist.component.css']
})
export class ShowArtistComponent implements OnInit {

  constructor(private http: HttpClient, private service: PlayerServiceService) { }
  artistName = '';
  artistFollowers = '';
  artistTracks = [];
  artistAlbum = [];
  artistSingles = [];
  artistAppear = [];
  artistgenre = '';
  artistImage = '';
  artistId='';
  artistFollowed:boolean;
  likecount=0;
  populate()
{
  this.artistFollowed=this.service.artistFollowed;
  this.artistTracks = [];
  this.artistAlbum = [];
  this.artistSingles = [];
  this.artistAppear = [];
this.artistName=this.service.artistName;
this.artistFollowers=this.service.artistFollowers;
this.artistTracks=this.service.artistTracks;
this.artistAlbum=this.service.artistAlbum;
this.artistSingles=this.service.artistSingles;
this.artistAppear=this.service.artistAppear;
this.artistgenre=this.service.artistgenre;
this.artistImage=this.service.artistImage;
this.artistId=this.service.artistid;
console.log(this.artistFollowed);
}
play(uri) {
  this.service.play(uri, true);
}

albums(uri){
  this.service.setAll();
  this.service.getAlbums(uri);
}

like(uri)
{
  var x =document.querySelector(".heart");
  if(x.classList.contains("heart-blast"))
  x.classList.remove("heart-blast");
  else
  x.classList.add("heart-blast");
this.service.followuser(uri);
setTimeout(()=>this.artistFollowed=true,1000)
document.getElementById("follow2").style.display = 'block';

}
dislike(uri)
{
  var x =document.querySelector(".heart");
      if(x.classList.contains("heart-blast"))
      x.classList.remove("heart-blast");
      else
      x.classList.add("heart-blast");
this.service.unfollowuser(uri);
setTimeout(()=>this.artistFollowed=false,1000)
document.getElementById("unfollow2").style.display = 'block';


}
  ngOnInit(): void {
  this.populate(); 
  document.getElementById("follow2").style.display = 'none';
  document.getElementById("unfollow2").style.display = 'none';
  }

}
