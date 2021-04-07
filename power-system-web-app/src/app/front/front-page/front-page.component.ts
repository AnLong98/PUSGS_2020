
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarMessagingService } from 'app/services/navbar-messaging.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit, OnDestroy {
  navbarMessagingSubscription!:Subscription;
  showLogin:boolean = false;
  showRegister:boolean = false;
  showReportOutage:boolean = false;

  constructor(private navbarMessaging:NavbarMessagingService) { }

  ngOnDestroy(): void {
    if(this.navbarMessagingSubscription)
      this.navbarMessagingSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.navbarMessagingSubscription = this.navbarMessaging.getMessage().subscribe( message => {
      if(message == "login")
      {
          this.showLoginForm();
      }else{
        this.showRegistrationForm();
      }

    });
  }

  showLoginForm()
  { 
    this.showRegister = false;
    this.showLogin = true;
    this.showReportOutage = false;
  }

  showRegistrationForm()
  { 
    this.showLogin = false; 
    this.showRegister = true;
    this.showReportOutage = false;
  }

  activateReportOutage()
  {
    this.showLogin = false; 
    this.showRegister = false;
    this.showReportOutage = true;
  }

}
