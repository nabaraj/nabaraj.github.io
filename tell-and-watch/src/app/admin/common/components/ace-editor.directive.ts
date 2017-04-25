// / <reference path="scripts/typings/main/ambient/ace/ace.d.ts" />

// UNDONE: how to import ace code and typing
// import ace = require('ace-builds/src/ace');

import {Component, Directive, EventEmitter, ElementRef} from '@angular/core';

// declare the ace library
declare var ace: any;

@Directive({
  selector: 'ace-editor',
  inputs: [
    'text'
  ],
  outputs: [
    'textChange'
  ]
})
export class AceEditorDirective {
  public textChange: EventEmitter<string>;
  private editor: any;
  private settingText: boolean;

  set text(s: string) {
    let sOld = this.editor.getValue();
    if (sOld === s) return;

    this.settingText = true;
    this.editor.setValue(s);
    this.editor.clearSelection();
    this.editor.focus();
    this.settingText = false;
  }

  constructor(elementRef: ElementRef) {
    var dir = this;
    this.textChange = new EventEmitter<string>();

    // this is the <div ace-editor> root element
    let el = elementRef.nativeElement;
    this.editor = ace.edit(el); // TODO: something about this causes looping constant Angular 2 lifycycle such as ngAfterViewChecking
    this.editor.setTheme('ace/theme/monokai');
    //this.editor.getSession().setMode("ace/mode/xml");
    this.editor.getSession().setMode('ace/mode/typescript');
    //this.editor.setTheme("ace/theme/twilight");

    this.editor.on('change', (e) => {
      if (dir.settingText) return;
      // discard the delta (e), and provide whole document
      dir.textChange.emit(dir.editor.getValue());
    });

    // var beautify = ace.require("ace/ext/beautify"); // get reference to extension
    // var editor = ace.edit("editor"); // get reference to editor
    // beautify.beautify(editor.session);
    //let beautify = ace.require("ace/ext/beautify");
    //this.editor.commands.addCommands(beautify.commands);

    console.log('constructor end');
  }

  ngOnInit() {
    console.log('aceEditor ngOnInit');
    // UNDONE: remove this.text = "function()    {}";
  }

  // TODO: add beautify http://stackoverflow.com/questions/31767051/how-do-i-use-beautify-in-ace-editor
  // beautify() {
  //   let beautify2 = ace.require("ace/ext/beautify");
  //   beautify2.beautify(this.editor.session);
  // }
}
