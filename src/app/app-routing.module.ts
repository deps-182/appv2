import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule), canActivate:[NoAuthGuard]
  },
  {
    path: 'sidemenu',
    loadChildren: () => import('./pages/sidemenu/sidemenu.module').then( m => m.SidemenuPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'apiStarWars',
    loadChildren: () => import('./app.module').then( m => m.AppModule)
  },
  {
    path: 'people',
    loadChildren: () => import('./pages/api/people/people.module').then( m => m.PeoplePageModule)
  },  {
    path: 'films',
    loadChildren: () => import('./pages/api/films/films.module').then( m => m.FilmsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
