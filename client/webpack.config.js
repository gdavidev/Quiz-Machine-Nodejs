const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),  // Entry file (your frontend code)
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader', // Optional but recommended
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')]
              }
            }
          }
        ]
      },
      {
        test: /\.ejs$/,
        exclude: /index\.ejs$/, // Exclude your main template
        use: [
          {
            loader: 'ejs-loader',
            options: {
              esModule: false,
              variable: 'data'
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css', // Outputs CSS as a separate file
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-loader?esModule=false&variable=data!./client/src/index.ejs',
      //template: path.resolve(__dirname, './src/index.html'),  // Your source HTML
      filename: 'index.html',        // Output in /dist/index.html
      title: 'Quiz App',
      appVersion: process.env.npm_package_version,
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        description: 'Webpack bundled application'
      },
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
      }
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    alias: {
      '@libs': path.resolve(__dirname, '../shared/libs/'),
      '@classes': path.resolve(__dirname, './src/classes/'),
      '@models': path.resolve(__dirname, '../shared/models/'),
      '@icons': path.resolve(__dirname, './src/assets/icons/'),
      '@images': path.resolve(__dirname, './src/assets/images/')
    },
  },
};