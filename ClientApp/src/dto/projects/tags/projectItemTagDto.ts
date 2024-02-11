import { ProjectItemDto } from '../projectItemDto';
import { ProjectTagDto } from './projectTagDto';

export interface ProjectItemTagDto {
  id: number;
  projectItemId: number;
  projectItem?: ProjectItemDto;
  tagId: number;
  tag?: ProjectTagDto;
}
