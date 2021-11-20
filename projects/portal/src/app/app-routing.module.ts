import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../libs/core/authentication/authentication.guard';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('../../src/libs/pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('../libs/pages/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
