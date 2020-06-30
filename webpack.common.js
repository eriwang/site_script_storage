const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        'filename': 'main.js',
        path: path.resolve(__dirname, 'gen/')
    },
    externals: {
        jquery: 'jQuery'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
};
