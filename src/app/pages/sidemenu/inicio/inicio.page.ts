import { Component, OnInit, inject } from '@angular/core';
import { Dispositivo } from 'src/app/models/dispositivo.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AgregarComponent } from 'src/app/shared/components/agregar/agregar.component';
import { orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  dispositivos: Dispositivo[] = [];

  loading: boolean = false;

  ngOnInit() {
  }

//obtener del usuario
  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

//ejecuta una funcion cada vez que entra a la pagina el usuario
ionViewWillEnter() {
  this.obtenerDispositivos();
}

  doRefresh(event) {
    setTimeout(() => {
      this.obtenerDispositivos();
      event.target.complete();
    }, 1000);
  }

//obtener dispositivo
  obtenerDispositivos(){
    let path = `users/${this.user().uid}/products`;

    this.loading = true;

    let query = [
      orderBy('soldUnits', 'desc')
    ]
      
    

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.dispositivos = res;

        this.loading = false;

        sub.unsubscribe();
      }
    })
  }

  //agregar
  async agregarActualizar(dispositivo?: Dispositivo){
    let success = await this.utilsSvc.presentModal({
      component: AgregarComponent,
      cssClass: 'add-update-modal',
      componentProps:{dispositivo}
    })
    if(success) this.obtenerDispositivos();
  }

  //Confirmar la eliminacion
  async confirmarEliminar(dispositivo: Dispositivo) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este producto ;c?',
      buttons: [
        {
          text: 'Cancelar',
          
        }, {
          text: 'Eliminar',
          handler: () => {
            this.eliminarDispositivo(dispositivo)
          }
        }
      ]
    });
  }


  //eliminar
  async eliminarDispositivo(dispositivo: Dispositivo) {

    let path = `users/${this.user().uid}/products/${dispositivo.id}`
    const cargando = await this.utilsSvc.cargando();
    await cargando.present();
    
    let imagepath = await this.firebaseSvc.getFilePath(dispositivo.image);
    await this.firebaseSvc.eliminarDispositivos(imagepath);

    this.firebaseSvc.eliminarDispositivos(path).then(async res => {

      this.dispositivos = this.dispositivos.filter(d => d.id !== dispositivo.id);
     
      this.utilsSvc.presentToast({
        message: 'Dispositivo actualizado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: 'Error al subir la imagen',
        duration: 2500,
        color: 'dark',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      cargando.dismiss();
    })
  }
}