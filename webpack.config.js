const path = require('path');
const nodeExternals = require('webpack-node-externals');
// const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, '/src/index.ts'),
    target: 'node',
    devtool: 'source-map',
    watch: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    externals: [nodeExternals()]
};
