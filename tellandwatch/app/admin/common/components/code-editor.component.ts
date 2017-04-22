// angular import { NgModule } from '@angular/core';
import { Component, EventEmitter, Output } from '@angular/core';

// 3rd party
import { AceEditorDirective } from './ace-editor.directive';

@Component({
  selector: 'code-editor',
  template: `<div>
      <ace-editor id="editor" [text]="code"></ace-editor>
    </div>
    `,
  inputs: [
    'code'
  ],
  styles: [`#editor {
  display:block;
  height:200px;
}
mit-editor {
  display:block;
  height:300px;
}`]
})
export class CodeEditorComponent {
  public code: string;
  @Output() codeChange = new EventEmitter(false);

  constructor() {
    //this.code = '';
  }

  public onCodeChanged(code: string) {
    this.codeChange.emit(code);
    //console.log('onCodeChanged: ' + code);
    //this.code = code;
  }


  ngAfterViewChecked() {
    console.log('CodeEditorComponentv ngAfterViewCheckedngAfterViewCheckedngAfterViewCheckedngAfterViewChecked');
    //this.afterViewChecked.next('afterViewChecked');
  }
}
