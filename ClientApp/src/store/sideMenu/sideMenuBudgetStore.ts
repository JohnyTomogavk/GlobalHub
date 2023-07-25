import { makeAutoObservable } from 'mobx';
import { BudgetMap } from '../../dto/sideMenu/budgetMap';
import { SideMenuItemModel } from '../../models/shared/sideMenu/sideMenuItemModel';
import styles from '../../components/layout/sideMenu/SideMenu.module.scss';
import { getItemTitleWithOptionsButton } from '../../helpers/sideMenuHelper';
import { getClientItemUrl } from '../../helpers/urlHelper';
import * as ResourceNameConstants from '../../constants/resourceConstants';

class SideMenuBudgetStore {
  sideMenuBudgetItems: SideMenuItemModel[] = [];

  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
  }

  setBudgetMapsToSideMenu(items: BudgetMap[] | undefined): void {
    if (!items) {
      return;
    }

    const budgetItems = items.map(
      (budgetMap): SideMenuItemModel => ({
        className: styles.sideMenuItem,
        title: getItemTitleWithOptionsButton(budgetMap.budgetTitle),
        textTitle: budgetMap.budgetTitle,
        key: getClientItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME, budgetMap.id),
        pageId: budgetMap.id,
      })
    );

    this.sideMenuBudgetItems = [...budgetItems];
  }
}

export default new SideMenuBudgetStore();
