
import { browser, by, element } from 'protractor';
import { AdminView } from '../admin.view';
import { TenantListView } from './tenant-list.view';
import { e2eHelper } from '../common/e2eHelper';

describe('Admin', () => {
  describe('As an admin user, I', () => {
    let helper = new e2eHelper();
    let adminView = new AdminView();
    let tenantListView = new TenantListView();

    beforeEach(() => {
      adminView.goToAdminView();
      adminView.goToTenantView();
    });

    it('can control paging', () => {
      let defaultNumberOfRecordsPerPage = 5;

      tenantListView.getRecordCount().then((recordCount) => {
        // Set paging number equal to total records so as to contain all records on 1 page
        tenantListView.setNumberOfRecordsPerPage(recordCount);
        tenantListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(1);
        });

        // Use default paging number and check if total pages are generated correctly 
        tenantListView.setNumberOfRecordsPerPage(defaultNumberOfRecordsPerPage);
        tenantListView.getNumberOfPagesOnScreen().then((totalPages) => {
          expect(totalPages).toEqual(tenantListView.calculatePagingNumber(recordCount, defaultNumberOfRecordsPerPage));
        });
      });
    })

    it('can sort records', () => {
      let columnLabel = "Id";
      tenantListView.getcolumnIndex(columnLabel).then((columnIndex) => {
        let arrBeforeSorting = [];
        let arrAfterSorting = [];

        tenantListView.sortColumn(columnIndex);

        // Get values of first and last records of a field before doing sorting records again
        tenantListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrBeforeSorting = arr;
        });

        // Sort records again
        tenantListView.sortColumn(columnIndex);

        // Get values of first and last records of that same field again
        tenantListView.getFirstAndLastRecordValues(columnIndex).then((arr) => {
          arrAfterSorting = arr;

          // Swap 2 items in the array (reverse the order of the array items)
          tenantListView.swapArrayItems(arrBeforeSorting, 0, 1);
          expect(arrBeforeSorting).toEqual(arrAfterSorting);
        });
      });
    });
  });
});
