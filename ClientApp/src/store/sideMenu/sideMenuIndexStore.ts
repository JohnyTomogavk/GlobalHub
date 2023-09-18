import SideMenuBudgetStore from './sideMenuBudgetStore';
import SideMenuNoteStore from './sideMenuNoteStore';
import SideMenuCommonStore from './sideMenuCommonStore';

class SideMenuIndexStore {
  public budgetStore: SideMenuBudgetStore;
  public notesStore: SideMenuNoteStore;
  public commonSideMenuStore: SideMenuCommonStore;

  constructor() {
    this.notesStore = new SideMenuNoteStore();
    this.commonSideMenuStore = new SideMenuCommonStore();
    this.budgetStore = new SideMenuBudgetStore();
  }
}

export default new SideMenuIndexStore();
