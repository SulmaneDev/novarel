/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',

    extensionsToTreatAsEsm: [],

    testMatch: [
        "**/tests/**/*.test.js",
        "**/?(*.)+(spec|test).js"
    ],

    moduleNameMapper: {
        "^@core/(.*)$": "<rootDir>/src/core/$1",
        "^@lib/(.*)$": "<rootDir>/src/lib/$1"
    },

    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/index.js"
    ],

    transform: {},
    verbose: true
};

export default config;
