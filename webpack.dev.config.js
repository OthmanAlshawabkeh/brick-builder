const path = require('path');
const webpack = require('webpack');

const webpackBaseConfig = require('./webpack.base.config.js');
const packageJson = require('./package.json');

module.exports = Object.assign({}, webpackBaseConfig, {
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  entry: Object.keys(webpackBaseConfig.entry).reduce((result, k) => {
    result[k] = [
      ...webpackBaseConfig.entry[k],
    ];
    return result;
  }, {}),
  output: Object.assign({}, webpackBaseConfig.output, {
    publicPath: '/',
  }),
  plugins: [
    ...webpackBaseConfig.plugins,
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('development') }
    }),
    new webpack.DefinePlugin({
      'process.env': { REPOSITORY_URL: JSON.stringify(packageJson.repository.url) },
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: '4000',
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
    },
    historyApiFallback: true,
    contentBase: 'assets',
    publicPath: '/',
    quiet: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'false',
      'Content-Security-Policy': "default-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;"
    },
  },
});