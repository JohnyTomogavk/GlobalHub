import { IHasDate } from '../../interfaces/IHasDate';
import { IHasAuthor } from '../../interfaces/IHasAuthor';
import { ProjectTagDto } from './tags/projectTagDto';
import { ProjectItemDto } from './projectItemDto';

export interface ProjectDto extends IHasDate, IHasAuthor {
  id: number;
  title: string;
  tags?: ProjectTagDto[];
  projectItems?: ProjectItemDto[];
}
