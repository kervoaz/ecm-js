module.exports = {
    // moduleNameMapper: {
    //     '^src/(.*)$': '<rootDir>/src/$1'
    // },
    roots: ['<rootDir>/test'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
