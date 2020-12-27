import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerServiceService } from './../player-service.service';
@Component({
  selector: 'app-show-album',
  templateUrl: './show-album.component.html',
  styleUrls: ['./show-album.component.css']
})
export class ShowAlbumComponent implements OnInit {
  searchText;
  constructor(private http: HttpClient, private service: PlayerServiceService) { }
  playcount=0;
  albumplay(uri)
  {
    this.playcount++;
    if(this.playcount%2==1)
    {
      this.play(uri);
    }
    else
    {
      this.service.pause();
    }
  }
  addtoq(uri)
  {
    this.service.addtoq(uri);
  }
  album=[];
albumName='';
albumImage='';
albumArtist='';
albumTime='';
albumURI='';
albumFollowed:boolean;
nextalbumuri='';
  populate()
  {
    this.albumURI=this.service.albumURI;
    this.album=[];
    this.album=this.service.album[0]['items'];
    this.albumName=this.service.albumName;
    this.albumArtist=this.service.albumArtist;
    this.albumImage=this.service.albumImage['url'];
    this.albumTime=this.service.albumTime;
    this.albumFollowed=this.service.albumFollowed;
    for(let i=0;i<this.album.length;i++)
    {
      var time=Math.floor(+this.album[i]['duration_ms']/1000);
      let min=Math.floor(time/60);
      let sec:any=time-(min*60);
      if(Math.floor(sec/10)==0)
      sec="0"+sec;
       this.album[i]['duration_ms']=min+":"+sec;
    }
  }

  nextalbumsongs()
  {
this.service.nextalbumsongs();
  }

  like(uri,ele)
  {
    if(uri.includes("album")){
      var x =document.querySelector(".heart");
      if(x.classList.contains("heart-blast"))
      x.classList.remove("heart-blast");
      else
      x.classList.add("heart-blast");
      this.service.albumlike(uri.split(':')[2]);
      setTimeout(()=>this.albumFollowed=true,1000)
    }
    else
    {
      let k = document.getElementById(ele.getAttribute('id'));
      if (k.classList.contains("heart-blasta"))
        k.classList.remove("heart-blasta");
      else
        k.classList.add("heart-blasta");
    this.service.like(uri.split(':')[2]);  
    setTimeout(() => this.album[ele.getAttribute('id').split('+')[1]]['liked'] = true, 1000)
    }
    document.getElementById("follow1").style.display = 'block';
    
  }
  dislike(uri,ele)
  {
    if(uri.includes("album")){
      var x =document.querySelector(".heart");
      if(x.classList.contains("heart-blast"))
      x.classList.remove("heart-blast");
      else
      x.classList.add("heart-blast");
      this.service.albumdislike(uri.split(':')[2]);
      setTimeout(()=>this.albumFollowed=false,1000)
      
    }
     else{
      let k = document.getElementById(ele.getAttribute('id'));
      if (k.classList.contains("heart-blasta"))
        k.classList.remove("heart-blasta");
      else
        k.classList.add("heart-blasta");
        this.service.dislikesong(uri.split(':')[2]);
        setTimeout(() => this.album[ele.getAttribute('id').split('+')[1]]['liked'] = false, 1000)
     }
     document.getElementById("unfollow1").style.display = 'block';
    
 
  }
  play(uri) {
    this.service.play(uri, true);
  }
  ngOnInit(): void {
    this.populate(); 
    document.getElementById("follow1").style.display = 'none';
    document.getElementById("unfollow1").style.display = 'none';
  }

}
