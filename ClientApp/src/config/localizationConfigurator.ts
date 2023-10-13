import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../../public/locales/en.json';
import ruTranslations from '../../public/locales/ru.json';
import { EN, RU } from '../constants/languagesConstants';

const languageResources = {
  [EN]: {
    translation: enTranslations,
  },
  [RU]: {
    translation: ruTranslations,
  },
};
export const initLocales = (initLang: string): void => {
  i18n.use(initReactI18next).init({
    resources: languageResources,
    lng: initLang,
    fallbackLng: RU,
    interpolation: {
      escapeValue: false,
    },
  });
};

export default i18n;
