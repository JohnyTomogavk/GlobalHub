import { DataNode } from 'antd/es/tree';
import { Key } from 'antd/lib/table/interface';

export interface SideMenuItemModel extends DataNode {
  pageId: Key;
  textTitle?: string;
}
