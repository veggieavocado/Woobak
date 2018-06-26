const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  context: __dirname,
  devtool: 'source-map', // create source map so you can easily debug minified js files

  entry: {
    test: ['babel-polyfill', `${__dirname}/js-src/testscript.js`],
  },

  output: {
    path: `${__dirname}/static/dist`,
    filename: '[name].js',
    sourceMapFilename: '[name].map',
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin(),
  ],

};
