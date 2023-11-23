import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { SwapiService } from 'src/app/services/swapi.service';


@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: ['./sidemenu.page.scss'],
})
export class SidemenuPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/sidemenu/inicio', icon: 'home-outline' },
    { title: 'Perfil', url: '/sidemenu/perfil', icon: 'person-outline' },
  ]

  swapi = inject(SwapiService);
  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath: string = '';

  
  vehicles: any[] = [];
  planets: any[] = [];

  PeopleDetails() {
    this.router.navigate(['/people']);
  }

  FilmsDetails() {
    this.router.navigate(['/films']);
  }

  loadVehicles() {
    this.swapi.getVehicles().subscribe(data => {
      this.vehicles = data.results;
    });
  }

  loadPlanets() {
    this.swapi.getPlanets().subscribe(data => {
      this.planets = data.results;
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;

    })
  }


  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }


  //Cerrar sesión
  signOut() {
    this.firebaseSvc.cerrarSesion();
  }

}
