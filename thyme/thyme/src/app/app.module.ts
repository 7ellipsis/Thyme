import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CallbackComponent } from './callback/callback.component';
import { HomeComponent } from './home/home.component';
import { PlayerComponent } from './player/player.component';
import { SearchComponent } from './search/search.component';
import { LibraryComponent } from './library/library.component';
import { ShowPlaylistComponent } from './show-playlist/show-playlist.component';
import { ShowAlbumComponent } from './show-album/show-album.component';
import { ShowArtistComponent } from './show-artist/show-artist.component';
import {PlayerServiceService} from './../../src/app/player-service.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PodcastComponent } from './podcast/podcast.component';
import { AccountComponent } from './account/account.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component'
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    HomeComponent,
    PlayerComponent,
    SearchComponent,
    LibraryComponent,
    ShowPlaylistComponent,
    ShowAlbumComponent,
    ShowArtistComponent,
    PodcastComponent,
    AccountComponent,
    AboutComponent,
    LoginComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule 
  ],
  providers: [PlayerServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
