const path = require('path');

module.exports = {
  mode: 'production',
  entry: './clientJS/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8000,
  },
};