
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { DefaultValidationListView } from './default-validation-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let defaultValidationListView = new DefaultValidationListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToDefaultValidationView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      defaultValidationListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        defaultValidationListView.setNumberOfRecordsPerPage(recordCount);
        defaultValidationListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        defaultValidationListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        defaultValidationListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(defaultValidationListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      defaultValidationListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        defaultValidationListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        defaultValidationListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        defaultValidationListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        defaultValidationListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          defaultValidationListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
