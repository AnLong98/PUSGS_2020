import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { WorkPlanService } from 'app/services/work-plan.service';
import { Device } from 'app/shared/models/device.model';
import { Instruction } from 'app/shared/models/instruction.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-new-switching-instruction-dialog',
  templateUrl: './new-switching-instruction-dialog.component.html',
  styleUrls: ['./new-switching-instruction-dialog.component.css']
})
export class NewSwitchingInstructionDialogComponent implements OnInit  {

  displayedColumns: string[] = ['action', 'id', 'name', 'deviceType', 'locationId'];
  dataSource: MatTableDataSource<Device>;
  selectedDevice:number;
  devices: Device[] = [];
  instruction:Instruction = new Instruction();
  description = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<NewSwitchingInstructionDialogComponent>, private workPlanService:WorkPlanService, private toastr:ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) {
    
   }

   loadDevices()
   {
     this.workPlanService.getWorkPlanDevices(this.data.wpId).subscribe(
       data =>{
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       },
       error =>{
        this.toastr.error(error.error);
        this.dialogRef.close();
       }
     )
   }
  
   setValue(id:number)
   {
     this.selectedDevice = id
     console.log(this.selectedDevice);
   }
   ngOnInit(): void {
     this.loadDevices();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void{
    this.instruction.description = this.description;
    this.instruction.deviceId = this.selectedDevice;
    this.instruction.isExecuted = false;
    this.instruction.workPlanId = this.data.wpId;
    this.workPlanService.addInstruction(this.instruction).subscribe(
      data =>
      {
        this.toastr.success("Successfully added instruction", "", {positionClass: 'toast-bottom-left'});
        this.onCancelClick();
      },
      error => {
        this.toastr.error(error.error);
        this.onCancelClick();
      }
    )
  }

}

