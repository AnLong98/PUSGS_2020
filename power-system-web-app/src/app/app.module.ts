import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { ParticlesComponent } from './particles/particles.component';

import {NgParticlesModule} from "ng-particles";
import {MatIconModule} from '@angular/material/icon';
import { RegistrationComponent } from './registration/registration.component';
import { MainNavbarComponent } from './navigation-bars/main-navbar/main-navbar.component'
import { RegisterLoginNavbarComponent } from './navigation-bars/register-login-navbar/register-login-navbar.component';



@NgModule({
  declarations: [
    AppComponent,
    FrontPageComponent,
    ParticlesComponent,
    RegisterLoginNavbarComponent,
    RegistrationComponent,
    MainNavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgParticlesModule,
    MatIconModule

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
