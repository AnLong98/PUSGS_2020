import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DisplayService } from 'app/services/display.service';
import { WorkRequestService } from 'app/services/work-request.service';
import { WorkRequest } from 'app/shared/models/work-request.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-choose-work-request-dialog',
  templateUrl: './choose-work-request-dialog.component.html',
  styleUrls: ['./choose-work-request-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChooseWorkRequestDialogComponent implements OnInit{

  displayedColumns: string[] = ['action', 'id', 'type', 'status', 'incident', 'street', 'startDate', 'phone', 'createdOn'];
  dataSource: MatTableDataSource<WorkRequest>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<ChooseWorkRequestDialogComponent>, private workRequestService: WorkRequestService, private toastr:ToastrService, public display:DisplayService) 
  { }
   
  loadWorkRequests()
  {
    this.workRequestService.getAll().subscribe(
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
  
   ngOnInit(): void {
     this.loadWorkRequests();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}


