var path = require('path');

const PATHS = {
    BUILD: path.join(__dirname, 'build'),
    PHASER: path.join(__dirname, '/node_modules/phaser/build/custom/phaser-split.js'),
    PIXI: path.join(__dirname, '/node_modules/phaser/build/custom/pixi.js'),
    P2: path.join(__dirname, '/node_modules/phaser/build/custom/p2.js')
};

module.exports = {
    entry: './scripts/entry.js',
    output: {
        path: PATHS.BUILD,
        publicPath: PATHS.BUILD,
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                exclude: [
                    /node_modules/,
                    /pixi\.js/,
                    /phaser-split\.js$/,
                    /p2\.js/
                ],
                loaders: ['eslint']
            }
        ],
        loaders: [
            { test: /pixi\.js/, loader: 'expose?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose?Phaser' },
            { test: /p2\.js/, loader: 'expose?p2' },
            { test: /\.css$/, loader: 'style!css' },
            {
                test: /\.js$/,
                exclude: [
                    /pixi\.js/,
                    /phaser-split\.js$/,
                    /p2\.js/
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        alias: {
            'phaser': PATHS.PHASER,
            'pixi': PATHS.PIXI,
            'p2': PATHS.P2
        },
        extensions: ['', '.js', '.json']
    }
};
