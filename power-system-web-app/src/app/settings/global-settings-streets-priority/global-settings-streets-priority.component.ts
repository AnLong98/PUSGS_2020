import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DisplayService } from 'app/services/display.service';
import { LocationService } from 'app/services/location.service';
import { TabMessagingService } from 'app/services/tab-messaging.service';
import { LocationList } from 'app/shared/models/location-list.model';
import { Location } from 'app/shared/models/location.model';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-global-settings-streets-priority',
  templateUrl: './global-settings-streets-priority.component.html',
  styleUrls: ['./global-settings-streets-priority.component.css']
})

export class GlobalSettingsStreetsPriorityComponent implements OnInit {

  displayedColumns: string[] = ['id', 'street', 'number', 'city', 'morningPriority', 'noonPriority', 'nightPriority'];
  dataSource: MatTableDataSource<Location>;
  locations: Location[] = [];
  location = [];
  isLoading:boolean = true;

  constructor(public dialog:MatDialog, private locationService:LocationService, private route:ActivatedRoute, private toastr:ToastrService,
    private tabMessaging:TabMessagingService, public display:DisplayService) { 
  
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations()
  {
    this.isLoading = true;
    this.locationService.getAllLocations().subscribe(
      data => {
        this.locations = data;
        this.dataSource = new MatTableDataSource(data);
      },
      error => {
        this.toastr.error(error.error);
      }
    );
  }

  onSubmit()
  {
    this.locationService.changePriorities(this.dataSource.filteredData).subscribe(
      data =>
      {
        console.log(data);
        this.toastr.success("Successfully updated priorities", "", {positionClass: 'toast-bottom-left'});
      },
      error =>
      {
        this.toastr.error(error.error);
      }
    );
    
  }
}