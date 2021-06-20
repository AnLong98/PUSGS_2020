import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabMessagingService } from 'app/services/tab-messaging.service';
import { WorkPlanService } from 'app/services/work-plan.service';
import { StateChange } from 'app/shared/models/state-change.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-work-plan-state-changes',
  templateUrl: './work-plan-state-changes.component.html',
  styleUrls: ['./work-plan-state-changes.component.css']
})
export class WorkPlanStateChangesComponent implements OnInit {
  workPlanId:number;
  stateChanges:StateChange[];
  isLoading:boolean;

  constructor(private workPlanService:WorkPlanService, private toastr:ToastrService, private route:ActivatedRoute, private tabMessaging:TabMessagingService) { }

  ngOnInit(): void {
    const wrId = this.route.snapshot.paramMap.get('id');
    if(wrId != null && wrId != '')
    {
      this.loadStateChanges(+wrId);
      this.tabMessaging.showEdit(+wrId);
      this.workPlanId = +wrId;
    }
      
  }

  approve()
  {
    this.workPlanService.approveWorkPlan(this.workPlanId).subscribe(
      data =>{
        this.toastr.success("Work request approved","", {positionClass: 'toast-bottom-left'});
        this.loadStateChanges(this.workPlanId);
      },
      error =>{
        if(error.error instanceof ProgressEvent)
        {
          this.toastr.error("Server unreachable","", {positionClass: 'toast-bottom-left'});
        }else{
          this.toastr.error(error.error);
        }
      }
    )
  }

  

  deny()
  {
    this.workPlanService.denyWorkPlan(this.workPlanId).subscribe(
      data =>{
        this.toastr.success("Work request denied.","", {positionClass: 'toast-bottom-left'});
        this.loadStateChanges(this.workPlanId);
      },
      error =>{
        if(error.error instanceof ProgressEvent)
        {
          this.toastr.error("Server unreachable","", {positionClass: 'toast-bottom-left'});
        }else{
          this.toastr.error(error.error);
        }
      }
    )
  }


  cancel()
  {
    this.workPlanService.cancelWorkPlan(this.workPlanId).subscribe(
      data =>{
        this.toastr.success("Work request cancelled","", {positionClass: 'toast-bottom-left'});
        this.loadStateChanges(this.workPlanId);
      },
      error =>{
        if(error.error instanceof ProgressEvent)
        {
          this.toastr.error("Server unreachable","", {positionClass: 'toast-bottom-left'});
        }else{
          this.toastr.error(error.error);
        }
      }
    )
  }

  loadStateChanges(id:number){
    this.isLoading = true;
    this.workPlanService.getStateChanges(id).subscribe(
      data =>{
        this.stateChanges = data;
        this.isLoading = false;
      },
      error =>{
        if(error.error instanceof ProgressEvent)
        {
          this.loadStateChanges(id);
        }else{
          this.toastr.error(error.error);
          this.isLoading = false;
        }

      }
    )
  }

}
