import { WorkPlansControlService } from './../services/work-plans-control.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'app/shared/models/user.model';
import { TableControlOptions } from 'app/shared/options/table-control-options.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  rolesControl = new FormControl();
  roles: string[] = ['Worker', 'Administrator', 'Disptacher', 'Crew member'];
  users:User[] = [];
  tableControlOptions:TableControlOptions = {
    shouldInitFilter:true,
    shouldInitRadio:true,
    shouldInitSaveButton:false,
    shouldInitSearch:true,
    filterValues: ['Worker', 'Administrator', 'Disptacher', 'Crew member'],
    isMultiFilter:false,
    buttonNaviLink:null,
    radioOptions:{
      value1:'all',
      value2:'onlyUnapproved',
      label1:'All',
      label2:'Only unapproved'
    },
    controlService: this.controlService,
  }

  constructor(private controlService:WorkPlansControlService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers()
  {
    let i = 0;
    for( i = 0; i < 5; i++)
    {
    this.users.push({id:'1',
                    name: 'Predrag',
                    lastName: 'Glavas',
                    email:'pedjaglavas98@gmail.som',
                    username: 'pedjicaglavasica98',
                    status: 'approved',
                    role:'worker',
                    address:"Vojvode Misica 8",
                    birthday: new Date('5.3.1998.')
                  });

    this.users.push({id:'2',
                    name: 'Niikola',
                    lastName: 'Mijonic',
                    email:'nidzas98@gmail.som',
                    username: 'crncuga98',
                    status: 'pending',
                    role:'disptacher',
                    address:"Srbobranska 12",
                    birthday: new Date('6.3.1998.')
                  });  

    this.users.push({id:'3',
                    name: 'Befan',
                    lastName: 'Stesovic',
                    email:'stefanb@gmail.som',
                    username: 'aaakojik',
                    status: 'blocked',
                    role:'admin',
                    address:"Bulevar Dusana Bajatovica 69",
                    birthday: new Date('11.24.1998.')
                    });       
      }    
  }

}
