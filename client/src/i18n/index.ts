import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enDashboard from "./locales/en/dashboard.json";
import enEvents from "./locales/en/events.json";
import enNews from "./locales/en/news.json";
import enPromo from "./locales/en/promo.json";
import enTables from "./locales/en/tables.json";
import enValidation from "./locales/en/validation.json";

import ruCommon from "./locales/ru/common.json";
import ruAuth from "./locales/ru/auth.json";
import ruDashboard from "./locales/ru/dashboard.json";
import ruEvents from "./locales/ru/events.json";
import ruNews from "./locales/ru/news.json";
import ruPromo from "./locales/ru/promo.json";
import ruTables from "./locales/ru/tables.json";
import ruValidation from "./locales/ru/validation.json";

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    events: enEvents,
    news: enNews,
    promo: enPromo,
    tables: enTables,
    validation: enValidation,
  },
  ru: {
    common: ruCommon,
    auth: ruAuth,
    dashboard: ruDashboard,
    events: ruEvents,
    news: ruNews,
    promo: ruPromo,
    tables: ruTables,
    validation: ruValidation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "auth", "dashboard", "events", "news", "promo", "tables", "validation"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
