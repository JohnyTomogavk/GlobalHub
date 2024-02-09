import { TagColor } from '../../enums/shared/tagColor';

export interface TagDto {
  id: number;
  label: string;
  color: TagColor;
}
