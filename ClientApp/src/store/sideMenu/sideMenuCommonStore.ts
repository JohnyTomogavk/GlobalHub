import { makeAutoObservable } from 'mobx';
import { Key } from 'antd/lib/table/interface';

class SideMenuCommonStore {
  selectedTreeKeys: Key[] = [];

  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
  }

  changeSelectedMenuKey(keys: Key[]): void {
    this.selectedTreeKeys = keys;
  }
}

export default SideMenuCommonStore;
