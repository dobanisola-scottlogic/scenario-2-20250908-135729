module.exports = {
    entry: './scripts/entry.js',
    output: {
        path: 'build',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
          {
            test: /\.jsx?$/,
            loaders: ['eslint']
          }
        ],
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json']
    }
};
