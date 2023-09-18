import { TagColor } from '../../enums/tagColor';

export interface TagCreateDto {
  budgetId: number;
  label: string;
  color: TagColor;
}
