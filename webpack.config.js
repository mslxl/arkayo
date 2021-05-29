const path = require('path');
const fs = require('fs')

const AutoProWebpackPlugin = require('@auto.pro/webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const JavaScriptObfuscator = require('webpack-obfuscator')

const ProjectJson = require('./builder/plugin/ProjectJson')

const pkgCfg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')))


const output_file = `${pkgCfg.name}.js`

const prod = process.env.NODE_ENV === 'production'

const webpack = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: output_file,
  },
  mode: process.env.NODE_ENV,
  devtool: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader", "@auto.pro/webpack-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: "tsconfig.json"
            }
          },
          "@auto.pro/webpack-loader"
        ],
        exclude: /node_modules/,

      },
    ],
  },
  plugins: [
    new AutoProWebpackPlugin({
      ui: [output_file.split('.')[0]]
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/',
          to: '',
          globOptions: {
            ignore: ['**/*.js', '**/*.ts', '**/*.xml']
          }
        }
      ],
    }),
    new ProjectJson(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: !prod,
      statsOptions: { source: false }
    })
  ],
  optimization: {
    minimize: prod,
  },
  resolve: {
    extensions: ['.js', '.ts']
  }
}

if (prod) {
  webpack.plugins.push(new JavaScriptObfuscator({
    compact: true,
    //selfDefending: true,
    rotateStringArray: true,
    stringArray: true,
    renameGlobals: false,
    //deadCodeInjectionThreshold: 1,
    //debugProtection: true,
    identifierNamesGenerator: 'mangled'
  }))
}

module.exports = webpack