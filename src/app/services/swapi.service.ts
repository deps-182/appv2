import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private apiUrl = 'https://swapi.dev/api';

  constructor(private http: HttpClient) { }

  getPeople(): Observable<any> {
    return this.http.get(`${this.apiUrl}/people`);
  }

  getFilms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/films`);
  }

  getVehicles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicles`);
  }

  getPlanets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/planets`);
  }
}
