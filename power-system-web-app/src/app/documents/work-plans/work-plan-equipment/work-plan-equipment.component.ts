import { ChooseEquipmentDialogComponent } from './../../dialogs/choose-equipment-dialog/choose-equipment-dialog.component';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Device } from 'app/shared/models/device.model';
import { WorkPlanService } from 'app/services/work-plan.service';
import { DisplayService } from 'app/services/display.service';
import { TabMessagingService } from 'app/services/tab-messaging.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-work-plan-equipment',
  templateUrl: './work-plan-equipment.component.html',
  styleUrls: ['./work-plan-equipment.component.css']
})

export class WorkPlanEquipmentComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['id', 'name', 'deviceType', 'coordinates', 'address', 'actions'];
  dataSource: MatTableDataSource<Device>;
  isLoading:boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog:MatDialog, private wrService:WorkPlanService, private route:ActivatedRoute, private toastr:ToastrService,
    private tabMessaging:TabMessagingService, public display:DisplayService) {
  
  }

  ngOnInit(): void {
    const wrId = this.route.snapshot.paramMap.get('id');
    this.loadDevices(+wrId!);
    this.tabMessaging.showEdit(+wrId!);
  }

  loadDevices(id:number)
  {
    this.isLoading = true;
    this.wrService.getWorkPlanDevices(id).subscribe(
      data =>{
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error =>{
        if(error.error instanceof ProgressEvent)
          {
            this.loadDevices(id);
          }else
          {
            this.toastr.error(error.error);
          }
      }
    )
  }

  ngAfterViewInit() {
  }
}

