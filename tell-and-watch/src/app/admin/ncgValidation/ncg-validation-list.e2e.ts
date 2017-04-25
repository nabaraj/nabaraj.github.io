
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { NcgValidationListView } from './ncg-validation-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let ncgValidationListView = new NcgValidationListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToNcgValidationView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      ncgValidationListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        ncgValidationListView.setNumberOfRecordsPerPage(recordCount);
        ncgValidationListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        ncgValidationListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        ncgValidationListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(ncgValidationListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      ncgValidationListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        ncgValidationListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        ncgValidationListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        ncgValidationListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        ncgValidationListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          ncgValidationListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
