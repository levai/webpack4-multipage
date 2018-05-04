const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 获取指定路径下的入口文件
function getEntries(globPath) {
  var files = glob.sync(globPath),
    entries = {};
  files.forEach(function (filepath) {
    if (filepath.match(/\.js$/)) {
      var split = filepath.split('/');
      var fileName = split[split.length - 1];
      var name = fileName.substring(0, fileName.length - 3);
      entries[name] = './' + filepath;
    }
  });
  console.log('\n/-----js入口文件集合-----/\n');
  console.log(entries)
  console.log('\n/-----js入口文件集合-----/\n');
  return entries;
};

let entries = getEntries('src/views/**'); // 得到入口文件
// 生成页面模板文件
const getHtmlPlugin = function (name) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        // favicon:'',
        filename: name + '.html',
        template: './src/template/' + name + '.html',
        chunks: ['vendor', name],
        hash: true, //向html引入的src链接后面增加一段hash值,消除缓存
        minify: {
          collapseWhitespace: true, // 折叠空白区域 也就是压缩代码
          // removeAttributeQuotes: true, // 移除双引号，更多配置可以查看插件官网
          removeComments: true //如果 true ，则去掉 html 里的注释。
        },
        chunksSortMode: 'manual',
      })
    ]
  }
};
let htmlPlugins = []; // 自动生成html文件，template目录必须对应有相应的.html文件

Object.keys(entries).forEach(function (name) {
  // 每个页面生成一个html
  htmlPlugins.push(getHtmlPlugin(name))
});

console.log('\n/-----html页面文件集合-----/\n');
console.log(htmlPlugins)
console.log('\n/-----html页面文件集合-----/\n');

// 导出配置
module.exports = {
  entries: entries,
  htmlPlugins: htmlPlugins
}