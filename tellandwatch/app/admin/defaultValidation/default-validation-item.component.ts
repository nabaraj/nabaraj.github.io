// angular
import { Component, Input, OnInit } from '@angular/core';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, CanDeactivate, Params, Router } from '@angular/router';

// api
import * as InterfaceProviders from './../services/api/models/interface-providers';

// providers/services
import { BusyIndicatorService } from './../common/services/busyIndicator.service';
import { DialogService } from './../common/services/dialog.service';
import { LocalStorageService, RestoreService } from './../common/services/dataStorage.service';
import { ValidationService } from './../common/services/validation.service';

import { DataContext } from './../services/api/rest/data-context.service';
import { DataContextLocal } from './../services/api/local/data-context-local.service';

// components
import { BaseItemComponent } from './../common/components/base-item.component';
import { ParentFormComponent } from './../common/components/parent-form.component';
import { ValidationMessageComponent } from './../common/components/validation-message.component';

// other
import * as moment from 'moment';

@Component({
  selector: 'defaultValidationItem',
  // styleUrls: ['./default-validation-item.component.css'],
  templateUrl: './default-validation-item.component.html'
})

export class DefaultValidationItemComponent extends BaseItemComponent<InterfaceProviders.DefaultValidation> {



  @Input() myForm: FormGroup;

  constructor(
    protected datacontextService: DataContextLocal,    
    protected titleService: Title,
    protected busyIndicatorService: BusyIndicatorService,
    protected dialog: DialogService,
    protected formBuilder: FormBuilder,
    protected location: Location,
    protected restoreService: RestoreService<InterfaceProviders.DefaultValidation>,
    protected routeParams: ActivatedRoute,
    protected router: Router,
    protected validationService: ValidationService
  ) {
    super(titleService,
      datacontextService.DefaultValidationApi,
      busyIndicatorService,
      dialog,
      formBuilder,
      location,
      restoreService,
      routeParams,
      router,
      validationService
    );
    
  }

  buildForm(): void {
    this.formMetaData = require('./default-validation.metaData.json');
    this.normalizeFormMetaData();
    this.addFormValidation();

    this.myForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );

    this.onValueChanged(); // (re)set validation messages now
  }

  private addFormValidation() {
    this.myForm = this.formBuilder.group({
      
      id: this.formMetaData.properties.id ? [
          this.formMetaData.properties.id['x-ncg'].defaultValue ? this.formMetaData.properties.id['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.id['x-ncg'].validations)
        )
      ] : null,
      
      valEmailAddressPattern: this.formMetaData.properties.valEmailAddressPattern ? [
          this.formMetaData.properties.valEmailAddressPattern['x-ncg'].defaultValue ? this.formMetaData.properties.valEmailAddressPattern['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.valEmailAddressPattern['x-ncg'].validations)
        )
      ] : null,
      
      valMin0Max100Value: this.formMetaData.properties.valMin0Max100Value ? [
          this.formMetaData.properties.valMin0Max100Value['x-ncg'].defaultValue ? this.formMetaData.properties.valMin0Max100Value['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.valMin0Max100Value['x-ncg'].validations)
        )
      ] : null,
      
      valMin2Max8Length: this.formMetaData.properties.valMin2Max8Length ? [
          this.formMetaData.properties.valMin2Max8Length['x-ncg'].defaultValue ? this.formMetaData.properties.valMin2Max8Length['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.valMin2Max8Length['x-ncg'].validations)
        )
      ] : null,
      
      valRequiredField: this.formMetaData.properties.valRequiredField ? [
          this.formMetaData.properties.valRequiredField['x-ncg'].defaultValue ? this.formMetaData.properties.valRequiredField['x-ncg'].defaultValue : null,
          Validators.compose(
          this.validationService.generateValidators(this.formMetaData.properties.valRequiredField['x-ncg'].validations)
        )
      ] : null,
    });
  }

  protected customValidate() {
  }

  protected populateComponentDataAsync() {
  }
}
