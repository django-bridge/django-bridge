const path = require('path');

module.exports = {
  entry: './wagtail_shell/static_src/main.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../fonts/',
              // FIXME: Make this work when /static is hosted somewhere else
              publicPath: '/static/wagtail_shell/fonts/'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../images/',
              // FIXME: Make this work when /static is hosted somewhere else
              publicPath: '/static/wagtail_shell/images/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  externals: {
    /* These are provided by Wagtail */
    'react': 'React',
    'react-dom': 'ReactDOM',
    'gettext': 'gettext',
  },
  output: {
    path: path.resolve(__dirname, 'wagtail_shell/static/wagtail_shell/js'),
    filename: 'wagtail-shell.js'
  }
};
