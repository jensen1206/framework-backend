module.exports = {
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        allowImportExportEverywhere: true,
        ecmaFeatures: {
            jsx: true
        }
    },
    env : {
        browser: true,
        es6: true,
        node: true,
        jquery: true
    },
    rules: {
        "no-console" : 0,
        "no-unused-vars" : 0
    }
}