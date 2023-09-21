import SideMenuBudgetStore from './sideMenuBudgetStore';
import SideMenuNoteStore from './sideMenuNoteStore';
import SideMenuCommonStore from './sideMenuCommonStore';
import { SideMenuItemModel } from '../../models/shared/sideMenu/sideMenuItemModel';
import { makeAutoObservable } from 'mobx';

class SideMenuIndexStore {
  public budgetStore: SideMenuBudgetStore;
  public notesStore: SideMenuNoteStore;
  public commonSideMenuStore: SideMenuCommonStore;

  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );

    this.budgetStore = new SideMenuBudgetStore();
    this.notesStore = new SideMenuNoteStore();
    this.commonSideMenuStore = new SideMenuCommonStore();
  }

  get sideMenuItems(): SideMenuItemModel[] {
    return [...this.notesStore.sideMenuNoteItems, ...this.budgetStore.sideMenuBudgetItems];
  }

  getSideMenuItemByRoutingPath(routingPath: string): SideMenuItemModel | undefined {
    return this.sideMenuItems.find((item) => item.key === routingPath);
  }
}

export default new SideMenuIndexStore();
