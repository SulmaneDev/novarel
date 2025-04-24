export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': [
        'ts-jest',
        {
          useESM: true,
          tsconfig: 'tsconfig.json'
        }
      ]
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1'
    }
  };
  