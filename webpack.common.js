const path = require('path');

module.exports = {
    'entry': {
        'popup': './src/popup/popup.js',
        'options': './src/options/options.js'
    },
    'output': {
        'filename': '[name].js',
        'path': path.resolve(__dirname, 'gen/')
    },

    'externals': {
        'gapi': 'gapi',
        'chrome': 'chrome'
    },

    'module': {
        'rules': [
            {
                'test': /\.js$/,
                'exclude': [/node_modules/],
                'loader': 'babel-loader'
            },
            {
                'test': /\.css$/,
                'use': ['style-loader', 'css-loader']
            },
            {
                'test': /\.html$/,
                'loader': 'file-loader',
                'options': {'name': '[name].[ext]'}
            }
        ]
    },
};
