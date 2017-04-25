import { Component, OnInit, Input } from '@angular/core';
//import {NgForm} from '@angular/common';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import {
  NgForm, ControlContainer, //FORM_PROVIDERS,
  FormBuilder, Validators
} from '@angular/forms';


import {
  CanDeactivate,// ROUTER_DIRECTIVES, ComponentInstruction, RouteConfig,
  Router, RouterState
} from '@angular/router';

import { DialogService } from '../services/dialog.service';
import { RestoreService } from '../services/dataStorage.service';
import { ValidationService } from '../services/validation.service';

import { ValidationMessageComponent } from './validation-message.component';

import { BaseApi } from '../services/api/BaseApi';

import * as moment from 'moment';

@Component({
  selector: 'parentForm',
  providers: [DialogService, RestoreService],
  //styles: [require('./address-item.component.css')],
  templateUrl: './parent-form.component.html'
})
// TODO: not sure yet what to use this for
export class ParentFormComponent {

  @Input('myForm') myForm;
  @Input('item') _item2;

  constructor() {
    console.log('ParentFormComponent constructor');
    console.log(this._item2);
  }

  ngOnInit() {
    console.log('ParentFormComponent ngOnInit');
    console.log(this._item2);

  }

  customValidate() {
    console.log('customValidate');
  }

  goBack() {
    console.log('ParentFormComponent goBack');
    console.log(this._item2);
    console.log();

  }

  onCancel() {
    console.log('ParentFormComponent onCancel');

  }

  onReset() {
    console.log('ParentFormComponent onReset');

  }

  onSubmit() {
    console.log('ParentFormComponent onSubmit');

  }

}
