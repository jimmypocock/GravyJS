export default [
  {
    files: ["src/**/*.js", "src/**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        alert: "readonly",
        prompt: "readonly",
        navigator: "readonly",
        ClipboardItem: "readonly",
        Blob: "readonly",
        Node: "readonly",
        HTMLElement: "readonly",
        process: "readonly"
      }
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double", { "allowTemplateLiterals": true }],
      "comma-dangle": ["error", "always-multiline"],
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^React$",
        "ignoreRestSiblings": true
      }],
      "no-console": ["warn", { "allow": ["warn", "error"] }]
    }
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        test: "readonly",
        global: "readonly"
      }
    }
  },
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "demo/**", "*.config.js", "rollup.config.js"]
  }
];