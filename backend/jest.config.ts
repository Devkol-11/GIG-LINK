import type { Config } from 'jest';

const config: Config = {
        preset: 'ts-jest',

        testEnvironment: 'node',

        transform: {
                '^.+\\.[tj]sx?$': [
                        'ts-jest',
                        {
                                tsconfig: {
                                        module: 'commonjs',
                                },
                                diagnostics: {
                                        ignoreCodes: [5097]
                                }
                        }
                ]
        },

        transformIgnorePatterns: [
                'node_modules/(?!@dicebear)'
        ],

        moduleNameMapper: {
                '^(\\.{1,2}/.*)\\.js$': '$1',
                '^@core/(.*)\\.js$': '<rootDir>/src/infrastructure/$1',
                '^@core/(.*)$': '<rootDir>/src/infrastructure/$1',
                '^@src/(.*)\\.js$': '<rootDir>/src/$1',
                '^@src/(.*)$': '<rootDir>/src/$1'
        }
};

export default config;
