import { makeAutoObservable } from 'mobx';
import { EN } from '../constants/languagesConstants';

class CommonStore {
  currentLanguage = EN;
  isDarkTheme = false;

  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
  }

  setLanguage(newLanguage: string): void {
    this.currentLanguage = newLanguage;
  }
}

export default new CommonStore();
