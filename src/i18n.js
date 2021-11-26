import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import common_en from "./translations/en.json";
import common_az from "./translations/az.json"

// the translations
const resources = {
  en: {
    translation: common_en
  },
  az: {
    translation: common_az
  }

};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
