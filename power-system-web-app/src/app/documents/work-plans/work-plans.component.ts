import { WorkPlan } from 'app/shared/models/work-plan.model';
import { UserService } from './../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DisplayService } from './../../services/display.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { WorkPlanService } from 'app/services/work-plan.service';


@Component({
  selector: 'app-work-plans',
  templateUrl: './work-plans.component.html',
  styleUrls: ['./work-plans.component.css']
})
export class WorkPlansComponent implements OnInit,  AfterViewInit {
  displayedColumns: string[] = ['action', 'id', 'type', 'status', 'street', 'startdate', 'enddate', 'emergency','company', 'phoneno', 'creationdate'];
  dataSource:Observable<WorkPlan[]>;
  documentStatuses: any[] = 
  [ {status:'All', value:'all'},
    {status:'Draft', value:'draft'},
    {status:'Canceled', value:"canceled"},
    {status:'Approved', value:'approved'},
    {status:'Denied', value:'denied'},
    ];
  isLoading:boolean = true;
  workPlansForm = new FormGroup(
    {
      search:new FormControl(''),
      documentStatus:new FormControl('all'),
      documentOwner:new FormControl('all')
    }
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private workPlanService:WorkPlanService, public display:DisplayService, private toastr:ToastrService,
    private userService:UserService) {
  }
  ngAfterViewInit(): void {
    if(this.isLoading)
      this.getWorkPlans();
  }

  ngOnInit(): void {

  }

  getWorkPlans() {

    let status = this.workPlansForm.controls['documentStatus'].value;
    let owner = this.workPlansForm.controls['documentOwner'].value;
    let search = this.workPlansForm.controls['search'].value;
    this.dataSource = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.workPlanService.getWorkplansPaged(
             this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction,status, search, owner );
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoading = false;
          this.paginator.length = data.totalCount;

          return data.workPlans;
        }),
        catchError(() => {
          this.isLoading = false;
          return of([]);
        })
      );
  }


  delete(id:number)
  {
    this.isLoading = true;
    this.workPlanService.deleteWorkPlan(id).subscribe(
      data =>{
        this.isLoading = false;
        this.getWorkPlans();
        this.toastr.success("Work plan successfully deleted.","", {positionClass: 'toast-bottom-left'});
        this.toastr.info("All media attached to this work plan is also deleted.","", {positionClass: 'toast-bottom-left'});
      },
      error =>{

        this.isLoading = false;
        if(error.error instanceof ProgressEvent)
                {
                  this.toastr.error("Server is unreachable","", {positionClass: 'toast-bottom-left'});
                }else
                {
                  this.toastr.error(error.error,"", {positionClass: 'toast-bottom-left'});
                }
        this.getWorkPlans();
      }
    );
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  reload()
  {
    this.getWorkPlans();
  }
}

