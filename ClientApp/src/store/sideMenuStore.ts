import { makeAutoObservable } from 'mobx';
import { SideMenuItemModel } from '../models/shared/sideMenu/sideMenuItemModel';
import { Key } from 'antd/lib/table/interface';

class SideMenuStore {
  sideMenuNoteItems: SideMenuItemModel[] = [];

  selectedTreeKeys: Key[] = [];

  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
  }

  setNotesItemsToSideMenu(items: SideMenuItemModel[]): void {
    this.sideMenuNoteItems = [...items];
  }

  addNewNoteToSideMenu(item: SideMenuItemModel): void {
    this.sideMenuNoteItems.push(item);
  }

  renameNoteInSideMenu(itemId: Key, newTitle: JSX.Element): void {
    this.sideMenuNoteItems = this.sideMenuNoteItems.map((item) => {
      if (item.pageId === itemId) {
        item.title = newTitle;
      }

      return item;
    });
  }

  removeNoteFromSideMenu(itemId: Key): void {
    this.sideMenuNoteItems = this.sideMenuNoteItems.filter((item) => item.pageId !== itemId);
  }

  changeSelectedMenuKey(keys: Key[]): void {
    this.selectedTreeKeys = keys;
  }

  getSideMenuItemByRoutingKey(routingKey: string): SideMenuItemModel | undefined {
    return this.sideMenuNoteItems.find((item) => item.key === routingKey);
  }
}

export default new SideMenuStore();
