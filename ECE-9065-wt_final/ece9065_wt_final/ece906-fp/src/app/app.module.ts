import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SigninlandingComponent } from './signinlanding/signinlanding.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { UserlandingComponent } from './userlanding/userlanding.component';
import { SmuserlandingComponent } from './smuserlanding/smuserlanding.component';
import { ShowErrorsComponent } from './register/show-errors/show-errors.component';
import { RegisterverComponent } from './registerver/registerver.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninlandingComponent,
    SigninComponent,
    RegisterComponent,
    UserlandingComponent,
    SmuserlandingComponent,
    ShowErrorsComponent,
    RegisterverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    Ng2SearchPipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
