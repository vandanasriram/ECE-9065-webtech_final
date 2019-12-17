import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SigninlandingComponent } from './signinlanding/signinlanding.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { UserlandingComponent } from './userlanding/userlanding.component';
import { SmuserlandingComponent } from './smuserlanding/smuserlanding.component';
import { RegisterverComponent } from './registerver/registerver.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: 'user/verification',
    component: RegisterverComponent,
    data: { title: 'User Verification' }
  },
  {
    path: 'signin',
    component: SigninComponent,
    data: { title: 'Sign In' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Register' }
  },
  {
    path: 'registration/signin',
    component: SigninlandingComponent,
    data: { title: 'Sign In' }
  },
  {
    path: 'user/landing',
    component: UserlandingComponent,
    data: { title: 'User Landing' }
  },
  {
    path: 'smuser/landing',
    component: SmuserlandingComponent,
    data: { title: 'Site Manager User Landing' }
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
