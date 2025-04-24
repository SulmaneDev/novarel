export default {
	preset: 'ts-jest/presets/default-esm',
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
	},
	rootDir: './',
	testMatch: ['<rootDir>/tests/**/*.test.ts']
};
