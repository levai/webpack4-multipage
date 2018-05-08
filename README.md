## `1.` 什么是webpack?
> WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用。
---
## `2.`webpack的作用？
> 打包
> 依赖
> 优化
---
## `3.`webpack结构构成
```javascript
module.exports={
  // 1.入口文件
  entry:{
    a:'./src/index.js'
  },
  // 2.出口文件
  output:{
    path:__dirname+'/dist',
    filename:'bundle.js'
  },
  // 3.模块规则
  module:{},
  // 4.插件
  plugins:[],
  // 5.devServer
  devServer:{}
}

```
---
## `4.`开发和生成模式
```javascript
 "scripts": {
    "dev":"webpack --mode development",
    "build":"webpack --mode production",
  }
```
```
--progerss：会出现打包过程，有百分比进度条

--display-modules：会把所有打包的模块列出来

--display-reasons：会把打包的原因列出来
```
---
## `5.`js文件多入口 【打包到一起，多对一打包】
```javascript
module.exports = {
		// entry是个数组，打包时会合并到指定的js文件
    entry:['./src/index.js','./src/index2.js'],
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js' //名字可以随便起
    }
};
```
---
## `6.`js多入口多出口 【多对多实现】
```javascript
const path = require('path');

module.exports = {
    entry:{ //entry入口文件支持json的形式
        index: './src/index.js',
        index2: './src/index2.js'
    }, 
    output:{
        path:path.resolve(__dirname,'dist'),
        //filename前面我们可以使用一个变量[name],这个就表示获取entry里面的key作为文件名加在前面
        //打出来是index-bundle.js
        //和index2-bundle.js
        filename:'js/[name]-bundle.js' // 多文件输出多文件,输出至dist目录下的js
    }
}
```
---
## `7.`html-webpack-plugin插件生成html页面,并自动引入js文件,并自动消除src引入的缓存问题，上线之前压缩，配置minify压缩代码,生成的HTML文件引入各自的JS文件配置
> 
> 	1.安装html-webpack-plugin插件,因为是开发需要,所以在后面加-D
```javascript
npm i html-webpack-plugin -D	
```
> 	2.安装成功以后,在webpack.config.js里面引入
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');  
```
> 3.在webpack.config.js里面的plugins里面配置插件
```javascript
new HtmlWebpackPlugin()
```
> 4.配置模板HTML文件

```javascript
plugins:[
		new HtmlWebpackPlugin ({
				template: './src/index.html' //模板地址
		})	
	]
```
> 5.自动消除src引入的缓存问题，压缩代码
```javascript
plugins:[
    new HtmlWebpakPlugin({
			minify:{
        collapseWhitespace:true, // 折叠空白区域 也就是压缩代码
        removeAttributeQuotes:true // 移除双引号，更多配置可以查看插件官网
      },
      hash:true, //向html引入的src链接后面增加一段hash值,消除缓存
      template:'./src/index.html',
      title:'webpack学习'
    })
  ]
```
> ##### 6.多个HTML模板区分输出配置，
> 以链式的方法,再调用一次html-webpack-plugin插件,每次调用指定filename也就是生成页面的名字.调用一次生成一个页面,调用两次生成两个页面,以此类推.
```javascript
plugins:[
    new HtmlWebpakPlugin({
      filename:'index.html', // 指定生成的html页面名称
      template:'./src/index.html',
    }),
    new HtmlWebpakPlugin({
      filename:'home.html', // 指定生成的html页面名称
      template:'./src/home.html',
    })
```
> ##### 7.生成的HTML文件引入各自的JS文件配置
```javascript
// 入口文件指定key值
entry:{ // 多文件输出多文件
    index:'./src/index.js',
    home:'./src/home.js'
  },
```
>在html-webpack-plugin中再配置一个参数,chunks,支持数组,数组里面填写的是引入的js,也就是entry里面配置的key,要引入哪个js就配置entry中的哪个key.
```javascript
 plugins:[
        new HtmlWebpackPlugin({
            chunks:['index','home'], //添加引入的js,也就是entry中的key
            filename:'index.html',
            template: './src/index.html' //模板地址
        }),
```
---
## `8.`webpack 删除指定目录
> 1.安装clean-webpack-plugin
```javascript
npm i clean-webpack-plugin -D
```
>2.在webpack.config.js中引入
```javascript
const CleanWebpackPlugin = require('clean-webpack-plugin');
```
>3.在plugins中配置
```javascript
plugins:[
    // 自动删除指定目录文件配置
    new CleanWebpackPlugin(['dist']), // 传入数组,指定要删除的目录
		]
```
---
## `9.`webpack 如何配置开发环境服务器及配置热更新
> 1.安装webpack-dev-server
```javascript
npm i webpack-dev-server -D
```
>2.这个不需要引入,直接用就可以了
```javascript
devServer:{
    // 设置服务器访问的基本目录
    contentBase:path.resolve(__dirname,'dist'),
    // 设置服务器的ip地址，也可以是localhost
    host:'localhost',
    // 设置端口
    port:8888,
    // 设置自动拉起浏览器
    open:true
  }
```
>3.配置package.json
```javascript
"scripts": {
    "dev": "webpack-dev-server --mode development"
  },
```
>4.npm run dev 运行，不会生成dist目录 会自动拉起浏览器打开页面
---
>##### 5.配置热更新
>5.1.在webpack.config.js文件引入webpack模块
```javascript
const Webpack = require('webpack');
```
>5.2.在devServer中增加一个hot:true配置
```javascript
devServer:{
    // 设置热更新,需要引入webpack模块，并在插件plugins中配置new Webpack.HotModuleReplacementPlugin(),
    hot:true,
  }
```
>5.3.在plugins中配置
```javascript
plugins:[
    // 配置热更新
    new Webpack.HotModuleReplacementPlugin()
	]
```
---
## `10.`loaders学习各种loader,用于对模块的源代码进行转换,类似于其他构建工具中“任务(task)”
>* 作用 
>	* 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，
>	* 将内联图像转换为 data URL。
>	* 允许你直接在 JavaScript 模块中 import CSS文件！

>1.安装 style-loader、css-loader
```javascript
npm i style-loader css-loader -D
```
>2.配置规则，module,在里面rules(规则),rules是一个数组,里面可以写一条一条的规则
>	 css-loader一定要放在后面,因为是先用css-loader在插入到style标签里面
 ```javascript
 // 3.模块规则
  module:{
    rules:[ //配置一个rules(规则),rules是一个数组,里面包含一条一条的规则
      {
		
        test:/\.css$/,  // test 表示测试什么文件类型
        use:[ // 使用 'style-loader','css-loader'
          'style-loader','css-loader'
        ]
      }
    ]
  },
```
> loader的三种写法
> >一般简单的用第一种,涉及参数配置的用第三种
> >* 1.use:['xxx-loader','xxx-loader']
> >* 2.loader:['style-loader','css-loader']
> >* 3.use:[{loader:'style-loader'},{loader:'css-loader'} ]
---
## `11.`压缩js
>在webpack4.x版本中
> >--mode production 表示生产环境,只要配置在package.json的script里面 js自动就压缩了
## `12.`背景图引入，图片转base64
>1.安装相关依赖
>
```javascript
npm i file-loader url-loader -D
```
>2.配置module
```javascript
module:{ //我写一个module
    rules:[
        {
            test:/\.(png|jpg|gif)$/,
            use:[{
				loader:'url-loader',
				options:{ // options选项参数可以定义多大的图片转换为base64
            		limit:5*1024, // 表示小于50kb的图片转为base64,大于50kb的是路径
            		outputPath:'images' // 定义输出的图片文件夹
				}]
        }
    ]
},
```
---
## `13.`分离css代码
>使用到extract-text-webpack-plugin进行CSS分离
>1.安装插件
>
```javascript
npm i extract-text-webpack-plugin@next -D
//针对webpack4.x版本
```
>2.在webpack-config.js 文件中引入
>
```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin');
```
>3.在plugins中调用插件(配置提出来的css名称以及提到哪里)
>
```javascript
module:{
    rules:[ 
      {
        test:/\.css$/,  
        use:ExtractTextPlugin.extract({
          fallback:'style-loader', // 回滚
          use:'css-loader',
          publicPath:'../' //解决css背景图的路径问题
      })
      },
      {
        test:/\.(png|jpg|gif)$/,
        use:[{
          loader:'url-loader',
          options:{ // options选项参数可以定义多大的图片转换为base64
            limit:5*1024, // 表示小于50kb的图片转为base64,大于50kb的是路径
            outputPath:'images' // 定义输出的图片文件夹
          }
        }]
      }
    ]
  },
```
---
## `14.`处理less/sass文件及分类编译后的css文件，自动添加css前缀和消除重复的css代码
>#### 1、处理less文件
>>1.1 安装less 和 less-loader 模块
>>
```javascript
npm i less less-loader -D
```
>>1.2 配置rules
>>
```javascript
{
	test:/\.less$/,
	use:['style-loader','css-loader','less-loader'] // 编译顺序从右往左
},
```
>>1.3 使用ExtractTextPlugin插件分离编译后的css
>>
```javascript 
{
	test:/\.less$/,
	// 分离编译后的css
	use:ExtractTextPlugin.extract({
		fallback:'style-loader',
		use:['css-loader','less-loader']
	})
},
```
>#### 2.postCss 预处理器 自动添加CSS前缀
>> 2.1.安装postCss
>>
```javascript
npm i postcss-loader autoprefixer -D
```
>>2.2.新建postcss.config.js文件与webpack.config.js同级，配置如下：
>>
```javascript
module.exports = {
    plugins:[
        require('autoprefixer') // 自动添加css前缀
    ]
}
```
>>2.3.在webpack.config.js文件里配置postcsss-loader
>>
```javascript
  module: {
    rules: [ //配置一个rules(规则),rules是一个数组,里面包含一条一条的规则
      {
        test: /\.css$/, // test 表示测试什么文件类型
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', // 回滚
          use: [
            {
              loader:'css-loader',
              options:{
                importLoaders:1 // 在css中使用@import引入其他文件
              }
          },{
              loader: 'postcss-loader' //不加importLoaders postcss-loader不会操作引入的文件 
          }
        ],
          publicPath: '../' //解决css背景图的路径问题
        })
      },
      {
        test:/\.less$/,
        // use:['style-loader','css-loader','less-loader'] // 编译顺序从右往左
        // 分离编译后的css
        use:ExtractTextPlugin.extract({
          fallback:'style-loader',
          use:['css-loader','less-loader','postcss-loader']
        })
      },
      ]
      }
    ]
  },
```
>>2.4.在package.json文件中添加支持浏览器区域条件
>>必须加上这一句，不然不会生效
>>关于添加浏览器前缀 可能还有其他更加高效的配置方法。
>>
```javascript
  "browserslist": [  
    "> 1%",                                
    "last 2 versions",  
    "not ie <= 8"  
  ]  
```
## `14.`babel:编译JS,使用ES6 7

>>14.1 使用babel-loader、babel-core、babei-preset-env 转化
>>
```javascript
npm i babel-loader babel-core babel-preset-env -D
```
>>14.2 在webpack.config.js 文件中定义一个处理规则
>>
```javascript
 // 使用babel-loader 转化新语法
{
	test:/\.(js|jsx)$/,
	use:['babel-loader'],
	exclude:'/node_modules' // 排除依赖模块文件目录
}
```
>>14.3 在webpack.config.js同级目录配置.bablelrc文件：配置内容如下：
>>
```javascript
{
  "presets":[
    "env","react"
  ]
}
```
## `15.`静态资源输出，把这些文件原封不动的复制粘贴出去
>>15.1 使用copy-webpack-plugin 插件处理
>>15.2 安装插件与引入
>>
```javascript
npm i copy-webpack-plugin -D
// 在webpack.config.js 中require  copy-webpack-plugin插件进来
const CopyWebpackPlugin = require('copy-webpack-plugin');
```
>>15.3 在plugins中配置使用
>>
```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 在plugins 中配置
new CopyWebpackPlugin([ //支持输入一个数组
	{
			from: path.resolve(__dirname, 'src/assets'), //将src/assets下的文件
			to: './assets' // 复制到dist目录下的assets文件夹中
	}
])
```
## `16.`配置第三方库，如jquery，推荐使用插件方式配置
>> 16.1 使用webpack自带的ProvidePlugin 下载jq
>> 
```javascript
// 引入模块
npm i jquery -S
const webpack = require('webpack');
// 在插件中配置
new Webpack.ProvidePlugin({ //下载Jquery库
	$:'jquery'
})
```
>> 
## `17.
![0.qr5fxo0do1](/:storage/0.qr5fxo0do1.png)


