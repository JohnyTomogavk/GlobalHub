import { ProjectDto } from './projectDto';
import { ProjectTagColor } from '../../enums/Projects/projectTagColor';

export interface ProjectTagDto {
  id: number;
  title: string;
  color: ProjectTagColor;
  projectId: number;
  project?: ProjectDto;
}
