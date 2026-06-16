import "server-only";
import { getDictionary as getDbDictionary } from "./content-manager";

const staticDictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  fr: () => import("../dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const safeLocale = (locale === "en" || locale === "fr") ? locale : "fr";

  try {
    // Try to get from database first
    const dbDict = await getDbDictionary(safeLocale);
    if (dbDict && Object.keys(dbDict).length > 0) {
      return dbDict;
    }
  } catch (error) {
    console.warn(`Failed to get dictionary from database for ${safeLocale}, falling back to static file:`, error);
  }

  // Fallback to static JSON files
  return staticDictionaries[safeLocale as keyof typeof staticDictionaries]();
};
