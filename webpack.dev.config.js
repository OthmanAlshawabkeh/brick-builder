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
    host: 'localhost',
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
    transportMode: 'ws',
    disableHostCheck: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'false'
    },
    client: {
      webSocketURL: {
        hostname: 'localhost',
        port: 4000,
        protocol: 'ws'
      }
    }
  },
});