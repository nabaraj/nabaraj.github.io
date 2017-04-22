// angular
import { Component, OnInit } from '@angular/core';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { FormGroup, ControlContainer, FormBuilder, NgForm, Validators } from '@angular/forms'
import { CanDeactivate, Router, Params, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

// 3rd party
import * as moment from 'moment';
import * as changeCase from 'change-case';

// api
import { BaseApi } from '../services/api/BaseApi';

// components
//import {ValidationMessageComponent} from '../../components/common/validation-message.component';

// services
import { BusyIndicatorService } from '../services/busyIndicator.service';
import { DialogService } from '../services/dialog.service';
import { RestoreService } from '../services/dataStorage.service';
import { ValidationService } from '../services/validation.service';

export abstract class BaseItemComponent<T> implements OnInit {//, CanDeactivate {
  componentName: string = 'BaseItemComponent';
  viewName: string = 'All Data Type Item';

  isLoading: boolean;
  isSaving: boolean;
  myForm: FormGroup;
  guidKey: string;
  appName: string = 'AppName';

  changed: boolean = false;
  errorMessage: string;
  id: number = null;
  item: T = null;
  momentFunction: any;
  stateProvinceList: any = null;
  submitted: boolean = false;
  submitAttempted: boolean = false;
  isItemEdited: boolean;
  formErrors = {
  };
  customValidationMessages = {
  };
  formMetaData: any = {
  }

  constructor(protected title: Title,
    protected baseApi: BaseApi<T>,
    protected busyIndicator: BusyIndicatorService,
    protected dialog: DialogService,
    protected formBuilder: FormBuilder,
    protected location: Location,
    protected restoreService: RestoreService<T>,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected validationService: ValidationService
    //private _moment: moment
  ) {
    console.log(`${this.componentName} component base constructor`);
    this.momentFunction = moment; // TODO: inject the moment function in, not get from global?
  }

  abstract buildForm();
  protected abstract populateComponentDataAsync();

  ngOnInit() {
    console.log(`ngOnInit ${this.componentName} component`);

    this.setModelId();

    this.title.setTitle(
      `${this.appName} - ${this.viewName} - ${this.id}`);

    // template vs model driven forms http://blog.jhades.org/introduction-to-angular-2-forms-template-driven-vs-model-driven/
    // https://angular.io/docs/ts/latest/api/common/FormBuilder-class.html
    ////this.buildForm();

    this.populateComponentDataAsync();

    if (this.id === null || this.id === undefined) {
      this.isItemEdited = false;
      this.populateDataForNewItem();
    } else {
      this.isItemEdited = true;
      this.getItem();
    }
  }

  protected customValidate() {
    console.log('customValidate');
  }

  getItem() {
    console.log(`getItem in ${this.componentName}`);
    console.log(this.baseApi);

    this.isLoading = true;
    this.baseApi.getById(this.id)
      .subscribe(
      item => {
        this.isLoading = false;
        this.hackDatesToWork(item);
        this.restoreService.set(item);
        this.item = this.restoreService.get();
        this.buildForm();
      },
      error => {
        this.isLoading = false;
        this.errorMessage = <any>error;
        console.log(this.errorMessage);
      }
      );
  }

  populateDataForNewItem() {
    this.item = <T>{};

    this.item[this.baseApi.keyName] = this.baseApi.getNewId();
    this.item[this.guidKey] = this.guid();

    this.buildForm();

    this.restoreService.set(this.item);
  }

  goBack() {
    // Navigates back in the platform's history.
    this.location.back();
  }

  goToList() {
    console.log('goToList');
    this.router.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }

  onCancel() {
    // on cancel, reset data changes and navigate back to list
    this.item = this.restoreService.restoreItemLocal();

    // HACK: can't access because '_pristine' is private and only accessible within class 'AbstractControl' AbstractControl._pristine: any ...
    //this.myForm['_pristine'] = true;
    //this.myForm.reset(); ///this.myForm['_pristine'] = true;
    this.goBack();//router.navigate(['']);
  }

  onReset() {
    // reload data for item model
    this.item = this.restoreService.restoreItemLocal();

    // HACK: can't access because '_pristine' is private and only accessible within class 'AbstractControl' AbstractControl._pristine: any ...
    //this.myForm['_pristine'] = true;
    //this.myForm.reset();///['_pristine'] = true;
  }

  onDelete() {
    return this.dialog.confirm('Delete?').then(result => {
      return new Promise<boolean>((resolve, reject) => {
        if (result) {
          // restore data
          this.isLoading = true;
          this.baseApi.delete(this.id)
            .subscribe(
            (result) => {
              this.isLoading = false;
              this.goToList();
            }, (error) => {
              this.isLoading = false;
            }
            );
        }

        resolve(result);
      });
    });
  }

  _errorKeyToValidationKeyMapping = {
    maxlength: 'maxLength',
    minlength: 'minLength'
  }

  onValueChanged(data?: any) {
    if (!this.myForm) { return; }
    const form = this.myForm;


    for (const fieldKey in this.formMetaData.properties) {
      const control = form.get(fieldKey);

      // clear previous error message (if any)
      this.formMetaData.properties[fieldKey]['x-ncg'].errors = [];//'';

      if (control && control.dirty && !control.valid) {
        for (const errorKey in control.errors) {
          const validationType = this._errorKeyToValidationKeyMapping[errorKey] ? this._errorKeyToValidationKeyMapping[errorKey] : errorKey;
          ValidationService.addFormError(this.formMetaData, fieldKey, validationType, this.customValidationMessages, this.formMetaData);
        }

      }
    }
  }

  // static addFormError(formErrors, fieldKey, validationType, customValidationMessages, formMetaData) {
  //   console.log('addFormError');
  //   //if custom validation message exists use that
  //   formErrors.properties[fieldKey]['x-ncg'].errors.push({
  //     field: fieldKey,
  //     message: formMetaData[fieldKey].validations[validationType].message ?
  //       formMetaData[fieldKey].validations[validationType].message :
  //       BaseItemComponent.getGenericValidationMessage(fieldKey, validationType, formMetaData)
  //   });
  // }

  // // this is English. should have diff providers for different languages???
  // // TODO: move to service
  // static getGenericValidationMessage(fieldKey, validationType, formMetaData): string {
  //   console.log('getGenericValidationMessage');
  //   let errorMessage: string = '';
  //   let label = BaseItemComponent.getLabel(fieldKey, formMetaData);

  //   switch (validationType) {
  //     case 'minLength':
  //       errorMessage = `"${label}" must be at least ${formMetaData.properties[fieldKey]['x-ncg'].validations.minLength.value} characters.`;
  //       break;
  //     case 'maxLength':
  //       errorMessage = `"${label}" must be at most ${formMetaData.properties[fieldKey]['x-ncg'].validations.maxLength.value} characters.`;
  //       break;
  //     case 'minimum':
  //       errorMessage = `"${label}" must be at least ${formMetaData.properties[fieldKey]['x-ncg'].validations.minimum.value}.`;
  //       break;
  //     case 'maximum':
  //       errorMessage = `"${label}" must be at most ${formMetaData.properties[fieldKey]['x-ncg'].validations.maximum.value}.`;
  //       break;
  //     case 'required':
  //       errorMessage = `"${label}" is required.`;
  //       break;
  //     case 'pattern':
  //       errorMessage = `"${formMetaData.properties[fieldKey]['x-ncg'].validations.pattern.value}" is required.`;
  //       break;
  //     default:

  //   }
  //   return errorMessage;
  // }

  // static getLabel(fieldKey, formMetaData) {
  //   return formMetaData.properties[fieldKey]['x-ncg'].label ? formMetaData.properties[fieldKey]['x-ncg'] : changeCase.title(fieldKey);
  // }

  // static generateValidators(validations): any[] {
  //   let validators = [];

  //   for (const validationKey in validations) {
  //     if (validationKey === 'required') {
  //       validators.push(Validators.required);
  //     }
  //     if (validationKey === 'minLength') {
  //       validators.push(Validators.minLength(validations.minLength.value));
  //     }
  //     if (validationKey === 'maxLength') {
  //       validators.push(Validators.maxLength(validations.maxLength.value));
  //     }

  //     if (validationKey === 'pattern') {
  //       validators.push(Validators.pattern(validations.pattern.value));
  //     }
  //   }

  //   return validators;
  // }

  normalizeFormMetaData() {
    for (const fieldKey in this.formMetaData.properties) {
      // create default label
      if (this.formMetaData.properties[fieldKey]['x-ncg'].label === undefined)
        this.formMetaData.properties[fieldKey]['x-ncg'].label = changeCase.titleCase(fieldKey);
      // create default placeholder
      if (this.formMetaData.properties[fieldKey]['x-ncg'].placeholder === undefined)
        this.formMetaData.properties[fieldKey]['x-ncg'].placeholder = changeCase.lowerCase(changeCase.titleCase(fieldKey), null);
    }
  }

  onSubmit() {
    this.submitAttempted = true;

    // trigger all input validations (submit button would only validate the form controls on the screen, no input validation messages. // TODO: maybe novalidate changed that and doesn't even validate that anymore?)
    for (var i in this.myForm.controls) {
      this.myForm.controls[i].markAsDirty();
      this.myForm.controls[i].updateValueAndValidity();
      // this.myForm.controls[i].markAsTouched();
    }

    // checkValidations
    this.customValidate();

    // if form valid, add.
    if (this.myForm.valid) {
      // show busy indicator
      this.busyIndicator.start();
      this.isSaving = true;
      this.baseApi.save(this.item, this.isItemEdited)
        .subscribe(
        item => {
          console.log('saved');

          this.isSaving = false;
          this.submitted = true;
          // stop busy indicator
          this.busyIndicator.stop();
          this.goToList();
        },
        error => {
          this.isSaving = false;
          this.errorMessage = <any>error;
          console.log(this.errorMessage);
        });
    }
  }

  // routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
  //   // Allow synchronous navigation 'true` if the model is unchanged.
  //   if (this.submitted || this.myForm.pristine) {
  //     return true;
  //   }

  //   // Otherwise ask the user with the dialog service and return its
  //   // promise which resolves to true or false when the user decides
  //   // TODO: reload item model changes if true.
  //   return this.dialog.confirm('Discard changes?').then(result => {
  //     return new Promise<boolean>((resolve, reject) => {
  //       if (result) {
  //         // restore data
  //         this.item = this.restoreService.restoreItemLocal();
  //       }

  //       resolve(result);
  //     });
  //   });
  // }

  setModelId() {
    this.id = this.activatedRoute.snapshot.params['id'] === 'new' ? null : + this.activatedRoute.snapshot.params['id'];
  }

  // TODO: make these static
  private hackDatesToWork(item) {
    // TODO: not sure really need to convert if bind to input date type and Date object?
    for (let key in item) {
      if (key && item[key].constructor.name === 'String' && this.momentFunction(item[key]).isValid()) {
        item[key] = this.momentFunction(item[key]).format('YYYY-MM-DD');
      }
    }
  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}
