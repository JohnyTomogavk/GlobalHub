import { makeAutoObservable } from 'mobx';
import { SideMenuItemModel } from '../../models/shared/sideMenu/sideMenuItemModel';
import { Key } from 'antd/lib/table/interface';
import styles from '../../components/layout/sideMenu/SideMenu.module.scss';
import { getItemTitleWithOptionsButton } from '../../helpers/sideMenuHelper';
import { getClientItemUrl } from '../../helpers/urlHelper';
import * as ResourceNameConstants from '../../constants/resourceConstants';
import { NoteMap } from '../../dto/sideMenu/noteMap';
import { Note } from '../../models/notes/note';

class SideMenuNoteStore {
  sideMenuNoteItems: SideMenuItemModel[] = [];

  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
  }

  setNoteMapsItemsToSideMenu(items: NoteMap[] | undefined): void {
    if (!items) {
      return;
    }

    const noteItems = items.map(
      (noteMap): SideMenuItemModel => ({
        className: styles.sideMenuItem,
        title: getItemTitleWithOptionsButton(noteMap.title),
        textTitle: noteMap.title,
        key: getClientItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME, noteMap.id),
        pageId: noteMap.id,
      })
    );

    this.sideMenuNoteItems = [...noteItems];
  }

  addNewNoteToSideMenu(item: Note): void {
    const newNoteItem = {
      className: styles.sideMenuItem,
      title: getItemTitleWithOptionsButton(item.title),
      textTitle: item.title,
      key: getClientItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME, item.id),
      pageId: item.id,
    };

    this.sideMenuNoteItems.push(newNoteItem);
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

  getSideMenuItemByRoutingKey(routingKey: string): SideMenuItemModel | undefined {
    return this.sideMenuNoteItems.find((item) => item.key === routingKey);
  }
}

export default new SideMenuNoteStore();
