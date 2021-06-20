
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ChooseIncidentDialogComponent } from 'app/documents/dialogs/choose-incident-dialog/choose-incident-dialog.component';
import { ChooseWorkRequestDialogComponent } from 'app/documents/dialogs/choose-work-request-dialog/choose-work-request-dialog.component';
import { TabMessagingService } from 'app/services/tab-messaging.service';
import { UserService } from 'app/services/user.service';
import { ValidationService } from 'app/services/validation.service';
import { WorkPlanService } from 'app/services/work-plan.service';
import { WorkRequestService } from 'app/services/work-request.service';
import { User } from 'app/shared/models/user.model';
import { WorkPlan } from 'app/shared/models/work-plan.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-work-plan-basic-information',
  templateUrl: './work-plan-basic-information.component.html',
  styleUrls: ['./work-plan-basic-information.component.css']
})
export class WorkPlanBasicInformationComponent implements OnInit {
  documentTypes = [
    {display:'Planned work', value:'PLANNED'},
    {display:'Unplanned work', value:'UNPLANNED'},
   ];

user:User = new User();
workPlan:WorkPlan = new WorkPlan();
workPlanForm = new FormGroup({
  documentType: new FormControl('', [Validators.required]),
  startDate: new FormControl('', [Validators.required]),
  endDate: new FormControl('', Validators.required),
  purpose: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  notes: new FormControl('', [Validators.maxLength(100)]),
  companyName: new FormControl('', [Validators.maxLength(50)]),
  phone: new FormControl('', [Validators.maxLength(30)]),
  incident: new FormControl("", Validators.required),
  workRequest: new FormControl("", Validators.required),
  createdOn: new FormControl({value: new Date(), disabled: true}),
  status: new FormControl({value:'DRAFT', disabled:true}),
  createdBy: new FormControl({value:'', disabled:true})
  
}, {validators:this.logicalDates});
isNew = true;
isLoading:boolean = false;
workPlanId:number;

  constructor(public dialog:MatDialog, private validation:ValidationService, private route:ActivatedRoute, private userService:UserService, 
    private workPlanService:WorkPlanService, private toastr:ToastrService, private router:Router, private workRequestService:WorkRequestService,
    private tabMessaging:TabMessagingService) { }

  ngOnInit(): void {
    const wrId = this.route.snapshot.paramMap.get('id');
      if(wrId && wrId != "")
      {
        this.tabMessaging.showEdit(+wrId);
        this.isNew = false;
        this.workPlanId = +wrId;
        this.loadWorkPlan(this.workPlanId);
      }else
      {
        this.user = JSON.parse(localStorage.getItem("user")!);
        this.workPlanForm.controls['createdBy'].setValue(`${this.user.name} ${this.user.lastname}`);
      }
  }
  loadWorkPlan(id:number)
  {
    this.isLoading = true;
      this.workPlanService.getById(id).subscribe(
        data =>{
          this.isLoading = false;
          this.workPlan = data;
          this.populateControls(this.workPlan);
        } ,
        error =>{
          if(error.error instanceof ProgressEvent)
          {
            this.loadWorkPlan(id);
          }else
          {
            this.toastr.error(error.error);
          }
        }
      );
  }

  populateControls(workPlan:WorkPlan)
  {
      this.workPlanForm.controls['documentType'].setValue(workPlan.documentType);
      this.workPlanForm.controls['startDate'].setValue(workPlan.startDate);
      this.workPlanForm.controls['endDate'].setValue(workPlan.endDate);
      this.workPlanForm.controls['purpose'].setValue(workPlan.purpose);
      this.workPlanForm.controls['notes'].setValue(workPlan.notes);
      this.workPlanForm.controls['companyName'].setValue(workPlan.companyName);
      this.workPlanForm.controls['phone'].setValue(workPlan.phone);
      this.workPlanForm.controls['incident'].setValue(workPlan.incidentID);
      this.workPlanForm.controls['workRequest'].setValue(workPlan.workRequestID);
      this.workPlanForm.controls['createdOn'].setValue(workPlan.createdOn);
      this.workPlanForm.controls['status'].setValue(workPlan.documentStatus);
      this.loadUserData(workPlan.userID);
  }

  populateModelFromFields()
  {
      this.workPlan.documentType = this.workPlanForm.controls['documentType'].value;
      this.workPlan.startDate = new Date(this.workPlanForm.controls['startDate'].value);
      this.workPlan.endDate = new Date(this.workPlanForm.controls['endDate'].value);
      this.workPlan.purpose = this.workPlanForm.controls['purpose'].value;
      this.workPlan.notes = this.workPlanForm.controls['notes'].value;
      this.workPlan.companyName = this.workPlanForm.controls['companyName'].value;
      this.workPlan.phone = this.workPlanForm.controls['phone'].value;
      this.workPlan.workRequestID = this.workPlanForm.controls['workRequest'].value;
      this.workPlan.createdOn = new Date(this.workPlanForm.controls['createdOn'].value);
      this.workPlan.documentStatus = this.workPlanForm.controls['status'].value; 
      this.workPlan.incidentID = this.workPlanForm.controls['incident'].value; 
      this.workPlan.userID = this.user.id;
  }

  loadUserData(id:number)
  {
    this.userService.getById(id).subscribe(
      data =>{
        this.workPlanForm.controls['createdBy'].setValue(`${data.name} ${data.lastname}`);
        this.user  = data;
      },
      error =>{
        if(error.error instanceof ProgressEvent)
        {
          this.loadUserData(id);
        }else
        {
          this.toastr.error(error.error);
        }
      }
    )
  }

  onChooseWorkRequest()
  {
    const dialogRef = this.dialog.open(ChooseWorkRequestDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        console.log(+result.incidentID);
        this.workPlanForm.controls['workRequest'].setValue(+result.id);
        this.workPlanForm.controls['incident'].patchValue(+result.incidentID);
      }
    });

  }

  onSave()
  {
    if(this.workPlanForm.valid)
    {
        this.populateModelFromFields();
        this.isLoading = true;
        if(this.isNew)
        {
          this.workPlanService.createWorkPlan(this.workPlan).subscribe(
            data =>{
              this.toastr.success("Work plan created successfully","", {positionClass: 'toast-bottom-left'});
              this.router.navigate(['work-plan/basic-info', data.id])
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
          this.workPlanService.updateWorkPlan(this.workPlan).subscribe(
            data =>{
              this.toastr.success("Work request updated successfully","", {positionClass: 'toast-bottom-left'});
              this.workPlan = data;
              this.isLoading = false;
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
          )
        }

    }else
    {
      this.validation.validateAllFields(this.workPlanForm);
    }

  }

  logicalDates(c: AbstractControl): {[key: string]: any} |null {
    let startDate = c.get(['startDate']);
    let endDate = c.get(['endDate']);

    if(startDate?.value == "" || new Date(startDate?.value) < new Date())
    {
      c.get(['startDate'])!.setErrors({invalidDates:true});
    } 
    if(endDate?.value == "")
    {
      c.get(['endDate'])!.setErrors({invalidDates:true});
      return { invalidDates: true };
    }
      

    if (new Date(startDate!.value) >  new Date(endDate!.value)) {
      c.get(['startDate'])!.setErrors({invalidDates:true});
      c.get(['endDate'])!.setErrors({invalidDates:true});
      return { invalidDates: true };
    }else
    {
      c.get(['startDate'])!.setErrors(null);
      c.get(['endDate'])!.setErrors(null);
      return null;
    }

  }

}

