module.exports = {
  root: true,
  extends: [
    "airbnb-base",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  rules: {
    indent: ["error", 2],
    // Disallow the use of console.
    // @see https://eslint.org/docs/rules/no-console
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    // Disallow the use of debugger.
    // @see https://eslint.org/docs/rules/no-debugger
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // Disallow reassignment of function parameters.
    // @see https://eslint.org/docs/rules/no-param-reassign
    //   https://github.com/vuejs/eslint-config-airbnb/blob/master/index.js
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: [
          "state", // for vuex state.
          "acc", // for reduce accumulators.
          "e", // for e.returnvalue.
        ],
      },
    ],
    // /////////////////////////////////////////////////////////////////////////
    // `airbnb-base`: Overwrites
    // @see https://github.com/vuejs/eslint-config-airbnb,
    //   https://github.com/airbnb/javascript
    // /////////////////////////////////////////////////////////////////////////

    // Disable `import/no-unresolved`, a peer dependency of `airbnb-base`.
    // @see https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
    "import/no-unresolved": "off",

    // Enforce maximum line length.
    // NOTE: Please keep in sync with the `vue/max-len` rule.
    // @see https://eslint.org/docs/rules/max-len
    "max-len": [
      "error",
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],

    // Enforce the consistent use of either backticks, double, or single quotes.
    // @see https://eslint.org/docs/rules/quotes,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
    quotes: ["error", "double"],


    // /////////////////////////////////////////////////////////////////////////
    // `vue/vue3-recommended`: Overwrites
    // @see https://eslint.vuejs.org/rules/
    // /////////////////////////////////////////////////////////////////////////

    // Enforce consistent indentation in `<template>`.
    // @see https://eslint.vuejs.org/rules/html-indent
    "vue/html-indent": [
      "error",
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],

    // Enforce self-closing style.
    // @see https://eslint.vuejs.org/rules/html-self-closing
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "never",
          normal: "never",
          component: "any",
        },
        svg: "never",
        math: "never",
      },
    ],

    // /////////////////////////////////////////////////////////////////////////
    // `vue/vue3-recommended`: Optional (Uncategorized) Rules
    // @see https://eslint.vuejs.org/rules/#uncategorized
    // /////////////////////////////////////////////////////////////////////////

    // Enforce specific casing for the component naming style in template.
    // @see https://eslint.vuejs.org/rules/component-name-in-template-casing
    "vue/component-name-in-template-casing": [
      "error",
      "kebab-case",
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],

    // Enforce unified line brake in HTML comments.
    // @see https://eslint.vuejs.org/rules/html-comment-content-newline
    "vue/html-comment-content-newline": "error",

    // Enforce unified spacing in HTML comments.
    // @see https://eslint.vuejs.org/rules/html-comment-content-spacing
    "vue/html-comment-content-spacing": "error",

    // Enforce consistent indentation in HTML comments.
    // @see https://eslint.vuejs.org/rules/html-comment-indent
    "vue/html-comment-indent": "error",

    // Enforce `inheritAttrs` to be set to `false` when using `v-bind="$attrs"`.
    // @see https://eslint.vuejs.org/rules/no-duplicate-attr-inheritance
    "vue/no-duplicate-attr-inheritance": "error",

    // Disallow to pass multiple objects into array to class.
    // @see https://eslint.vuejs.org/rules/no-multiple-objects-in-class
    "vue/no-multiple-objects-in-class": "error",

    // Disallow the use of reserved names in component definitions
    // @see https://eslint.vuejs.org/rules/no-reserved-component-names
    "vue/no-reserved-component-names": "error",

    // Disallow `target="_blank"` attribute without `rel="noopener noreferrer`".
    // @see https://eslint.vuejs.org/rules/no-template-target-blank
    "vue/no-template-target-blank": "error",

    // Disallow unused properties.
    // @see https://eslint.vuejs.org/rules/no-unused-properties
    "vue/no-unused-properties": "error",

    // Disallow unnecessary mustache interpolations.
    // @see https://eslint.vuejs.org/rules/no-useless-mustaches
    "vue/no-useless-mustaches": "error",

    // Disallow unnecessary `v-bind` directives.
    // @see https://eslint.vuejs.org/rules/no-useless-v-bind
    "vue/no-useless-v-bind": "error",

    // Require or disallow padding lines between blocks.
    // @see https://eslint.vuejs.org/rules/padding-line-between-blocks
    "vue/padding-line-between-blocks": "error",

    // Require the component to be directly exported.
    // @see https://eslint.vuejs.org/rules/require-direct-export
    "vue/require-direct-export": "error",

    // Require a name property in Vue components.
    // @see https://eslint.vuejs.org/rules/require-name-property
    "vue/require-name-property": "error",

    // Enforce `v-for` directive"s delimiter style.
    // @see https://eslint.vuejs.org/rules/v-for-delimiter-style
    "vue/v-for-delimiter-style": "error",

    // Enforce or forbid parentheses after method calls without arguments in
    // `v-on` directives.
    // @see https://eslint.vuejs.org/rules/v-on-function-call
    "vue/v-on-function-call": ["error", "always"],

    // /////////////////////////////////////////////////////////////////////////
    // `vue/vue3-recommended`: Extension Rules
    //
    // The following rules extend the rules provided by ESLint and applies them
    // to the expressions within the `<template>` block of Vue Single File
    // Components (SFC). The rules" values should match that of `@vue/airbnb`.
    //
    //  @see https://eslint.vuejs.org/rules/#extension-rules
    // /////////////////////////////////////////////////////////////////////////

    // Disallow or enforce spaces inside of brackets.
    // @see https://eslint.vuejs.org/rules/array-bracket-spacing,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/array-bracket-spacing
    "vue/array-bracket-spacing": "error",

    // Require space before/after arrow function"s arrow.
    // @see https://eslint.vuejs.org/rules/arrow-spacing,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/es6.js,
    //   https://eslint.org/docs/rules/arrow-spacing
    "vue/arrow-spacing": "error",

    // Disallow or enforce spaces inside of blocks after opening block and
    // before closing block.
    // @see https://eslint.vuejs.org/rules/block-spacing,
    //   https://eslint.org/docs/rules/block-spacing
    "vue/block-spacing": "error",

    // Require Brace Style.
    // @see https://eslint.vuejs.org/rules/brace-style,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/brace-style
    "vue/brace-style": ["error", "1tbs", { allowSingleLine: true }],

    // Require CamelCase.
    // @see https://eslint.vuejs.org/rules/camelcase.html#vue-camelcase
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/camelcase
    "vue/camelcase": [
      "error",
      { properties: "never", ignoreDestructuring: false },
    ],
    "no-underscore-dangle":  ["error", { "allow": ["_id", "_deleted", "_rev"] }],
    // Require or disallow trailing commas.
    // @see https://eslint.vuejs.org/rules/comma-dangle,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/comma-dangle
    "vue/comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
      },
    ],

    // Enforces spacing around commas.
    // @see https://eslint.vuejs.org/rules/comma-spacing,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/comma-spacing
    "vue/comma-spacing": "error",

    // Comma style.
    // @see https://eslint.vuejs.org/rules/comma-style,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/comma-style
    "vue/comma-style": [
      "error",
      "last",
      {
        exceptions: {
          ArrayExpression: false,
          ArrayPattern: false,
          ArrowFunctionExpression: false,
          CallExpression: false,
          FunctionDeclaration: false,
          FunctionExpression: false,
          ImportDeclaration: false,
          ObjectExpression: false,
          ObjectPattern: false,
          VariableDeclaration: false,
          NewExpression: false,
        },
      },
    ],

    // Enforce newline before and after dot.
    // @see https://eslint.vuejs.org/rules/dot-location,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/best-practices.js,
    //   https://eslint.org/docs/rules/dot-location
    "vue/dot-location": ["error", "property"],

    // Require Dot Notation.
    // @see https://eslint.vuejs.org/rules/dot-notation,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/best-practices.js,
    //   https://eslint.org/docs/rules/dot-notation
    "vue/dot-notation": "error",

    // Require `===` and `!==`.
    // @see https://eslint.vuejs.org/rules/eqeqeq,
    //   https://eslint.org/docs/rules/eqeqeq
    "vue/eqeqeq": ["error", "always", { null: "ignore" }],

    // Require or disallow spacing between function identifiers and their
    // invocations.
    // @see https://eslint.vuejs.org/rules/func-call-spacing,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/func-call-spacing
    "vue/func-call-spacing": "error",

    // Enforce consistent spacing between keys and values in object literal
    // properties.
    // @see https://eslint.vuejs.org/rules/key-spacing,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/key-spacing
    "vue/key-spacing": "error",

    // Enforce consistent spacing before and after keywords.
    // @see https://eslint.vuejs.org/rules/keyword-spacing,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/keyword-spacing
    "vue/keyword-spacing": [
      "error",
      {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      },
    ],

    // Enforce a maximum line length.
    // NOTE: Please keep in sync with the `max-len` rule.
    // @see https://eslint.vuejs.org/rules/max-len,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/max-len
    "vue/max-len": [
      "error",
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],

    // Disallow empty destructuring patterns.
    // @see https://eslint.vuejs.org/rules/no-empty-pattern,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/best-practices.js,
    //   https://eslint.org/docs/rules/no-empty-pattern
    "vue/no-empty-pattern": "error",

    // Disallow unnecessary parentheses.
    // @see https://eslint.vuejs.org/rules/no-extra-parens,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/errors.js,
    //   https://eslint.org/docs/rules/no-extra-parens
    "vue/no-extra-parens": [
      "off",
      "all",
      {
        conditionalAssign: true,
        nestedBinaryExpressions: false,
        returnAssign: false,
        ignoreJSX: "all",
        enforceForArrowConditionals: false,
      },
    ],

    // Disallow irregular whitespace.
    // @see https://eslint.vuejs.org/rules/no-irregular-whitespace,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/errors.js,
    //   https://eslint.org/docs/rules/no-irregular-whitespace
    "vue/no-irregular-whitespace": "error",

    // Disallow specified syntax.
    // @see https://eslint.vuejs.org/rules/no-restricted-syntax,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/no-restricted-syntax
    "vue/no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "ForOfStatement",
        message:
          "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.",
      },
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],

    // Disallow sparse arrays.
    // @see https://eslint.vuejs.org/rules/no-sparse-arrays,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/errors.js,
    //   https://eslint.org/docs/rules/no-sparse-arrays
    "vue/no-sparse-arrays": "error",

    // Disallow unnecessary concatenation of strings.
    // @see https://eslint.vuejs.org/rules/no-useless-concat,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/best-practices.js,
    //   https://eslint.org/docs/rules/no-useless-concat
    "vue/no-useless-concat": "error",

    // Enforce consistent line breaks inside braces.
    // @see https://eslint.vuejs.org/rules/object-curly-newline,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/object-curly-newline
    "vue/object-curly-newline": [
      "error",
      {
        ObjectExpression: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ExportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
      },
    ],

    // Enforce consistent spacing inside braces.
    // @see https://eslint.vuejs.org/rules/object-curly-spacing,
    //   https://eslint.org/docs/rules/object-curly-spacing
    "vue/object-curly-spacing": ["error", "always"],

    // Enforce placing object properties on separate lines.
    // @see https://eslint.vuejs.org/rules/object-property-newline,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/object-property-newline
    "vue/object-property-newline": [
      "error",
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],

    // Enforce consistent linebreak style for operators.
    // @see https://eslint.vuejs.org/rules/operator-linebreak,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/operator-linebreak
    "vue/operator-linebreak": [
      "error",
      "before",
      {
        overrides: {
          "=": "none",
        },
      },
    ],

    // Suggest using template literals instead of string concatenation.
    // @see https://eslint.vuejs.org/rules/prefer-template,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/es6.js,
    //   https://eslint.org/docs/rules/prefer-template
    "vue/prefer-template": "error",

    // Disallow or enforce spaces inside of parentheses.
    // @see https://eslint.vuejs.org/rules/space-in-parens,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/space-in-parens
    "vue/space-in-parens": "error",

    // Require spacing around infix operators.
    // @see https://eslint.vuejs.org/rules/space-infix-ops,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/space-infix-ops
    "vue/space-infix-ops": "error",

    // Require or disallow spaces before/after unary operators.
    // @see https://eslint.vuejs.org/rules/space-unary-ops,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js,
    //   https://eslint.org/docs/rules/space-unary-ops
    "vue/space-unary-ops": [
      "error",
      {
        words: true,
        nonwords: false,
        overrides: {},
      },
    ],

    // Enforce Usage of Spacing in Template Strings.
    // @see https://eslint.vuejs.org/rules/template-curly-spacing,
    //   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/es6.js,
    //   https://eslint.org/docs/rules/template-curly-spacing
    "vue/template-curly-spacing": "error",
  },
  overrides: [
    {
      files: ["*.html"],
      rules: {
        "vue/comment-directive": "off",
        "max-len": "off",
      }
    }
  ]
};
