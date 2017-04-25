
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { NcgTypeAndFormatListView } from './ncg-type-and-format-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let ncgTypeAndFormatListView = new NcgTypeAndFormatListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToNcgTypeAndFormatView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      ncgTypeAndFormatListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        ncgTypeAndFormatListView.setNumberOfRecordsPerPage(recordCount);
        ncgTypeAndFormatListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        ncgTypeAndFormatListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        ncgTypeAndFormatListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(ncgTypeAndFormatListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      ncgTypeAndFormatListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        ncgTypeAndFormatListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        ncgTypeAndFormatListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        ncgTypeAndFormatListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        ncgTypeAndFormatListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          ncgTypeAndFormatListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
