import { DataNode } from 'antd/es/tree';
import { Key } from 'antd/lib/table/interface';
import { EntityType } from '../../../enums/entityType';

export interface SideMenuItemModel extends DataNode {
  pageId: Key;
  textTitle?: string;
  entityType: EntityType;
}
