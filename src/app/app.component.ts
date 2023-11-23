import { Component } from '@angular/core';
import { SwapiService } from './services/swapi.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  people: any[] = [];

  constructor(private swapiService: SwapiService) { }

  ngOnInit(): void {
    this.swapiService.getPeople().subscribe(data => {
      this.people = data.results;
    });
  
    this.swapiService.getPeople().subscribe(data => {
      this.people = data.results;
    });
  }

  films: any[] = [];
  vehicles: any[] = [];
  planets: any[] = [];

  loadFilms() {
    this.swapiService.getFilms().subscribe(data => {
      this.films = data.results;
    });
  }

  loadVehicles() {
    this.swapiService.getVehicles().subscribe(data => {
      this.vehicles = data.results;
    });
  }

  loadPlanets() {
    this.swapiService.getPlanets().subscribe(data => {
      this.planets = data.results;
    });
  }
}
