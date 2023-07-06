"use strict";
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        "**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        "^.+\\.(js|jsx)$": "babel-jest",
    }
};
