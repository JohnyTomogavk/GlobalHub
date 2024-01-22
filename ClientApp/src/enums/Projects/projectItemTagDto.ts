import { ProjectItemDto } from '../../dto/projects/projectItemDto';
import { ProjectTagDto } from '../../dto/projects/projectTagDto';

export interface ProjectItemTagDto {
  id: number;
  projectItemId: number;
  projectItem?: ProjectItemDto;
  tagId: number;
  tag?: ProjectTagDto;
}
