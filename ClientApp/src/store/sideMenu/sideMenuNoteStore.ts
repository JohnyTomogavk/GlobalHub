import { makeAutoObservable } from 'mobx';
import { SideMenuItemModel } from '../../models/shared/sideMenu/sideMenuItemModel';
import { Key } from 'antd/lib/table/interface';
import styles from '../../components/layout/sideMenu/SideMenu.module.scss';
import { getSecondaryLevelItemTitle } from '../../helpers/sideMenuHelper';
import { getClientItemUrl } from '../../helpers/urlHelper';
import * as ResourceNameConstants from '../../constants/resourceConstants';
import { NoteMap } from '../../dto/sideMenu/noteMap';
import { Note } from '../../entities/notes/note';

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

    this.sideMenuNoteItems = items.map(
      (noteMap): SideMenuItemModel => ({
        className: styles.sideMenuItem,
        title: getSecondaryLevelItemTitle(noteMap.title),
        textTitle: noteMap.title,
        key: getClientItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME, noteMap.id),
        pageId: noteMap.id,
      })
    );
  }

  addNewNoteToSideMenu(item: Note): void {
    this.sideMenuNoteItems.push({
      className: styles.sideMenuItem,
      title: getSecondaryLevelItemTitle(item.title),
      textTitle: item.title,
      key: getClientItemUrl(ResourceNameConstants.NOTE_RESOURCE_NAME, item.id),
      pageId: item.id,
    });
  }

  renameNoteInSideMenu(itemId: Key, newTitle: string): void {
    const newTitleElement = getSecondaryLevelItemTitle(newTitle);

    this.sideMenuNoteItems = this.sideMenuNoteItems.map((item) => {
      if (item.pageId === itemId) {
        item.title = newTitleElement;
        item.textTitle = newTitle;
      }

      return item;
    });
  }

  removeNoteFromSideMenu(itemId: Key): void {
    this.sideMenuNoteItems = this.sideMenuNoteItems.filter((item) => item.pageId !== itemId);
  }
}

export default SideMenuNoteStore;
