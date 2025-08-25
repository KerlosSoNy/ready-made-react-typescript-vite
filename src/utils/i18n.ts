import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from './languages/en.json';
import ar from './languages/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

let savedLang = window.localStorage.getItem("lang");

if (!savedLang) {
  savedLang = "ar";
  window.localStorage.setItem("lang", savedLang);
}

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: savedLang,
    interpolation: { escapeValue: false },
  });

export default i18next;


// Function to change the language and update the document's language attribute
// Also updates the font based on the language
export const changeLanguage = (lang: string) => {
  i18next.changeLanguage(lang);
  window.localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  if (lang === "ar") {
    document.documentElement.classList.remove("font-poppins");
    document.documentElement.classList.add("font-almarai");
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.classList.add("font-poppins");
    document.documentElement.classList.remove("font-almarai");
    document.documentElement.dir = "ltr";
  }
};

// Get the browser language
export const getBrowserLanguage = () => {
  const lang = navigator.language ;
  return lang.startsWith("en") ? "en" : "ar";
}