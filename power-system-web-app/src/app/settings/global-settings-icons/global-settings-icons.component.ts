import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DisplayService } from 'app/services/display.service';
import { SettingsService } from 'app/services/settings.service';
import { TabMessagingService } from 'app/services/tab-messaging.service';
import { Icon } from 'app/shared/models/icon.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-global-settings-icons',
  templateUrl: './global-settings-icons.component.html',
  styleUrls: ['./global-settings-icons.component.css']
})
export class GlobalSettingsIconsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'iconType', 'name'];
  dataSource: MatTableDataSource<Icon>;
  icons: Icon[] = [];
  iconTypes = ['cancel', 'warning', 'info', 'check_circle', 'android', 'error', 'error_outline', 'add_alert', 'report_problem'];

  isLoading:boolean = true;

  constructor(public dialog:MatDialog, private settingsService:SettingsService, private route:ActivatedRoute, private toastr:ToastrService,
    private tabMessaging:TabMessagingService, public display:DisplayService) { }

  ngOnInit(): void {
    this.loadIcons();
  }

  loadIcons()
  {
    this.isLoading = true;
    this.settingsService.getAllIcons().subscribe(
      data => {
        this.icons = data;
        this.dataSource = new MatTableDataSource(data);
      },
      error => {
        this.toastr.error(error.error);
      }
    );
  }

  onSubmit()
  {
    console.log(this.dataSource.filteredData);
    /*
    this.settingsService.updateIcons(this.dataSource.filteredData).subscribe(
      data =>
      {
        console.log(data);
        this.toastr.success("Successfully updated priorities", "", {positionClass: 'toast-bottom-left'});
      },
      error =>
      {
        this.toastr.error(error.error);
      }
    );*/
  }

}
