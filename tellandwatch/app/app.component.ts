import {Component, OnInit} from '@angular/core';
import {MdIconRegistry, MdDialog} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {AnnyangService} from './shared/services/annyang.service';
import { SearchHeaderComponent } from './search.header.component';

import {DialogComponent} from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  template: '<search-header></search-header>'
  })
export class TellAndWatchComponent implements OnInit {
  val: any

  constructor(private annyang: AnnyangService, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private dialog: MdDialog) {
  }

  ngOnInit() {
    this.annyang.commands = {
      'search *val': (val)=> {
        console.log(this.val);
      }, 'play *val': (val)=> {
        console.log(this.val);
      }
    };
    this.annyang.start();
  }
}
