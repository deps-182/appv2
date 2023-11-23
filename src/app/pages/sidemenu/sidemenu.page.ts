import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';



@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: ['./sidemenu.page.scss'],
})
export class SidemenuPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/sidemenu/inicio', icon: 'home-outline' },
    { title: 'Perfil', url: '/sidemenu/perfil', icon: 'person-outline' },
    { title: 'Usuarios', url: '/sidemenu/usuarios', icon: 'person-outline' },
  ]

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath: string = '';


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
