import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPlaylistComponent } from './show-playlist.component';

describe('ShowPlaylistComponent', () => {
  let component: ShowPlaylistComponent;
  let fixture: ComponentFixture<ShowPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
