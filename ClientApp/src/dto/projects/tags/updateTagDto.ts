import { TagColor } from '../../../enums/shared/tagColor';

export interface UpdateTagDto {
  id: number;
  label: string;
  color: TagColor;
  projectId: number;
}
