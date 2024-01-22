import { SideMenuItemModel } from '../../models/shared/sideMenu/sideMenuItemModel';
import { makeAutoObservable } from 'mobx';
import styles from '../../components/layout/sideMenu/SideMenu.module.scss';
import { getSecondaryLevelItemTitle } from '../../helpers/sideMenuHelper';
import { EntityType } from '../../enums/entityType';
import { getClientItemUrl } from '../../helpers/urlHelper';
import * as ResourceNameConstants from '../../constants/resourceConstants';
import { ProjectDto } from '../../dto/projects/projectDto';
import { BudgetMap } from '../../dto/sideMenu/budgetMap';

class SideMenuProjectsStore {
  sideMenuProjectItems: SideMenuItemModel[] = [];

  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
  }

  addProject(item: ProjectDto): void {
    this.sideMenuProjectItems.push({
      pageId: item.id,
      className: styles.sideMenuItem,
      title: getSecondaryLevelItemTitle(item.title, EntityType.Budget),
      textTitle: item.title,
      key: getClientItemUrl(ResourceNameConstants.PROJECT_RESOURCE_NAME, item.id),
      entityType: EntityType.Project,
    });
  }

  setProjectsToSideMenu(items: ProjectDto[]): void {
    this.sideMenuProjectItems = items.map(
      (dto): SideMenuItemModel => ({
        className: styles.sideMenuItem,
        title: getSecondaryLevelItemTitle(dto.title, EntityType.Project),
        textTitle: dto.title,
        key: getClientItemUrl(ResourceNameConstants.PROJECT_RESOURCE_NAME, dto.id),
        pageId: dto.id,
        entityType: EntityType.Project,
      })
    );
  }
}

export default SideMenuProjectsStore;
