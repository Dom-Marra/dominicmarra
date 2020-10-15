import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { LoginComponent } from '../app/login/login.component';
import { ConsoleComponent } from '../app/console/console.component';
import { AddprojectComponent } from '../app/console/addproject/addproject.component';
import { DeleteprojectComponent } from '../app/console/deleteproject/deleteproject.component';
import { UpdateprojectComponent } from '../app/console/updateproject/updateproject.component';

import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToConsole = () => redirectLoggedInTo(['console']);

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'disabled',
  anchorScrolling: 'disabled',
  onSameUrlNavigation: 'reload'
};


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToConsole)},
  { path: 'console', component: ConsoleComponent, ...canActivate(redirectUnauthorizedToLogin),
    children: [
      { path: '', redirectTo: 'addproject', pathMatch: 'full'},
      { path: 'addproject', component: AddprojectComponent },
      { path: 'updateproject', component: UpdateprojectComponent },
      { path: 'deleteproject', component: DeleteprojectComponent }

    ] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
