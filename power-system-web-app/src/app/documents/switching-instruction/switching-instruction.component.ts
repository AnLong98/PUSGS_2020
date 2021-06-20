import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayService } from 'app/services/display.service';
import { TabMessagingService } from 'app/services/tab-messaging.service';
import { WorkPlanService } from 'app/services/work-plan.service';
import { Instruction } from 'app/shared/models/instruction.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-switching-instruction',
  templateUrl: './switching-instruction.component.html',
  styleUrls: ['./switching-instruction.component.css']
})
export class SwitchingInstructionComponent implements OnInit {
  @Input()
  instruction:Instruction;
  
  workPlanId:number;
  constructor(private router:Router, public display:DisplayService, public workPlanService:WorkPlanService,private toastr:ToastrService, private route:ActivatedRoute, private tabMessaging:TabMessagingService) { }

  ngOnInit(): void {
    const wpId = this.route.snapshot.paramMap.get('id');
    if(wpId != null && wpId != '')
    {
      this.tabMessaging.showEdit(+wpId);
      this.workPlanId = +wpId;
    }
  }

  approveInstruction()
  {
    console.log(this.instruction.id, this.workPlanId);
    this.workPlanService.approveInstruction(this.instruction.id, this.workPlanId).subscribe(
      data =>{
        this.toastr.success("Instruction executed","", {positionClass: 'toast-bottom-left'});
      },
      error =>{
          this.toastr.error(error.error);
      }
    );
  }

  deleteInstruction()
  {
    this.workPlanService.deleteInstruction(this.instruction.id, this.workPlanId).subscribe(
      data =>{
        console.log(this.workPlanId);
        this.toastr.success("Instruction successfully deleted","", {positionClass: 'toast-bottom-left'});
        this.router.navigate(['work-plan/basic-info', this.workPlanId]);

      },
      error =>{
          this.toastr.error(error.error);
      }
    );

  }
}
