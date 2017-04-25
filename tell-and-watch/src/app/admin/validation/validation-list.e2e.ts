
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { ValidationListView } from './validation-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let validationListView = new ValidationListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToValidationView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      validationListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        validationListView.setNumberOfRecordsPerPage(recordCount);
        validationListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        validationListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        validationListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(validationListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      validationListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        validationListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        validationListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        validationListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        validationListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          validationListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
