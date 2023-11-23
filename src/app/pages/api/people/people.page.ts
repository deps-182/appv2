import { Component, OnInit } from '@angular/core';
import { SwapiService } from 'src/app/services/swapi.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  people: any[] = [];

  constructor(private swapiService: SwapiService,
    private toastController: ToastController
    ) { }

  ngOnInit() {
    this.loadPeopleDetails();
  }

 // people-details.page.ts
async presentLoadingToast() {
  const loadingToast = await this.toastController.create({
    message: 'Cargando datos...',
    duration: 1000,
    position: 'middle',
  });
  await loadingToast.present();
}

async loadPeopleDetails() {
  this.presentLoadingToast();

  try {
    const data = await this.swapiService.getPeople().toPromise();
    this.people = data.results;
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
