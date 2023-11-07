import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dispositivo } from 'src/app/models/dispositivo.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  //Tomar foto
  async takeImage(){

    let user = this.user();
    let path = `users/${user.uid}`
    
    const cargando = await this.utilsSvc.cargando();
    await cargando.present();
    
    const dataUrl = (await this.utilsSvc.takePicture('Imagen de perfil')).dataUrl;


    let imagepath = `${user.uid}/perfil`;
    user.image = await this.firebaseSvc.subirImagen(imagepath,dataUrl);

    this.firebaseSvc.updateDocument(path, { image: user.image}).then(async res => {
       
      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen actualizada exitosamente',
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
