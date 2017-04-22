
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { SomeItemListView } from './some-item-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let someItemListView = new SomeItemListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToSomeItemView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      someItemListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        someItemListView.setNumberOfRecordsPerPage(recordCount);
        someItemListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        someItemListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        someItemListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(someItemListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      someItemListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        someItemListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        someItemListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        someItemListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        someItemListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          someItemListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
