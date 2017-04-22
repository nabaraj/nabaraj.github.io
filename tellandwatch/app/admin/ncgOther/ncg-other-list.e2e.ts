
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { NcgOtherListView } from './ncg-other-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let ncgOtherListView = new NcgOtherListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToNcgOtherView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      ncgOtherListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        ncgOtherListView.setNumberOfRecordsPerPage(recordCount);
        ncgOtherListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        ncgOtherListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        ncgOtherListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(ncgOtherListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      ncgOtherListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        ncgOtherListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        ncgOtherListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        ncgOtherListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        ncgOtherListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          ncgOtherListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
