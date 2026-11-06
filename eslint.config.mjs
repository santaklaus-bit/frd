import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
export default [
  ...nextVitals,
  ...nextTypescript,
  { ignores: ["reference/**", ".next/**", "out/**"] },
  {
    files: [
      "src/components/admin/**/*.tsx",
      "src/components/cms/ArticleBody.tsx",
    ],
    rules: { "@next/next/no-img-element": "off" },
  },
];
