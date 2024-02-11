import { ProjectDto } from '../projectDto';
import { TagColor } from '../../../enums/shared/tagColor';

export interface ProjectTagDto {
  id: number;
  label: string;
  color: TagColor;
  projectId: number;
  project?: ProjectDto;
}
