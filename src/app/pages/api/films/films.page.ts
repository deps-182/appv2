import { Component, OnInit } from '@angular/core';
import { SwapiService } from 'src/app/services/swapi.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
})
export class FilmsPage implements OnInit {
  films: any[] = [];

  constructor(private swapiService: SwapiService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadFilmsDetails();
  }

  async presentLoadingToast() {
    const loadingToast = await this.toastController.create({
      message: 'Cargando datos...',
      duration: 1000,
      position: 'middle',
    });
    await loadingToast.present();
  }

  async loadFilmsDetails() {
    this.presentLoadingToast();

    try {
      const data = await this.swapiService.getFilms().toPromise();
      this.films = data.results;
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // Cierra el Toast después de que la carga haya finalizado
      const loadingToast = await this.toastController.getTop();
      if (loadingToast) {
        await loadingToast.dismiss();
      }
    }
  }

}

