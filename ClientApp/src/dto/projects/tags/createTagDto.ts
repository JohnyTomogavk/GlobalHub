import { TagColor } from '../../../enums/shared/tagColor';

export interface CreateTagDto {
  projectId: number;
  label: string;
  color: TagColor;
}
