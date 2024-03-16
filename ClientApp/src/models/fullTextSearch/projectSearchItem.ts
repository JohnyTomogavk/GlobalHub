import { BaseSearchItem } from './baseSearchItem';

export interface ProjectSearchItem extends BaseSearchItem {
  title: string;
  projectId: number;
}
