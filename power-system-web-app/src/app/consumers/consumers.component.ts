import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConsumerService } from 'app/services/consumer.service';
import { DisplayService } from 'app/services/display.service';
import { Consumer } from 'app/shared/models/consumer.model';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-consumers',
  templateUrl: './consumers.component.html',
  styleUrls: ['./consumers.component.css']
})
export class ConsumersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['action', 'id', 'name', 'lastname', 'accountID', 'locationID', 'phone', 'accountType'];
  dataSource:Observable<Consumer[]>;
  accountTypes: any[] =
  [ 
    {type:'ALL', value: 'ALL'},
    {type:'RESIDENTAL', value: 'RESIDENTAL'},
    {type:'NONRESIDENTAL', value: 'NONRESIDENTAL'}
  ];

  isLoading:boolean = true;

  consumerForm = new FormGroup(
    {
      search:new FormControl(''),
      accountType:new FormControl('ALL')
    }
  );
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private consumerService:ConsumerService, public display:DisplayService, private toastr:ToastrService) { }

  ngAfterViewInit(): void {
    if(this.isLoading)
      this.getConsumers();
  }
  
  delete(id:number)
  {
    this.consumerService.deleteConsumer(id).subscribe(
      data=> {
        this.getConsumers();
        this.toastr.success("Consumer successfully deleted", "", {positionClass: 'toast-bottom-left'});
      }
    )
  }

  getConsumers() {

    let type = this.consumerForm.controls['accountType'].value;
    let search = this.consumerForm.controls['search'].value;
    this.dataSource = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.consumerService.getConsumersPaged(
             this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, type, search);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoading = false;
          this.paginator.length = data.totalCount;

          return data.consumers;
        }),
        catchError(() => {
          this.isLoading = false;
          return of([]);
        })
      );
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  reload()
  {
    this.getConsumers();
  }

  ngOnInit(): void {
  }

}
