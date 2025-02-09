module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:sonarjs/recommended"
  ],
  "ignorePatterns": [
    'node_modules',
    '**/*.spec.ts',
    'features',
    'dist/**/*',
    ".idea",
    ".nyc_output",
    "index.ts",
    "deprecated-migrations",
    "migrations",
  ],
  "parser": "@typescript-eslint/parser",
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  "plugins": [
    "eslint-plugin-unicorn",
    "sonarjs",
    "eslint-plugin-import",
    "eslint-plugin-jsdoc",
    "eslint-plugin-prefer-arrow",
    "@typescript-eslint"
  ],
  "root": true,
  "rules": {
    "linebreak-style": [0],
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
    "@typescript-eslint/unbound-method": [0],
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
    "@typescript-eslint/quotes": [
      "error",
      "single",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "array-simple"
      }
    ],
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/consistent-type-assertions": "error",
    "@typescript-eslint/dot-notation": "error",
    "@typescript-eslint/explicit-module-boundary-types": [
      "error",
      {
        "allowArgumentsExplicitlyTypedAsAny": true,
        "allowDirectConstAssertionInArrowFunctions": true,
        "allowHigherOrderFunctions": false,
        "allowTypedFunctionExpressions": false
      }
    ],
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": false
        },
        "overrides": {
          "interface": {
            "multiline": {
              "delimiter": "semi",
              "requireLast": true
            },
            "singleline": {
              "delimiter": "semi",
              "requireLast": true
            },
          }
        }
      }
    ],
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": [
          "camelCase",
          "PascalCase",
          "UPPER_CASE"
        ],
        "leadingUnderscore": "allow",
        "trailingUnderscore": "allow"
      }
    ],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-shadow": [
      "error",
      {
        "hoist": "all"
      }
    ],
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/quotes": [
      "error",
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/semi": [
      "error",
      "always"
    ],
    "@typescript-eslint/triple-slash-reference": [
      "error",
      {
        "path": "always",
        "types": "prefer-import",
        "lib": "always"
      }
    ],
    "@typescript-eslint/type-annotation-spacing": "off",
    "@typescript-eslint/typedef": [
      "error",
      {
        "parameter": true,
        "propertyDeclaration": true,
        "objectDestructuring": true,
        "arrayDestructuring": true
      }
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/unified-signatures": "error",
    "arrow-parens": [
      "off",
      "always"
    ],
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "complexity": "off",
    "constructor-super": "error",
    "curly": "error",
    "dot-notation": "off",
    "eol-last": "error",
    "eqeqeq": [
      "error",
      "always"
    ],
    "guard-for-in": "error",
    "id-denylist": "off",
    "id-match": "error",
    "import/no-internal-modules": "off",
    "import/order": "off",
    "indent": "off",
    "jsdoc/check-alignment": "error",
    "jsdoc/check-indentation": "error",
    "jsdoc/newline-after-description": "error",
    "max-classes-per-file": [
      "error",
      1
    ],
    "new-parens": "off",
    "newline-per-chained-call": "off",
    "no-bitwise": [
      "error",
      {
        "allow": ["^", "&", ">>>"]
      }
    ],
    "no-caller": "error",
    "no-cond-assign": "error",
    "no-console": "error",
    "no-debugger": "error",
    "no-duplicate-imports": "error",
    "no-empty": "off",
    "no-empty-function": "off",
    "no-eval": "error",
    "no-extra-semi": "off",
    "no-fallthrough": "off",
    "no-invalid-this": "off",
    "no-irregular-whitespace": "off",
    "no-multiple-empty-lines": "off",
    "no-new-wrappers": "error",
    "no-return-await": "error",
    "no-shadow": "off",
    "no-throw-literal": "error",
    "no-trailing-spaces": "off",
    "no-undef-init": "error",
    "no-unsafe-finally": "error",
    "no-unused-expressions": "off",
    "no-unused-labels": "error",
    "no-use-before-define": "off",
    "no-var": "error",
    "object-shorthand": "off",
    "one-var": [
      "error",
      "never"
    ],
    "padded-blocks": [
      "off",
      {
        "blocks": "never"
      },
      {
        "allowSingleLineBlocks": true
      }
    ],
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": "return"
      }
    ],
    "prefer-const": "error",
    "quote-props": "off",
    "quotes": "off",
    "radix": "error",
    "require-await": "off",
    "semi": "off",
    "sonarjs/cognitive-complexity": ["error", 36],
    "sonarjs/no-duplicate-string": [
      "error",
      5
    ],
    "space-before-function-paren": "off",
    "space-in-parens": [
      "off",
      "never"
    ],
    "spaced-comment": [
      "error",
      "always",
      {
        "markers": [
          "/"
        ]
      }
    ],
    "unicorn/filename-case": [
      "error",
      {
        "case": "kebabCase"
      }
    ],
    "use-isnan": "error",
    "valid-typeof": "off"
  }
};
