import { browser, by, element, protractor } from 'protractor';

export class e2eHelper {
  EC = protractor.ExpectedConditions;
  timeoutWait = 20000;

  checkIfUniqueId(list, id): boolean {
    let result = false;
    let invalid = 0;

    list.forEach((item) => {
      if (item.id == id.toString()) {
        invalid++;
      }
    });

    result = invalid == 0 ? true : false;
    return result;
  }

  generateUniqueId(list): number {
    let listLength = Object.keys(list).length;
    let i = 1;

    while (i <= listLength) {
      if (this.checkIfUniqueId(list, i)) {
        return i;
      }
      else {
        i++;
      }
    }

    return ++listLength;
  }

  convertToSomeDateFormat(format: string, date: string) {
    let formattedDate = new Date(date);
    let dateString = '';

    switch (format) {
      case 'mmddyyyy':
        dateString = ('0' + (formattedDate.getMonth() + 1)).slice(-2) + ('0' + formattedDate.getDate()).slice(-2) + formattedDate.getFullYear().toString();
        break;
      default:
    }

    return dateString;
  }

  readJsonFile(jsonFile) {
    let fs = require('fs');
    let data = fs.readFileSync(jsonFile);
    return JSON.parse(data);
  }

  // this.writeToTextFile = function(filename, output){
  //     var file = new File(filename);
  //     file.open("w");
  //     file.writeln(output);
  //     file.close();
  // }

  writeToFile(fileName, output) {
    let fs = require('fs');
    fs.writeFile(fileName, output, function (err) {
      if (err)
        console.error(err);
      console.log('Written!');
    });
  }

  appendToFile(fileName, output) {
    let fs = require('fs');
    fs.appendFile(fileName, output, function (err) {
      if (err)
        console.error(err);
      console.log('Appended!');
    });
  }

  isPresent(el) {
    return browser.wait(this.EC.presenceOf(el), this.timeoutWait, 'Element is taking too long to appear in the DOM');
  }

  isNotPresent(el) {
    return browser.wait(this.EC.stalenessOf(el), this.timeoutWait, 'It is taking long to perform the checking of element not being in the DOM');
  }

  isClickable(el) {
    return browser.wait(this.EC.elementToBeClickable(el), this.timeoutWait, 'Element is not ready to click on');
  }

  isVisible(el) {
    return browser.wait(this.EC.visibilityOf(el), this.timeoutWait, 'Element is not visible');
  }
  isNotVisible(el) {
    return browser.wait(this.EC.invisibilityOf(el), this.timeoutWait, 'Element is still visible');
  }

  urlChanged(urlToBeChecked) {
    return browser.getCurrentUrl().then(function (url) {
      return url === urlToBeChecked;
    });
  };
  scrollIntoView(el) {
    browser.executeScript(function () { arguments[0].scrollIntoView(); }, el.getWebElement());
  }

  hasClass(el, className) {
    return el.getAttribute('class').then((classAttribute) => {
      return (classAttribute.indexOf(className) !== -1);
    })
  }

  sendKeys(el, inputText) {
    if (inputText != '') {
      console.log(el);
      inputText.split('').forEach((c) => { el.getWebElement().sendKeys(c) });
    }
    else {
      el.sendKeys('');
    }
  }

  generateItemBasedOnMetaData(metaData) {
    // UNDONE:
    return {};
  }

  // this.and = function(arrayOfFunctions) {
  //     return EC.and(arrayOfFunctions);
  // };
  // this.hitEnter = function() {
  //     return browser.actions().sendKeys(protractor.Key.ENTER).perform();
  // };
  /**
   * switches focus to a new window
   * @param  {int} windowHandleIndex - the nth window to switch to
   * @param  {pageObject} targetPage - the page we'll be on after the switch
   */
  // switchToWindow(windowHandleIndex, targetPage){
  //     var that = this;
  //     // wait for new page to open...
  //     let handle = browser.wait(function() {
  //         return browser.getAllWindowHandles().then(function(handles) {
  //             // make sure window we're switching to exists...
  //             if(handles.length > windowHandleIndex) {
  //                 return handles[windowHandleIndex];
  //             } else {
  //                 throw new Error('window index ' + windowHandleIndex + ' does not exist');
  //             }
  //         });
  //     }, 20000);
  //     console.log('switching to window ' + windowHandleIndex);
  //     browser.switchTo().window(handle); //cannot use handle as string, handle is promise
  // }
  /**
   * test if an element has a class
   *
   * @param  {elementFinder} locator - eg. $('div#myId')
   * @param  {string}  klass  - class name
   * @return {Boolean} - does the element have the class?
   */
  // this.hasClass = function(locator, klass) {
  //     return locator.getAttribute('class').then(function(classes) {
  //         return classes.split(' ').indexOf(klass) !== -1;
  //     });
  // };
  // this.hasText = function(locator, text) {
  //     return EC.textToBePresentInElement(locator, text);
  // };
  // protractor.ElementFinder.prototype.getWidth = function () {
  //     return this.getSize().then(function (size) {
  //         return size.width;
  //     });
  // };
}
