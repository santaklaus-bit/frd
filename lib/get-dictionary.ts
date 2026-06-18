import "server-only";
import { getDictionary as getDbDictionary } from "./content-manager";

const staticDictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  fr: () => import("../dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const safeLocale = (locale === "en" || locale === "fr") ? locale : "fr";

  try {
    // Always start with static dictionary as base
    const staticDict = await staticDictionaries[safeLocale as keyof typeof staticDictionaries]();

    try {
      // Try to merge database values if they exist
      const dbDict = await getDbDictionary(safeLocale);
      if (dbDict && Object.keys(dbDict).length > 0) {
        return { ...staticDict, ...dbDict };
      }
    } catch (error) {
      console.warn(`Failed to get dictionary from database for ${safeLocale}, using static file:`, error);
    }

    // Return static dictionary
    return staticDict;
  } catch (error) {
    console.error(`Failed to load dictionary for ${safeLocale}:`, error);
    return {};
  }
};
