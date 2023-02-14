import { resolve } from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
    // // Needed?
    // devServer: {
    //     static: './dist/',
    // },
    devtool: 'eval-source-map',
    entry: './src/index.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.png$/,
                type: 'asset/resource',
            },
        ],
    },
    output: {
        clean: true,
        path: resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Minecraft 2D',
        }),
    ],
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js',
        ],
    },
}
