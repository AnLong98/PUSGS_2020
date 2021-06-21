import { UserService } from './../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { User } from 'app/shared/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'app/services/validation.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  @Input()
  accountStatus: string;
  roles: any[] =
  [
    {display:'CREW_MEMBER', value: 'CREW_MEMBER'},
    {display:'DISPATCHER', value: 'DISPATCHER'},
    {display:'WORKER', value: 'WORKER'},
    {display:'CONSUMER', value: 'CONSUMER'}
  ];

  newUser: User = new User();
  editUserForm = new FormGroup({
    name : new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    imageURL : new FormControl(null),
    role: new FormControl('', Validators.nullValidator)
  })

  imagePreview:string = '';
  isLoading:boolean = true;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('resetBtn') resetBtn: ElementRef;

  constructor(private router:Router, private validationService:ValidationService, private toastr:ToastrService, private userService:UserService) { }
  user:User;
  @ViewChild("avatar") avatar:ElementRef;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user")!);
    this.accountStatus = this.user.userStatus.toString();
    this.setForm();
    this.loadUserImage();
  }

  setForm()
  {
    this.editUserForm.controls['name'].setValue(this.user.name);
    this.editUserForm.controls['lastname'].setValue(this.user.lastname);
    this.editUserForm.controls['username'].setValue(this.user.username);
    this.editUserForm.controls['email'].setValue(this.user.email);
    this.editUserForm.controls['role'].setValue(this.user.userType);
  }

  onSelectImage(event:Event)
  {
    const file = (event.target as HTMLInputElement).files![0];
    if(!file)
    {
      this.imagePreview = '';
      return;
    }
      
    this.editUserForm.patchValue({imageURL: file});
    this.editUserForm.get('imageURL')!.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
    this.imagePreview = reader.result!.toString();
    };
    reader.readAsDataURL(file);
    
  }

  uploadImage(image:File, userId:number)
  {
    this.isLoading = true;
    this.userService.uploadAvatar(image, userId).subscribe(
      (event)=>{
        if(event.type === HttpEventType.Response && event.status == 200)
        {
          this.resetBtn.nativeElement.click();
          this.toastr.success("Profile image uploaded","", {positionClass: 'toast-bottom-left'});
          this.closeBtn.nativeElement.click();
          this.isLoading = false;
        }
      },
      error =>{
        this.isLoading = false;
        this.toastr.error(error.error);
      }
    )
  }
  
  loadUserImage()
  {
    this.userService.getUserAvatar(this.user.id, this.user.imageURL).subscribe(
      data =>{
        const reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = _event => {
            this.avatar.nativeElement.src = reader.result!.toString(); 

        };
      },
      error =>{

      if(error.error instanceof ProgressEvent)
      {
        this.loadUserImage();
      }
    }

    )
  }

  saveChanges()
  {
    if(this.editUserForm.valid)
    {
      this.user.name = this.editUserForm.value.name;
      this.user.lastname = this.editUserForm.value.lastname;
      this.user.username = this.editUserForm.value.username;
      this.user.email = this.editUserForm.value.email;
      if(!this.editUserForm.value.role == null){
        this.user.userType = this.editUserForm.value.role;
      }
      //this.user.imageURL = this.editUserForm.value.imageURL;

      this.userService.updateUser(this.user).subscribe(
        data => {
          console.log(data);
          if(this.imagePreview != '')
          {
            this.uploadImage(this.editUserForm.value.imageURL, data.id);
          }
            this.user = data;
            this.toastr.success("User updated successfully", "", {positionClass: 'toast-bottom-left'});
            localStorage.setItem("user", JSON.stringify(data));
            this.router.navigate(['dashboard']);
          
          
        },
        error => {
          this.router.navigate(['dashboard']);
          this.toastr.error(error.error, "", {positionClass: 'toast-bottom-left'});
        }
      )
    }
    else
    {
      this.validationService.validateAllFields(this.editUserForm);
    }
  }
}
