module.exports = {
  extends: "./node_modules/@pe/dev-kit/.eslintrc.js",
  ignorePatterns: [
    "node_modules",
    "tests",
    "deprecated-migrations",
    "migrations",
    "dist",
    "fixtures",
    "features",
    "**/*.spec.ts",
    "**/*.d.ts",
    "pact.publish.ts",
    "<tsconfigRootDir>/index.ts",
  ],
  rules: {
    "sonarjs/prefer-single-boolean-return": "off",
    "max-len": [
      "error",
      {
        code: 120,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreTrailingComments: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignorePattern:
          "^((\\s+)?(.+)?)?([`'\"])((\\s+)?(.+)?)?([`'\"])((s+)?(.+)?)?$",
      },
    ],
    "brace-style": [
        "error",
        "1tbs",
        {
          "allowSingleLine": true
        }
    ],
    "@typescript-eslint/quotes": [
      "error",
      "single",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    "@typescript-eslint/indent": [
      "off",
      2,
      {
        SwitchCase: 1,
        CallExpression: {
          arguments: "first",
        },
        FunctionDeclaration: {
          parameters: "first",
        },
        FunctionExpression: {
          parameters: "first",
        },
      },
    ],
    "@typescript-eslint/tslint/config": [
      "error",
      {
        "rules": {
          "encoding": true,
          "import-spacing": true,
          "object-literal-sort-keys": false,
          "whitespace": [
            true,
            "check-branch",
            "check-decl",
            "check-module",
            "check-operator",
            "check-preblock",
            "check-rest-spread",
            "check-separator",
            "check-type",
            "check-type-operator",
            "check-typecast"
          ]
        }
      }
    ]
  },
  parserOptions: {
    project: './tsconfig.build.json',
  },
};
