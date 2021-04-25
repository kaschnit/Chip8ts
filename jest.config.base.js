module.exports = {
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.json",
            diagnostics: true,
        },
        NODE_ENV: "test",
    },
    roots: ["<rootDir>/src", "<rootDir>/tst/unit"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/tst/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    moduleDirectories: ["node_modules", "src"],
    modulePaths: ["<rootDir>/src/"],
    collectCoverage: true,
    verbose: false,
    moduleNameMapper: {
        "src/(.*)": "<rootDir>/src/$1",
    },
};
