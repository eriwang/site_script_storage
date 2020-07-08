const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const keys = require('./keys.json');

function transformManifestToUseKeys(buffer)
{
    let manifest = JSON.parse(buffer.toString());

    manifest.oauth2.client_id = keys.OAUTH2_CLIENT_ID;
    manifest.key = keys.MANIFEST_KEY;

    return JSON.stringify(manifest, null, 4); 
}

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

    'plugins': [
        new CopyWebpackPlugin({
            'patterns': [
                {
                    'from': './manifest-template.json',
                    'to': 'manifest.json',
                    transform(content) {
                        return transformManifestToUseKeys(content);
                    }
                }
            ]
        })
    ],

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
