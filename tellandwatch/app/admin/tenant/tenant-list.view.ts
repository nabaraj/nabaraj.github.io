
import { browser, by, element, protractor } from 'protractor';
import { e2eHelper } from '../common/e2eHelper';

export class TenantListView {
  helper = new e2eHelper();

  //--Elements--
  searchInput = element(by.id('searchInput'));
  filterFieldSelect = element(by.id('filterFieldSelect'));
  filterTypeSelect = element(by.id('filterTypeSelect'));
  filterValueInput = element(by.xpath('//*[@id="inputDebounce"]/input'));
  recordsPerPageInput = element(by.id("recordsPerPageInput"));
  getButton = element(by.id("getButton"));
  countLabel = element(by.id('countLabel'));
  addButton = element(by.id('addButton'));

  goToLastPage(): void {
    element(by.linkText('Last')).click();
  }

  goToPageNumber(pageNumber): void {
    element(by.linkText(pageNumber)).click();
  }

  getFirstValueOfColumnInView(columnIndex: number): any {
    return element(by.xpath('//tbody/tr[2]/td[' + columnIndex + ']'));
  }

  getLastValueOfColumnInView(columnIndex: string): any {
    return element(by.xpath('//tbody/tr[last()]/td[' + columnIndex + ']'));
  }

  getFirstAndLastRecordValues(columnIndex): any {
    return this.getFirstValueOfColumnInView(columnIndex).getText().then((value) => {
      let arr = [];
      arr.push(value);
      return this.checkIfNavigationButtonDisabled('Last').then((isDisabled) => {
        if (!isDisabled) {
          this.goToLastPage();
        }

        return this.getLastValueOfColumnInView(columnIndex).getText().then((value) => {
          arr.push(value);
          return arr;
        });
      });
    });
  }

  sortColumn(columnIndex): void {
    element(by.xpath('//th[' + columnIndex + ']/button')).click();
  }

  getcolumnIndex(columnLabel) {
    return element.all(by.xpath('//table//th/button[translate(normalize-space(text()), " ", "") = "Id"]/../preceding-sibling::*')).count().then((totalPrecedingSibling) => {
      return totalPrecedingSibling + 1;
    })
  }

  getRecordCount(): any {
    return this.countLabel.getText();
  }

  getCurrentPageNumber(): any {
    return element(by.xpath("//li[contains(@class,'pagination-page page-item active')]/a"));
  }

  checkIfNavigationButtonDisabled(navigationButtonText): any {
    return element(by.xpath("//a[contains(text(),'" + navigationButtonText + "')]/parent::*[contains(@class,'disabled')]")).isPresent().then((isDisabled) => {
      return isDisabled;
    });
  }

  calculatePagingNumber(total: number, numberOfRecordsOnEachPage: number): number {
    if (total <= numberOfRecordsOnEachPage) {
      return 1;
    }
    else {
      return Math.ceil(total / numberOfRecordsOnEachPage);
    }
  }

  getNumberOfPagesOnScreen(): any {
    return element(by.xpath('//li[contains(@class,"pagination-page page-item")][last()]')).getText().then((text) => {
      return parseInt(text);
    })
  }

  filter(columnLabel: string, searchValue): void {
    element(by.xpath('//*[@id="fieldSelect"]/option[text()="' + columnLabel + '"]')).click();
    element(by.xpath('//*[@id="filterType"]/option[text()="="]')).click();
    element(by.xpath('//*[@id="inputDebounce"]/input')).clear();
    element(by.xpath('//*[@id="inputDebounce"]/input')).sendKeys(searchValue);
  }

  setNumberOfRecordsPerPage(numberOfRecords): void {
    this.recordsPerPageInput.clear();
    this.recordsPerPageInput.sendKeys(numberOfRecords);
    this.getButton.click();
  }

  swapArrayItems(arr, itemIndex1, itemIndex2): void {
    let temp = arr[itemIndex1];
    arr[itemIndex1] = arr[itemIndex2];
    arr[itemIndex2] = temp;
    return arr;
  }
}
