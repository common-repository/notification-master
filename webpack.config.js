/**
 * Wordpress dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

/**
 * External dependencies
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const { compact } = require('lodash');

/**
 * Internal dependencies
 */
const path = require('path');

module.exports = {
    ...defaultConfig,
    module: {
        ...defaultConfig.module,
        rules: compact([
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(
                                    __dirname,
                                    'postcss.config.js'
                                ),
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    }
                ],
            },
            // ts-loader
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ]),
    },
    resolve: {
        ...defaultConfig.resolve,
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            ...defaultConfig.resolve.alias,
            '@Config': path.resolve(__dirname, 'src/config/'),
            '@Utils': path.resolve(__dirname, 'src/utils/'),
            '@Components': path.resolve(__dirname, 'src/components/'),
            '@Pages': path.resolve(__dirname, 'src/pages/'),
            '@Store': path.resolve(__dirname, 'src/store/'),
            '@Constants': path.resolve(__dirname, 'src/constants/'),
            '@Hooks': path.resolve(__dirname, 'src/hooks/'),
            '@Integrations': path.resolve(__dirname, 'src/integrations/'),
            '@ConnectionsStore': path.resolve(__dirname, 'src/connections-store/'),
            '@Icons': path.resolve(__dirname, 'src/icons/'),
        },
    },
    plugins: [
        ...defaultConfig.plugins.map(
            (plugin) => {
                if (plugin instanceof MiniCssExtractPlugin) {
                    // Change the filename of the css file
                    plugin.options.filename = 'style.css';
                    return plugin;
                }

                if (plugin instanceof RtlCssPlugin) {
                    // Change the filename of the rtl css file
                    plugin.options.filename = 'style-rtl.css';
                    return plugin;
                }

                return plugin;
            }
        ),
    ],
    // Output
    output: {
        ...defaultConfig.output,
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
};