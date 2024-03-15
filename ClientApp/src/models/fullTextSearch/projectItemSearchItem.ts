import { BaseSearchItem } from './baseSearchItem';

export interface ProjectItemSearchItem extends BaseSearchItem {
  projectItemTitle: string;
  projectTitle: string;
  projectItemId: number;
  projectId: number;
}
