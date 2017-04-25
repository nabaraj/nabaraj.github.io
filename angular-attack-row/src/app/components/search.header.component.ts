import {Component, Input} from '@angular/core';

@Component({
    selector: 'search-header',
    templateUrl: `app/templates/header.component.html`,
    styles : [`
    .search-header {
    //background:red;
    }
    `]
})


export class SearchHeaderComponent {
  @Input() searchData
  constructor(){

  }
}
