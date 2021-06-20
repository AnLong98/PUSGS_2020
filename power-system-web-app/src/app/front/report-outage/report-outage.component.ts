import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IncidentService } from 'app/services/incident.service';
import { LocationService } from 'app/services/location.service';
import { NavbarMessagingService } from 'app/services/navbar-messaging.service';
import { ValidationService } from 'app/services/validation.service';
import { Call } from 'app/shared/models/call.model';
import { Location } from 'app/shared/models/location.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-report-outage',
  templateUrl: './report-outage.component.html',
  styleUrls: ['./report-outage.component.css']
})
export class ReportOutageComponent implements OnInit {

  call: Call = new Call();
  hazard: string;
  reason: string;
  locationId:number;
  comment: string;

  reportOutageForm = new FormGroup({
    location: new FormControl('', Validators.required),
    reason: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required),
    hazard: new FormControl('', Validators.required)
  })
  
  locations:Location[] = [];
  constructor(private validation:ValidationService, private toastr:ToastrService, private locationService:LocationService, private navbarService:NavbarMessagingService, private incidentService:IncidentService) { }

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations()
  {
    this.locationService.getAllLocations().subscribe(
      data =>{
        this.locations = data;
      }
    )
  }

  onSubmit()
  {
    if(this.reportOutageForm.valid)
    {
      this.hazard = this.reportOutageForm.controls['hazard'].value;
      this.comment = this.reportOutageForm.controls['comment'].value;
      this.locationId = this.reportOutageForm.controls['location'].value;
      this.reason = this.reportOutageForm.controls['reason'].value;

      console.log(this.call);
      this.incidentService.addReportOutage(this.hazard, this.comment, this.locationId, this.reason).subscribe(
        data => {
          this.toastr.success("Successfully reported outage", "", {positionClass: 'toast-bottom-left'});
        },
        error =>
        {
          this.toastr.error(error.error, "", {positionClass: 'toast-bottom-left'});
        }
      );
    }
  }
}
