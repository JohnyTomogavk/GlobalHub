import { autorun, makeAutoObservable } from 'mobx';
import { DEFAULT_LANGUAGE, EN, RU } from '../constants/languagesConstants';
import { getItem, setItem } from '../helpers/localStorageHelper';
import { IS_DARK_THEME_SAVED_STORE_KEY, LANGUAGE_STORE_KEY } from '../constants/uiConfigConstants';

class UiConfigStore {
  currentLanguage = DEFAULT_LANGUAGE;
  isDarkTheme = false;

  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );

    autorun(() => {
      this.initializeTheme();
      this.initializeLanguage();
    });
  }

  toggleTheme(): void {
    const newThemeValue = !this.isDarkTheme;
    this.isDarkTheme = newThemeValue;
    setItem(IS_DARK_THEME_SAVED_STORE_KEY, String(newThemeValue));
  }

  setLanguage(newLanguage: string): void {
    this.currentLanguage = newLanguage;
    setItem(LANGUAGE_STORE_KEY, newLanguage);
  }

  initializeLanguage(): void {
    const savedLocale = getItem(LANGUAGE_STORE_KEY) ?? DEFAULT_LANGUAGE;
    this.currentLanguage = savedLocale === EN ? EN : RU;
  }

  initializeTheme(): void {
    this.isDarkTheme = getItem(IS_DARK_THEME_SAVED_STORE_KEY) === 'true';
  }
}

export default new UiConfigStore();
