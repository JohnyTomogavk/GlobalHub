import { makeAutoObservable } from 'mobx';
import { BudgetMap } from '../../dto/sideMenu/budgetMap';
import { SideMenuItemModel } from '../../models/shared/sideMenu/sideMenuItemModel';
import styles from '../../components/layout/sideMenu/SideMenu.module.scss';
import { getSecondaryLevelItemTitle } from '../../helpers/sideMenuHelper';
import { getClientItemUrl } from '../../helpers/urlHelper';
import * as ResourceNameConstants from '../../constants/resourceConstants';
import { Key } from 'antd/lib/table/interface';
import { EntityType } from '../../enums/entityType';

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
      title: getSecondaryLevelItemTitle(item.budgetTitle, EntityType.Budget),
      textTitle: item.budgetTitle,
      key: getClientItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME, item.id),
      entityType: EntityType.Budget,
    });
  }

  setBudgetMapsToSideMenu(items: BudgetMap[]): void {
    this.sideMenuBudgetItems = items.map(
      (budgetMap): SideMenuItemModel => ({
        className: styles.sideMenuItem,
        title: getSecondaryLevelItemTitle(budgetMap.budgetTitle, EntityType.Budget),
        textTitle: budgetMap.budgetTitle,
        key: getClientItemUrl(ResourceNameConstants.BUDGET_RESOURCE_NAME, budgetMap.id),
        pageId: budgetMap.id,
        entityType: EntityType.Budget,
      })
    );
  }

  renameBudget(itemId: number, newTitle: string): void {
    const newTitleElement = getSecondaryLevelItemTitle(newTitle, EntityType.Budget);

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
