module.exports = {
    'env': {
        'node': true,
        'browser': true,
        'es2020': true,
        'webextensions': true,
    },
    'extends': ['eslint:recommended', 'plugin:react/recommended'],
    'parserOptions': {
        'ecmaVersion': 11,
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },
    'plugins': ['react'],
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'max-len': ['error', 120],
        'no-var': 'error',
        'no-prototype-builtins': ['off'],
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/prop-types': 0,
    },
    'ignorePatterns': ['gen/**']
};
