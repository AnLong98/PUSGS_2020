import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { ValidationService } from 'app/services/validation.service';
import { User } from 'app/shared/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-global-settings-change-password',
  templateUrl: './global-settings-change-password.component.html',
  styleUrls: ['./global-settings-change-password.component.css']
})
export class GlobalSettingsChangePasswordComponent implements OnInit {

  user: User;
  newPassword: string;
  oldPassword: string;
  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    newPassword: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.matchingPasswords });

  constructor(private validation:ValidationService, private toastr:ToastrService, private userService:UserService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user")!);
  }
  
  matchingPasswords(c: AbstractControl): {[key: string]: any} |null {
    let newPassword = c.get(['newPassword']);
    let confirmPassword = c.get(['confirmPassword']);

    if (newPassword!.value !== confirmPassword!.value) {
      return { mismatchedPasswords: true };
    }
    return null;
  }

  isValid(controlName:string)
  { 
    if(controlName === 'confirmPassword')
      return this.changePasswordForm.controls[controlName].valid && !this.changePasswordForm.hasError('mismatchedPasswords');
    return this.changePasswordForm.controls[controlName].valid
  }

  isInvalid(controlName:string)
  {
    if(controlName === 'confirmPassword')
      return this.changePasswordForm.controls[controlName].invalid || this.changePasswordForm.hasError('mismatchedPasswords');
    return this.changePasswordForm.controls[controlName].invalid
  }
  onSubmit()
  {
    if(this.changePasswordForm.valid)
    {
      this.newPassword = this.changePasswordForm.controls['newPassword'].value;
      this.oldPassword = this.changePasswordForm.controls['oldPassword'].value;
      this.userService.changePassword(this.user.id, this.oldPassword, this.newPassword).subscribe(
        data => {
          if(data == true)
            this.toastr.success("Successfully changed password", "", {positionClass: 'toast-bottom-left'})
        },
        error => {
          this.toastr.error(error.error);
        }
      )
    }
    else
    {
      this.validation.validateAllFields(this.changePasswordForm);
        this.toastr.info("Please check form fields again, there are some errors.","", {positionClass: 'toast-bottom-left'});
    }
  }
}
