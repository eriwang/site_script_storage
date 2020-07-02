const path = require('path');

module.exports = {
    'entry': {
        'background': './src/background.js',
        'popup': './src/popup.js',
        'options': './src/options.js'
    },
    'output': {
        'filename': '[name].js',
        'path': path.resolve(__dirname, 'gen/')
    },

    'externals': {
        'gapi': 'gapi'
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
