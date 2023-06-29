import { resolve } from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
    devtool: 'eval-source-map',
    entry: './src/index.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.png$/i,
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
        extensions: ['.js', '.ts', '.tsx'],
        modules: [resolve(__dirname, 'src'), 'node_modules'],
    },
}
