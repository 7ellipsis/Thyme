import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit  {
  constructor(private http: HttpClient) { }
  title = 'thyme';
  artist() {
    console.log("ewr");
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json')
   this.http.get('http://localhost:3000/auth',{headers:headers}).subscribe(e=>{
     window.location.replace(e.toString());
  })
  }
  ngOnInit() {
}
}