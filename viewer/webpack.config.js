var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

const PATHS = {
    BUILD: path.join(__dirname, '/build/'),
    PUBLIC: '/build/',
    PHASER: path.join(__dirname, '/node_modules/phaser/build/custom/phaser-split.js'),
    PIXI: path.join(__dirname, '/node_modules/phaser/build/custom/pixi.js'),
    P2: path.join(__dirname, '/node_modules/phaser/build/custom/p2.js'),
    ANGULAR: path.join(__dirname, '/node_modules/angular/index.js'),
    NG_FILE_UPLOAD: path.join(__dirname, '/node_modules/ng-file-upload/dist/ng-file-upload.js')
};

var configurationStat;
if (process.env.npm_lifecycle_event) {
    try {
        configurationStat = fs.statSync(path.join(__dirname, 'scripts/app/configuration', process.env.npm_lifecycle_event + ".js"));
    } catch (e) {}
}
var configuration = (configurationStat && configurationStat.isFile) ? process.env.npm_lifecycle_event : 'default';

module.exports = {
    entry: './scripts/entry.js',
    output: {
        path: PATHS.BUILD,
        publicPath: PATHS.PUBLIC,
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
        preLoaders: [{
            test: /\.jsx?$/,
            exclude: [
                /node_modules/,
                /pixi\.js/,
                /phaser-split\.js$/,
                /p2\.js/
            ],
            loaders: ['eslint']
        }],
        loaders: [{
            test: /jquery\.js/,
            loader: 'expose?jQuery'
        }, {
            test: /angular\.js/,
            loader: 'imports?$=jQuery'
        }, {
            test: /pixi\.js/,
            loader: 'expose?PIXI'
        }, {
            test: /phaser-split\.js$/,
            loader: 'expose?Phaser'
        }, {
            test: /p2\.js/,
            loader: 'expose?p2'
        }, {
            test: /\.html$/,
            loaders: ["html"]
        }, {
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.(woff|woff2)$/,
            loader: "url-loader?limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.ttf$/,
            loader: "file-loader"
        }, {
            test: /\.eot$/,
            loader: "file-loader"
        }, {
            test: /\.svg$/,
            loader: "file-loader"
        }, {
            test: /scripts\/\.js$/,
            exclude: [
                /pixi\.js/,
                /phaser-split\.js$/,
                /p2\.js/,
                /d3\.js$/,
                /d3fc\.js$/
            ],
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new webpack.IgnorePlugin(/jsdom$/),
        new webpack.IgnorePlugin(/xmlhttprequest$/),
        new webpack.IgnorePlugin(/location$/),
        new webpack.IgnorePlugin(/navigator$/)
    ],
    resolve: {
        alias: {
            'configuration': path.join(__dirname, 'scripts', 'app', 'configuration', configuration),
            'phaser': PATHS.PHASER,
            'pixi': PATHS.PIXI,
            'p2': PATHS.P2,
            'angular': PATHS.ANGULAR,
            'ng-file-upload': PATHS.NG_FILE_UPLOAD
        },
        extensions: ['', '.js', '.json']
    }
};
