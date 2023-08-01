import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
    entry: './js/page.js',
    output: {
        path: path.resolve('dist'),
        filename: 'js/page.js'
    },
    mode: 'production',
    module: {
        rules: [
            // Rule for JavaScript files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [
        // Plugin to clean the 'dist' folder before each build
        new CleanWebpackPlugin(),
        // Plugin to generate the final HTML file
        new HtmlWebpackPlugin({
            template: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            },
        }),
        // Plugin to extract CSS into separate files
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),
        // Copy files not referenced from entry point
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'fonts', // Source directory (relative to the project root)
                    to: 'fonts', // Destination directory in the output 'dist' folder
                },
                {
                    from: 'images', // Source directory (relative to the project root)
                    to: 'images', // Destination directory in the output 'dist' folder
                },
                {
                    from: 'css', // Source directory (relative to the project root)
                    to: 'css', // Destination directory in the output 'dist' folder
                },
                {
                    from: 'js', // Source directory (relative to the project root)
                    to: 'js', // Destination directory in the output 'dist' folder
                    filter: (resourcePath) => {
                        return resourcePath.endsWith('.min.js');
                    },
                },
            ],
        })
    ],
    optimization: {
        minimizer: [
            // Plugin to minimize and optimize JS files
            new TerserPlugin({
                extractComments: false,
            }),
            // Plugin to minimize and optimize CSS files
            new CssMinimizerPlugin(),
        ],
    },
};
