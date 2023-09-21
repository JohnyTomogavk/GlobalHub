import { makeAutoObservable } from 'mobx';
import { BudgetMap } from '../../dto/sideMenu/budgetMap';
import { SideMenuItemModel } from '../../models/shared/sideMenu/sideMenuItemModel';
import styles from '../../components/layout/sideMenu/SideMenu.module.scss';
import { getSecondaryLevelItemTitle } from '../../helpers/sideMenuHelper';
import { getClientItemUrl } from '../../helpers/urlHelper';
import * as ResourceNameConstants from '../../constants/resourceConstants';
import { Key } from 'antd/lib/table/interface';

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

  addBudgetToSideMenu(item: BudgetMap): void {
    this.sideMenuBudgetItems.push({
      pageId: item.id,
      className: styles.sideMenuItem,
      title: getSecondaryLevelItemTitle(item.budgetTitle),
      textTitle: item.budgetTitle,
      key: getClientItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME, item.id),
    });
  }

  setBudgetMapsToSideMenu(items: BudgetMap[] | undefined): void {
    if (!items) {
      return;
    }

    this.sideMenuBudgetItems = items.map(
      (budgetMap): SideMenuItemModel => ({
        className: styles.sideMenuItem,
        title: getSecondaryLevelItemTitle(budgetMap.budgetTitle),
        textTitle: budgetMap.budgetTitle,
        key: getClientItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME, budgetMap.id),
        pageId: budgetMap.id,
      })
    );
  }

  renameBudget(itemId: number, newTitle: string): void {
    const newTitleElement = getSecondaryLevelItemTitle(newTitle);

    this.sideMenuBudgetItems = this.sideMenuBudgetItems.map((item) => {
      if (item.pageId === itemId) {
        item.title = newTitleElement;
        item.textTitle = newTitle;
      }

      return item;
    });
  }

  removeBudget(itemId: Key): void {
    this.sideMenuBudgetItems = this.sideMenuBudgetItems.filter((item) => item.pageId !== itemId);
  }
}

export default SideMenuBudgetStore;
