const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    watch: true,

    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 5001
        })
    ]
});
