module.exports = {
  "extends": "./node_modules/@pe/dev-kit/.eslintrc.js",
  "ignorePatterns": ["node_modules", "tests", "migrations", "dist", "features", "e2e", "**/*.spec.ts", "**/*.d.ts"],
  "parserOptions": {
    "project": "tsconfig.lint.json"
  },
  "rules": {
    "max-len": [
      "error",
      {
        "code": 120,
        "ignoreStrings": true,
        "ignoreUrls": true,
        "ignoreTrailingComments": true,
        "ignoreComments": true,
        "ignoreRegExpLiterals": true,
        "ignorePattern": "^((\\s+)?(.+)?)?([`'\"])((\\s+)?(.+)?)?([`'\"])((s+)?(.+)?)?$",
      },
    ],
    "@typescript-eslint/unbound-method": [
      "error",
      { "ignoreStatic": true }
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    "@typescript-eslint/quotes": [
      "error",
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true,
      }
    ],
    "@typescript-eslint/indent": [
      "off",
      2,
      {
        "SwitchCase": 1,
        "CallExpression": {
            "arguments": "first"
        },
        "FunctionDeclaration": {
            "parameters": "first"
        },
        "FunctionExpression": {
            "parameters": "first"
        }
      }
    ],
  }
}
