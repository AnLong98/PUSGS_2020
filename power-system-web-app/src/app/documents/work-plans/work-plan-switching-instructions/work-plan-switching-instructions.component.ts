
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NewSwitchingInstructionDialogComponent } from 'app/documents/dialogs/new-switching-instruction-dialog/new-switching-instruction-dialog.component';
import { TabMessagingService } from 'app/services/tab-messaging.service';
import { WorkPlanService } from 'app/services/work-plan.service';
import { Instruction } from 'app/shared/models/instruction.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-work-plan-switching-instructions',
  templateUrl: './work-plan-switching-instructions.component.html',
  styleUrls: ['./work-plan-switching-instructions.component.css']
})
export class WorkPlanSwitchingInstructionsComponent implements OnInit {

  workPlanId:number;
  instructions:Instruction[];
  isLoading:boolean;

  constructor(private router:Router, public dialog:MatDialog, private workPlanService:WorkPlanService, private toastr:ToastrService, private route:ActivatedRoute, private tabMessaging:TabMessagingService) { }

  ngOnInit(): void {
    const wpId = this.route.snapshot.paramMap.get('id');
    if(wpId != null && wpId != '')
    {
      this.loadInstructions(+wpId);
      this.tabMessaging.showEdit(+wpId);
      this.workPlanId = +wpId;
    }
  }

  loadInstructions(id:number){
    
    this.isLoading = true;
    this.workPlanService.getInstructions(id).subscribe(
      data =>{
        this.instructions = data;
        this.isLoading = false;
      },
      error =>{
          this.toastr.error(error.error);
          this.isLoading = false;
      }
    );
  }

  onAddNew()
  {
    const dialogRef = this.dialog.open(NewSwitchingInstructionDialogComponent,
      {
        data: {
          wpId: this.workPlanId
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed and choosen id is ${result}`);
      this.loadInstructions(this.workPlanId);
    });
  }

  deleteAll()
  {
    this.workPlanService.deleteInstructions(this.workPlanId).subscribe(
      data => {
        this.toastr.success("Successfully deleted all instructions","", {positionClass: 'toast-bottom-left'});
        this.loadInstructions(this.workPlanId);
      },
      error => {
        this.toastr.error(error.error);
      }
    );
  }

}
