export default {
    preset: 'ts-jest',

    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
    testEnvironment: 'node',

    moduleFileExtensions: ['ts', 'js', 'json', 'node'],

    moduleNameMapper: {
        '^@novarel/core(.*)$': '<rootDir>/../core/src$1',
        '^(.*)\\.js$': '$1',
    },

    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
};
