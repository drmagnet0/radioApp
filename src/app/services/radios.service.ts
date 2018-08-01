import { Injectable } from '@angular/core';
import { Radio } from '../interfaces/radio';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RadiosService {

  dataUrl: string = "assets/data.json";

  constructor(
    private http: HttpClient
  ) { }

  getRadios(){
    return this.http.get<Radio>(this.dataUrl);
  }

}
