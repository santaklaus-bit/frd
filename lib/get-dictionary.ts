import "server-only";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  fr: () => import("../dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const safeLocale = (locale === "en" || locale === "fr") ? locale : "fr";
  return dictionaries[safeLocale as keyof typeof dictionaries]();
};
