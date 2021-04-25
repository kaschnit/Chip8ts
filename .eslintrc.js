const importRules = {
    "import/no-extraneous-dependencies": "off", // handled by tsc
    "import/no-named-as-default-member": "off", // handled by tsc
    "import/namespace": "off", // handled by tsc
    "import/extensions": "off", // handled by tsc
    "import/named": "off", // handled by tsc
    "import/no-unresolved": "off", // handled by tsc
    "import/prefer-default-export": "off",
    "import/no-useless-path-segments": "error",
    "import/no-named-as-default": "off",
    "import/newline-after-import": "warn",
};

const prettierRules = {
    "prettier/prettier": "off",
};

const tsEslintRules = {
    // @typescript-eslint
    "@typescript-eslint/indent": "off", // handled by prettier
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/member-delimiter-style": "off", // handled by prettier
    "@typescript-eslint/no-unused-vars": "off", // handled by tsc
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/naming-convention": [
        "warn",
        {
            selector: "variable",
            format: ["camelCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
        },
        {
            selector: "variable",
            modifiers: ["const", "global"],
            format: ["UPPER_CASE"],
        },
    ],
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-var-requires": "error", // "import" is better than "require"
    "@typescript-eslint/no-require-imports": "error", // "import" is better than "require"
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-throw-literal": "error",
    "@typescript-eslint/prefer-as-const": "error",
};

const generalRules = {
    "prefer-const": "warn",
};

module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:prettier/recommended",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    plugins: ["prettier", "@typescript-eslint"],
    rules: {
        ...importRules,
        ...prettierRules,
        ...generalRules,
    },
    overrides: [
        {
            // enable the rule specifically for TypeScript files
            files: ["*.ts", "*.tsx"],
            rules: {
                ...tsEslintRules,
            },
        },
    ],
};
