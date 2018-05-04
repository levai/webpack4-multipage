// 引入webpack模块
const webpack = require('webpack'); // 引入webpack
const path = require('path'); // 引入路径模块
const merge = require('webpack-merge'); // 多页面处理
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 引入自动删除指定目录插件
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 引入提取CSS样式 插件
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 引入静态资源拷贝插件

const entrys = require('./entry.config'); // 加载入口文件
const entries = entrys.entries; // 入口js文件信息
const pages = entrys.htmlPlugins; // 生成html文件的集合


function resolve(dir) {
  return path.join(__dirname, dir)
}

// webpack基本配置
const baseConfig = {
  devtool: 'inline-source-map', // eval 用于开发环境 生成环境用source-map
  // 1.入口配置
  entry: Object.assign(entries, {
    'vendor': ['jquery', './src/common/main.js', ], // 用到什么公共lib（例如jquery.js），就把它加进vendor去，目的是将公用库单独提取打包
  }),
  // 2.输出配置
  output: {
    path: resolve('dist'),
    filename: 'js/[name].[hash:5].js'
  },
  // 3.配置打包相关规则
  module: {
    rules: [{
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: '/node_modules',
      },
      {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader'
      }, {
        test: /\.(css|less)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // use: ['css-loader', 'postcss-loader', 'less-loader'],
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: true,
            }
          }, {
            loader: 'postcss-loader'
          }, {
            loader: 'less-loader'
          }],
          publicPath: '../' //解决css背景图的路径问题
        }),
      }, {
        test: /\.(png|jpeg|jpg|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: { // options选项参数可以定义多大的图片转换为base64
            limit: 10000, // 表示小于50kb的图片转为base64,大于50kb的是路径
            outputPath: 'images', // 定义输出的图片文件夹
          }
        }]
      }, {
        test: /\.(woff2|eot|ttf|woff)(\?.*)?$/,
        use: 'file-loader'
      }
    ]
  },
  // 4.插件配置
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 配置热更新
    new CleanWebpackPlugin(resolve('dist')), // 自动删除指定目录文件配置
    new ExtractTextPlugin({ // 提取css
      filename: 'css/[name].[hash:5].css',
      allChunks: true // 从所有的chunk中提取
    }),
    new CopyWebpackPlugin([ //支持输入一个数组, 静态资源引入拷贝
      {
        from: resolve('src/images'), //将src/assets下的文件
        to: './images' // 复制到dist目录下的assets文件夹中
      }
    ]),
    new webpack.ProvidePlugin({ //下载Jquery库
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.BannerPlugin('版权所有，翻版必究!')

  ],

  // 5.提取公共代码
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: { // 抽离第三方库
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10
        }
      }
    }
  },

  // 6.开发服务器配置
  devServer: {
    // 设置服务器访问的基本目录
    contentBase: resolve('dist'),
    // 设置服务器的ip地址，也可以是localhost
    host: 'localhost',
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    port: 8080,
    open: true,
    compress: true,
  },
}

// 通过插件merge 和基本配置合并
module.exports = merge([baseConfig].concat(pages));