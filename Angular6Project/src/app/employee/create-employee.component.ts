import { Component, OnInit } from '@angular/core';
import{FormGroup,Validators, AbstractControl} from'@angular/forms';
import { FormBuilder } from '@angular/forms';
import {CustomValidators} from '../shared/custom.validators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  fullNameLength =0;
  constructor(private fb: FormBuilder) { }

  formErrors = {
    'fullName': '',
    'email': '',
    'confirmEmail':'',
    'emailGroup': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  };
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domian should be jpmorgan.com'
    },
    'confirmEmail': {
      'required': 'confirmEmail is required.',
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match.'
    },
    'phone' :{
      'required':'Phone is required.'
    },
    'skillName': {
      'required': 'Skill Name is required.',
    },
    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    },
  };  

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('dell.com')]],
        confirmEmail: ['', [Validators.required]],
      }, { validator: this.matchEmails }),
      phone:[''],
      skills: this.fb.group({
        skillName: ['',[Validators.required]],
        experienceInYears: ['',[Validators.required]],
        proficiency: ['',[Validators.required]]
      }),
    });
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.employeeForm.get('contactPreference')
                 .valueChanges.subscribe((data: string) => {
  this.onContactPrefernceChange(data);
});

//this.employeeForm.valueChanges.subscribe((data)=>{
  //this.logValidationErrors(data);
//});
  }
  onSubmit():void{
    console.log("Its here");
    console.log(this.employeeForm.value);
  }
  onClick():void{
    console.log(this.employeeForm.value);
  }
  onLoadDataClick():void{
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }
  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    const emailFormControl = this.employeeForm.get('email');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators(Validators.required);
      emailFormControl.clearValidators();

    } else {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
    emailFormControl.updateValueAndValidity();
  }

  
  

  logValidationErrors(group : FormGroup=this.employeeForm):void{
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      // Loop through nested form groups and form controls to check
      // for validation errors. For the form groups and form controls
      // that have failed validation, retrieve the corresponding
      // validation message from validationMessages object and store
      // it in the formErrors object. The UI binds to the formErrors
      // object properties to display the validation errors.
      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
  
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });

  }

   matchEmails(group: AbstractControl): { [key: string]: any } | null {
    const emailControl = group.get('email');
    const confirmEmailControl = group.get('confirmEmail');
  
    if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine) {
      return null;
    } else {
      return { 'emailMismatch': true };
    }
  }


}
