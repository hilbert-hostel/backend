module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$'
}
