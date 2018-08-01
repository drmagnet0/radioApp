import { Component, Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Radio } from './interfaces/radio';
import { RadiosService } from './services/radios.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

// key that is used to access the data in local storage
const RADIO_LIST = 'radiosList';

@Injectable()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  radios: Radio;
  player;
  currentTrack;
  search = false;
  filteredItems;

  constructor(
    private radiosServ: RadiosService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public snackBar: MatSnackBar
  ) {
    this.getDataOfRadios();
  }

  saveFavList() {
    this.storage.set(RADIO_LIST, this.radios);
    this.snackBar.open(
      'List saved successfully',
      'OK', {
        duration: 2000,
      });
  }

  getDataOfRadios() {
    if (this.storage.get(RADIO_LIST) !== null) {
      this.radios = this.storage.get(RADIO_LIST);
      for (const i in this.radios) {
        this.radios[i].selected = false;
        this.radios[i].status = 'paused';
      }
    } else {
      this.radiosServ.getRadios().subscribe((data: Radio) => {
        this.radios = data;
      });
    }
    this.assignCopy();
  }

  startSearch() {
    this.search = !this.search;
  }

  assignCopy() {
    this.filteredItems = Object.assign([], this.radios);
  }

  filterItem(value) {
    if (!value) {
      this.assignCopy(); // when nothing has typed
    }
    this.filteredItems = Object.assign([], this.radios).filter(
      item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  selectToPlay(radio) {
    if (this.player === undefined) {
      this.currentTrack = radio;
    } else {
      this.currentTrack.status = 'paused';
      this.currentTrack.selected = false;
      this.currentTrack = radio;
    }
    radio.selected = true;
    this.play(radio);
  }

  play(radio) {
    if (this.player === undefined) {
      this.currentTrack = radio;
      this.player = new Audio();
      this.player.src = radio.stream;
      this.player.load();
      this.player.play();
      radio.status = 'played';
    } else {
      this.currentTrack.status = 'paused';
      this.currentTrack = radio;
      this.player.pause();
      this.player.src = radio.stream;
      this.player.load();
      this.player.play();
      radio.status = 'played';
    }
  }

  pause(radio) {
    radio.status = 'paused';
    this.player.pause();
  }

  mute(radio) {
    if (radio.status === 'muted') {
      radio.status = 'played';
      this.player.play();
    } else if (radio.status === 'played') {
      radio.status = 'muted';
      this.player.pause();
    }
  }

  removeFromFav(radio) {
    if (this.currentTrack !== undefined) {
      if (this.currentTrack.id === radio.id) {
        this.pause(radio);
      }
    }
    radio.isFavourite = false;
  }

  addToFav(radio) {
    radio.isFavourite = true;
  }

}
