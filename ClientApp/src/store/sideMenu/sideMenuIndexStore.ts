import SideMenuBudgetStore from './sideMenuBudgetStore';
import SideMenuNoteStore from './sideMenuNoteStore';
import SideMenuCommonStore from './sideMenuCommonStore';
import { SideMenuItemModel } from '../../models/shared/sideMenu/sideMenuItemModel';
import { makeAutoObservable } from 'mobx';
import SideMenuProjectsStore from './sideMenuProjectsStore';

class SideMenuIndexStore {
  public budgetStore: SideMenuBudgetStore;
  public notesStore: SideMenuNoteStore;
  public projectsStore: SideMenuProjectsStore;
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
    this.projectsStore = new SideMenuProjectsStore();
    this.commonSideMenuStore = new SideMenuCommonStore();
  }

  get sideMenuItems(): SideMenuItemModel[] {
    return [
      ...this.notesStore.sideMenuNoteItems,
      ...this.budgetStore.sideMenuBudgetItems,
      ...this.projectsStore.sideMenuProjectItems,
    ];
  }
}

export default new SideMenuIndexStore();
