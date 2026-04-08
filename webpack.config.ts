import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'

import HtmlWebpackPlugin from 'html-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config: webpack.Configuration = {
    devtool: 'eval-source-map',
    entry: './src/index.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
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
        filename: 'index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Minecraft 2D',
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        tsconfig: resolve(__dirname, 'tsconfig.json'),
    },
}

export default config
