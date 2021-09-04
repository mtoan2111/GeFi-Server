const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.js',
    // entry: ['webpack/hot/poll?100', './src/index.ts'],
    watch: true,
    target: 'node',
    mode: 'production',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            fs: false,
            tls: false,
            net: false,
            path: false,
            zlib: false,
            http: false,
            https: false,
            stream: false,
            crypto: false,
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    fallback: {
        path: false,
    },
};

module.exports = {
    devtool: 'source-map',
};
