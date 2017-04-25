// angular
import {Component, Input, Output, ElementRef, EventEmitter} from '@angular/core';

// 3rd party
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'inputDebounce',
  template: '<input type="text" class="form-control" [placeholder]="placeholder" [(ngModel)]="inputValue" />'
})
export class InputDebounceComponent {
  @Input() placeholder: string;
  @Input() set delay(interval: number) {
    this._delay = interval || this._delay;
  }
  @Output() value: EventEmitter<{}> = new EventEmitter();

  public inputValue: string;
  private _delay: number = 300;
  private _elementRef: ElementRef;

  constructor(private elementRef: ElementRef) {
    this._elementRef = elementRef;
  }

  ngOnInit() {
    this.eventSubcribe();
  }

  private eventSubcribe() {
    const eventStream = Observable.fromEvent(this._elementRef.nativeElement, 'keyup')
      .map(() => this.inputValue)
      .debounceTime(this._delay)
      .distinctUntilChanged();

    eventStream.subscribe(input => this.value.emit(input));
  }
}
