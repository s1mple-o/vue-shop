module.exports = {
        root: true,
        env: {
            node: true
        },
        extends: [
            'plugin:vue/essential',
            '@vue/standard'
        ],
        parserOptions: {
            parser: 'babel-eslint'
        },
        rules: {
            'indent': ['off', 2],
            'eol=last': 0,
            'space-before-blocks': 0,
            'key-spacing': 0,
            'quotes': [1, 'single'],
            'space-before-function-paren': 0,
            'no-trailing-spaces': 0,
            'arrow-spacing': 0,
            'keyword-spacing': 0,
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'

        }
    }
    /* eslint-disable eol-last */