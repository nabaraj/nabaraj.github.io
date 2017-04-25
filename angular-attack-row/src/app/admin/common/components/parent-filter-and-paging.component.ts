// angular 2
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanDeactivate, Router, Params } from '@angular/router';

// api
import { BaseApi } from '../services/api/BaseApi';
import { IListWithCount } from '../services/api/IListWithCount';
import { IQuery } from '../services/api/IQuery';

// pipes
import { DisplayDataTransformPipe } from '../pipes/dataTransform.pipe';

@Component({
  selector: 'parentFilterAndPaging',
  templateUrl: './parent-filter-and-paging.component.html'
})
export class ParentFilterAndPagingComponent implements OnInit {
  componentName = 'ParentFilterAndPagingComponent';

  @Input() currentPage;
  @Input('itemCount') _itemCount;

  @Output() _getListClicked = new EventEmitter();
  @Output() _pageChanged = new EventEmitter();
  @Output() _updateSort = new EventEmitter();

  @Input('query') _query: IQuery = {
    top: 5,
    skip: 0,
    count: true,
    expand: null,
    filter: null,
    keywords: null,
    select: null,
    orderBy: null,
  };

  @Input('paginationData') _paginationData = {
    isBoundaryLinks: true,
    maxSize: 10,
    isRotate: false,
    currentPage: 1,
    numPages: 1,
    itemCount: 0
    //itemsPerPage: this.top
  };

  constructor(
    private router: Router
  ) {
  }

  // lifecycle events
  ngOnInit() {
    console.log(`ngOnInit ${this.componentName} component`);
  }

  // public methods
  getList() {
    console.log('getList');
    this._getListClicked.next(null);
  }

  protected populateComponentDataAsync() { };

  updateSort(fieldName: string) {
    this._updateSort.next(fieldName);
  }

  // private methods
  private pageChanged(event: any): void {
    this._pageChanged.next(event);
  };

  numPagesUpdated(event) {
  }

}
