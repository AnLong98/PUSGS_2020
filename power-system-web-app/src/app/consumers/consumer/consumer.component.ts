import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerService } from 'app/services/consumer.service';
import { LocationService } from 'app/services/location.service';
import { TabMessagingService } from 'app/services/tab-messaging.service';
import { ValidationService } from 'app/services/validation.service';
import { Consumer } from 'app/shared/models/consumer.model';
import { Location } from 'app/shared/models/location.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.css']
})
export class ConsumerComponent implements OnInit {

  accountTypes: any[] =
  [ 
    {display:'RESIDENTAL', value: 'RESIDENTAL'},
    {display:'NONRESIDENTAL', value: 'NONRESIDENTAL'}
  ];

  consumer:Consumer = new Consumer();
  locations:Location[] = []; 
  name:string;
  lastname:string;
  locationID:number;
  accountID:string;
  accountType:string;
  phone:string;

  consumerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    locationId: new FormControl('', Validators.required),
    accountId: new FormControl('', Validators.required),
    accountType: new FormControl('', Validators.required),
  })

  isNew = true;
  isLoading:boolean = false;
  consumerId:number;
  constructor(private validation:ValidationService, private route:ActivatedRoute, private consumerService:ConsumerService, 
    private locationService:LocationService, private toastr:ToastrService, private router:Router, private tabMessaging:TabMessagingService) { }

  ngOnInit(): void {
    this.loadLocations();
    const conId = this.route.snapshot.paramMap.get('id');
      if(conId && conId != "")
      {
        this.tabMessaging.showEdit(+conId);
        this.isNew = false;
        this.consumerId = +conId;
        this.loadConsumer(this.consumerId);
      }
  }

  getAddressFromLocation(location: Location) {
        
    return  `${location.street} ${location.number}, ${location.city}, ${location.zip}`

  }

  loadLocations()
  {
    this.locationService.getAllLocations().subscribe(
      data =>{
        this.locations = data;
      }
    )
  }

  populateControls()
  {
    this.consumerForm.controls['name'].setValue(this.name);
    this.consumerForm.controls['lastname'].setValue(this.lastname);
    this.consumerForm.controls['locationId'].setValue(this.locationID.toString());
    this.consumerForm.controls['accountId'].setValue(this.accountID);
    this.consumerForm.controls['accountType'].setValue(this.accountType);
    this.consumerForm.controls['phone'].setValue(this.phone);
  }

  populateModelFromFields()
  {
    this.name = this.consumerForm.controls['name'].value;
    this.lastname = this.consumerForm.controls['lastname'].value;
    this.locationID = this.consumerForm.controls['locationId'].value;
    this.accountID = this.consumerForm.controls['accountId'].value;
    this.accountType = this.consumerForm.controls['accountType'].value;
    this.phone = this.consumerForm.controls['phone'].value;
  }

  loadConsumer(id:number)
  {
    this.isLoading = true;
    this.consumerService.getById(id).subscribe(
      data => {
        this.consumer = data;
        this.isLoading = false;
        this.name = data.name
        this.lastname = data.lastname
        this.locationID = data.locationID
        this.accountID = data.accountID
        this.accountType = data.accountType
        this.phone = data.phone
        this.populateControls();
      },
      error =>
      {
        if(error.error instanceof ProgressEvent)
        {
          this.loadConsumer(id);
        }
        else
        {
          this.toastr.error(error.error);
        }
      }
    );
  }

  onSave()
  {
    if(this.consumerForm.valid)
    {
      this.populateModelFromFields();
      console.log("LOkacija:" + this.locationID);
      this.consumer.name = this.name;
      this.consumer.lastname = this.lastname;
      this.consumer.locationID = +this.locationID;
      this.consumer.accountID = this.accountID;
      this.consumer.accountType = this.accountType;
      this.consumer.phone = this.phone;
      console.log(this.phone)
      this.isLoading = true;
      if(this.isNew)
      {
        this.consumerService.createConsumer(this.name, this.lastname, this.locationID, this.accountID, this.accountType, this.phone).subscribe(
          data => {this.toastr.success("Consumer created successfully","", {positionClass: 'toast-bottom-left'});
          this.router.navigate(['consumers']);
        },
        error =>{
         this.isLoading = false;
          if(error.error instanceof ProgressEvent)
            {
              this.toastr.error("Server is unreachable");
            }else
            {
              this.toastr.error(error.error);
            }
          
        }
      )
    }else
    {
      console.log(this.consumer);
      this.consumerService.updateConsumer(this.consumer).subscribe(
        data =>{
          this.toastr.success("Consumer updated successfully","", {positionClass: 'toast-bottom-left'});
          this.consumer = data;
          this.isLoading = false;
          this.router.navigate(['consumers']);
        },
        error =>{
         this.isLoading = false;
          if(error.error instanceof ProgressEvent)
            {
              this.toastr.error("Server is unreachable","", {positionClass: 'toast-bottom-left'});
            }else
            {
              this.toastr.error(error.error);
            }
          
        }
      );
    }

    }     
  }
}

