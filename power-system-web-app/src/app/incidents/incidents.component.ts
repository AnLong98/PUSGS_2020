import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DisplayService } from 'app/services/display.service';
import { IncidentService } from 'app/services/incident.service';
import { Incident } from 'app/shared/models/incident.model';
import { ToastrService } from 'ngx-toastr';






@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css']
})
export class IncidentsComponent implements OnInit  {

  displayedColumns: string[] = ['action', 'id', 'type', 'priority', 'confirmed', 'status', 'ETA', 'ATA', 'incidentOccurred', 'ETR', 'voltageLevel', 'plannedWork', 'solveIncident' ];
  dataSource: MatTableDataSource<Incident>;

  isLoading:boolean = true;

  toppings = new FormControl();
  toppingList: string[] = ['Incident Type', 'Confirmed']; 


  incidents:Incident[] = [];
  allIncidents:Incident[] = [];
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private incidentService:IncidentService,  private toastr: ToastrService, public display:DisplayService) {

  }

  ngOnInit(): void {
    window.dispatchEvent(new Event('resize'));
    this.getIncidents();
    
    
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 
  getIncidents()
  {
    this.incidentService.getAllIncidents().subscribe(
      data =>{
        this.allIncidents = data;
        this.incidents = data;
        this.dataSource = new MatTableDataSource(data);
        this.isLoading = false;

        console.log(this.allIncidents);
       
      },
      error =>{

        this.getIncidents();
      }
    )
  }

 

  

  delete(incidentId: number)
  {
   
    this.incidentService.deleteIncident(incidentId).subscribe(x =>{
        this.getIncidents();
        this.toastr.success("Incident successfully deleted","", {positionClass: 'toast-bottom-left'});
    });
  }

  

}


