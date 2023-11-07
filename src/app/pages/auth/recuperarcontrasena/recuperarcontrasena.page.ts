import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-recuperarcontrasena',
  templateUrl: './recuperarcontrasena.page.html',
  styleUrls: ['./recuperarcontrasena.page.scss'],
})
export class RecuperarcontrasenaPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const cargando = await this.utilsSvc.cargando();
      await cargando.present();

      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res => {
        
        this.utilsSvc.presentToast({
          message: 'Correo enviado con exito',
          duration: 2500,
          color: 'dark',
          position: 'middle',
          icon: 'mail-outline'
        });

        this.utilsSvc.routerLink('/auth');
        this.form.reset();

      }).catch(error =>{
        console.log(error);

        this.utilsSvc.presentToast({
          message: 'Contraseña incorrecta',
          duration: 2500,
          color: 'dark',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() =>{
        cargando.dismiss();
      })
    }
  }


}
