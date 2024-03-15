import { EntityType } from '../../enums/entityType';

export interface BaseSearchItem {
  entityType: EntityType;
  highlight?: string;
}
