import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'app/shared/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  rolesControl = new FormControl();
  roles: string[] = ['Worker', 'Administrator', 'Disptacher', 'Crew member'];
  users:User[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers()
  {
    let i = 0;
    for( i = 0; i < 5; i++)
    {
    this.users.push({id:1,
                    name: 'Predrag',
                    lastname: 'Glavas',
                    email:'pedjaglavas98@gmail.som',
                    username: 'pedjicaglavasica98',
                    status: 'approved',
                    role:'worker',
                    address:"Vojvode Misica 8",
                    birthday: new Date('5.3.1998.'),
                    crewID:0
                  });

    this.users.push({id:2,
                    name: 'Niikola',
                    lastname: 'Mijonic',
                    email:'nidzas98@gmail.som',
                    username: 'mijonic',
                    status: 'pending',
                    role:'disptacher',
                    address:"Srbobranska 12",
                    birthday: new Date('6.3.1998.'),
                    crewID:0
                  });  

    this.users.push({id:3,
                    name: 'Befan',
                    lastname: 'Stesovic',
                    email:'stefanb@gmail.som',
                    username: 'bass',
                    status: 'blocked',
                    role:'admin',
                    address:"Bulevar Dusana Bajatovica 69",
                    birthday: new Date('11.24.1998.'),
                    crewID:0
                    });       
      }    
  }

}
