import { BaseSearchItem } from './baseSearchItem';

export interface NoteSearchItem extends BaseSearchItem {
  title: string;
  noteId: string;
}
