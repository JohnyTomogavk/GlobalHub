import { SideMenuItemModel } from '../../models/shared/sideMenu/sideMenuItemModel';
import { makeAutoObservable } from 'mobx';
import styles from '../../components/layout/sideMenu/SideMenu.module.scss';
import { getSecondaryLevelItemTitle } from '../../helpers/sideMenuHelper';
import { EntityType } from '../../enums/entityType';
import { getClientItemUrl } from '../../helpers/urlHelper';
import * as ResourceNameConstants from '../../constants/resourceConstants';
import { ProjectDto } from '../../dto/projects/projectDto';
import { Key } from 'antd/lib/table/interface';

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
      title: getSecondaryLevelItemTitle(item.title, EntityType.Project),
      textTitle: item.title,
      key: getClientItemUrl(ResourceNameConstants.PROJECT_RESOURCE_NAME, item.id),
      entityType: EntityType.Project,
    });
  }

  renameProject(itemId: number, newTitle: string): void {
    const newTitleElement = getSecondaryLevelItemTitle(newTitle, EntityType.Project);

    this.sideMenuProjectItems = this.sideMenuProjectItems.map((item) => {
      if (item.pageId === itemId) {
        item.title = newTitleElement;
        item.textTitle = newTitle;
      }

      return item;
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

  removeFromSideMenu(itemId: Key): void {
    this.sideMenuProjectItems = this.sideMenuProjectItems.filter((item) => item.pageId !== itemId);
  }
}

export default SideMenuProjectsStore;
