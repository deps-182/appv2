import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dispositivo } from 'src/app/models/dispositivo.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss'],
})
export class AgregarComponent  implements OnInit {

  @Input() dispositivo: Dispositivo;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]), 
    price: new FormControl(null, [Validators.required, Validators.minLength(0)]), 
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]), 
    name: new FormControl('', [Validators.required, Validators.minLength(4)]), 
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  //
  user = {} as User;
  //
  ngOnInit() {
    this.user= this.utilsSvc.getFromLocalStorage('user');
    if (this.dispositivo) this.form.setValue(this.dispositivo);
  }

  //Seleccionar foto
  async takeImage(){
    const DataUrl = (await this.utilsSvc.takePicture('Imagen del dispositivo')).dataUrl;
    this.form.controls.image.setValue(DataUrl);
  }

  submit(){
    if (this.form.valid){
      if(this.dispositivo) this.editarDispositivo();
      else this.crearDispositivo();
    }
  }

  //Convertir valores de string a number
  setNumberInputs(){

    let {soldUnits, price} = this.form.controls;

    if (soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if (price.value) price.setValue(parseFloat(price.value));

  }



  //crear
  async crearDispositivo() {

      let path = `users/${this.user.uid}/products`
      const cargando = await this.utilsSvc.cargando();
      await cargando.present();
      
      //subir imagen y obtener url
      let dataUrl = this.form.value.image;
      let imagepath = `${this.user.uid}/${Date.now()}`;
      let imageUrl= await this.firebaseSvc.subirImagen(imagepath,dataUrl)
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id

      this.firebaseSvc.agDispositivo(path, this.form.value).then(async res => {
       
        this.utilsSvc.dismissModal({success: true});

        this.utilsSvc.presentToast({
          message: 'Producto creado exitosamente',
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

//editar
  async editarDispositivo() {

      let path = `users/${this.user.uid}/products/${this.dispositivo.id}`
      const cargando = await this.utilsSvc.cargando();
      await cargando.present();
      
      //si cambio la imagen, subir una nueva y obtener la url
      if(this.form.value.image !== this.dispositivo.image){
        let dataUrl = this.form.value.image;
        let imagepath = await this.firebaseSvc.getFilePath(this.dispositivo.image);
        let imageUrl= await this.firebaseSvc.subirImagen(imagepath,dataUrl)
        this.form.controls.image.setValue(imageUrl);
      }
      

      delete this.form.value.id

      this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
       
        this.utilsSvc.dismissModal({success: true});

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