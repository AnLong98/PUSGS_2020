import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabMessagingService } from 'app/services/tab-messaging.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-work-plan',
  templateUrl: './work-plan.component.html',
  styleUrls: ['./work-plan.component.css']
})
export class WorkPlanComponent implements OnInit, OnDestroy {
  isNew:boolean = true;
  tabMessagingSubscription!:Subscription
  navLinks = [
    { path: 'basic-info', label: 'Basic information', isDisabled: false },
    { path: 'equipment', label: 'Equipment', isDisabled: this.isNew },
    { path: 'state-changes', label: 'History of state changes', isDisabled: this.isNew },
    { path: 'switching-instructions', label: 'Switching instructions', isDisabled: this.isNew },
    { path: 'multimedia', label: 'Multimedia attachments', isDisabled: this.isNew },

  ];

  constructor(private tabMessaging:TabMessagingService) { }

  ngOnDestroy(): void {
    this.tabMessagingSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.tabMessagingSubscription = this.tabMessaging.getMessage().subscribe( message => {
      if(this.isNew)
        this.showEdit(message);
    });
  }

  showEdit(id:any)
  {
    this.isNew = false;
    this.navLinks.forEach( f => {
      f.path = f.path.concat(`/${id}`);
      f.isDisabled = false;
  });
  }

}
