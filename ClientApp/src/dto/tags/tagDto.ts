import { TagColor } from '../../enums/tagColor';

export interface TagDto {
  id: number;
  label: string;
  color: TagColor;
}
