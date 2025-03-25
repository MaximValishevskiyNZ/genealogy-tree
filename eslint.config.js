import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true }, // Поддержка JSX
        sourceType: "module",
      },
    },
    plugins: {
      react: pluginReact, // Явно подключаем плагин React
      "@typescript-eslint": tseslint, // Подключаем TypeScript плагин
    },
    rules: {
      ...js.configs.recommended.rules, // Рекомендованные правила для JS
      ...tseslint.configs.recommended.rules, // Рекомендованные правила для TS
      ...pluginReact.configs.recommended.rules, // Рекомендованные правила для React
      // Дополнительные настройки правил, если нужно
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "no-unused-vars": "off"
    },
    settings: {
      react: {
        version: "detect", // Автоопределение версии React
      },
    },
  },
];