const path = require('path');
const fs = require('fs')

const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const ProjectJson = require('./builder/plugin/ProjectJson')
const UiMode = require('./builder/plugin/UiMode')
const pkgCfg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')))


const output_file = `${pkgCfg.name}.js`

const prod = process.env.NODE_ENV === 'production'


let autojsIgnore = fs.readFileSync(path.resolve(process.cwd(), 'src', '.autojs.build.ignore'))
  .toString()
  .split("\n")
  .map(s => s.trim())
  .filter(s => s != '')
  .map(s => fs.realpathSync(path.resolve(process.cwd(), 'src', s)))
  .concat([])

const webpack = {
  entry: ['./src/main.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: output_file,
  },
  mode: process.env.NODE_ENV,
  devtool: prod ? false : 'inline-source-map',
  resolveLoader: {
    modules: [path.join(__dirname, 'builder', 'loader'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png)/,
        use: 'pic-loader'
      },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: "tsconfig.json"
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new UiMode(),
    new CopyPlugin({
      patterns: [
        {
          from: './src/',
          filter: async (path) => {
            return autojsIgnore.indexOf(fs.realpathSync(path)) == -1
          },
          globOptions: {
            ignore: ['**/*.js', '**/*.ts']
          }
        }
      ],
    }, {
      ignore: autojsIgnore,
      copyUnmodified: true
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
    minimizer: [
      new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        test: /.js$/,
        uglifyJS: {
          output: {
            beautify: false,
            comments: false
          },
          compress: {
            drop_console: false,
            collapse_vars: true,
            reduce_vars: true
          }
        },
      }),
    ],

  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      'debug-flow': path.resolve('src', 'debug', prod ? 'prod.ts' : 'dev.ts')
    }
  }
}

if (prod) {
  // ?
}

module.exports = webpack