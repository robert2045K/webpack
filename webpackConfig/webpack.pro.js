const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//提取css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');


//公共方法， css样式处理. pre是添加其他loader
/**
 * .filter(Boolean) 如何工作
 * Array.prototype.filter() 接收一个回调函数。
 * Boolean 是 JavaScript 的内置构造函数，当作为函数调用时，它会将参数转换为布尔值。
 * Boolean("less-loader") -> true (保留)
 * Boolean(undefined) -> false (移除)
 * Boolean(null) -> false (移除)
 * 所以，[...].filter(Boolean) 等价于 [...].filter(item => Boolean(item))。
 * 结果：
 * 调用 getStyleLoader('less-loader') -> 返回 [..., 'less-loader']
 * 调用 getStyleLoader() -> 返回 [...] (自动剔除了末尾的 undefined)
 * @param pre
 * @returns {(string|string|{loader: string, options: {postcssOptions: {plugins: [string]}}})[]}
 */
function  getStyleLoader(pre) {
    return [
        //压缩css。之前是style-loader,但没压缩功能。 所以换成MiniCssExtractPlugin.loader。
        MiniCssExtractPlugin.loader,
        'css-loader', // 将css资源编译成commonjs的模块到js中
        //兼容性处理， 这里用了对象，因为有参数设置。 如果不设置参数，直接写postcss-loader就可以了。
        {

            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins:[
                        "postcss-preset-env",
                    ]
                }

            },
        },
        pre
    ].filter(Boolean)
}

module.exports = {
    //入口, 相对路径，
    entry: './src/main.js',
    // 开发环境服务器，不会输出打包文件，在内存中编译打包并运行。
    devServer: {
      host:'localhost',
      port:3000,
      open:true,
    },
    //输出，用绝对路径，为了确保无论你在哪里执行 npm run build，文件都能准确无误地生成在项目文件夹下的 dist 目录中
    output: {
        // __dirname是node.js的变量，代表当前目录路径， 也就是webpack文件夹的路径
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/main.js',
        clean: true
    },
    //module的作用：
    //当 Webpack 遇到 .js 文件 -> 原生支持，直接读。
    //当 Webpack 遇到 .css 文件 -> 查阅 module.rules -> 发现配置了 css-loader -> 调用 Loader 翻译成 JS。
    //当 Webpack 遇到 .png 文件 -> 查阅 module.rules -> 发现配置了 type: 'asset' -> 复制文件到输出目录，并返回路径。
    module: {
        rules:[
            {
                // webpack处理项目每一个文件时（js,css, json,img,mp3等），都会来查询用哪一个loader来处理文件。
                // oneOf就是webpack匹配到到loader, 就不再去匹配了。
                oneOf: [
                    {
                        test: /\.m?js$/,
                        // 排除，3方依赖库， 第3方已经处理好了。
                        exclude: /(node_modules|bower_components)/,
                        // exclude: /node_modules/, //排除node_modules第3方库。因为第3方库转换换成es5了已经，不需要再处理。
                        include: path.resolve(__dirname, '../src'), // 只处理src目录下的js文件，其他目录下的文件不处理。
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                                plugins: ["@babel/plugin-transform-runtime"], //减少代码体积
                            },
                        },
                    },
                    {
                        //遇到.css, 就使用'style-loader', 'css-loader'
                        // css-loader会把css编译成js中。 也就是编译到commonjs格式的js中。
                        // style-loader,将编译好的css的js代码，创建style标签，添加到html文件中。
                        test: /\.css$/i,
                        use: getStyleLoader(),
                    },
                    {
                        // npm install less less-loader --save-dev
                        //这些配置，是从webpack的官网上复制的。
                        test: /\.less$/i,
                        use: getStyleLoader("less-loader"),
                    },
                    {
                        //npm install sass-loader sass webpack --save-dev
                        //sass, sass都是sass
                        test: /\.s[ac]ss$/i,
                        use: getStyleLoader("sass-loader"),
                    },
                    {
                        //资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。
                        test: /\.(png|svg|jpg|jpeg|gif)$/,
                        type: 'asset',
                        parser: {
                            dataUrlCondition: {
                                //小于100kb， 转base64
                                maxSize: 10 * 1024 // 10kb
                            }
                        },
                        generator: {
                            filename: 'static/img/[hash:10][ext][query]' //图片生成的路径， 名字，扩展名
                        }
                    },
                    {
                        //导入icontFont字体图标
                        test: /\.(ttf|woff|woff2)$/,
                        // asset/resource, 不会转Base64
                        type: 'asset/resource',
                        generator: {
                            filename: 'static/iconFont/[hash:10][ext][query]' //图片生成的路径， 名字，扩展名
                        }
                    },
                    {
                        //导入mp3音频, 视频
                        test: /\.(mp3|mp4|avi)$/,
                        // asset/resource, 不会转Base64
                        type: 'asset/resource',
                        generator: {
                            filename: 'static/media/[hash:10][ext][query]' //图片生成的路径， 名字，扩展名
                        }
                    }
                ]
            }
        ],
    },
    //插件
    plugins: [
        // 插件的作用：解决 loader 无法实现的其他事
        // 1. ESLintPlugin: 在打包过程中检查代码规范
        // 2. HtmlWebpackPlugin: 自动生成 html 文件，并自动引入，打包输出的 js 文件 (非常重要)
        // 3. MiniCssExtractPlugin: 将 CSS 提取为单独的文件，而不是作为 style 标签插入 js 中
        // 4. DefinePlugin: 定义环境变量给代码使用
        new ESLintPlugin({
            // ESLint检测哪些文件。
            //exclude: /node_modules/,
            context: path.resolve(__dirname, '../src'),
            cache:true, //开启缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintCache'),
        }),
        new HtmlWebpackPlugin({
            // 使用模板public/index.html'
            template: path.resolve(__dirname, '../public/index.html'),
        }),
        //将 CSS 提取为单独的文件
        new MiniCssExtractPlugin({
            filename:"static/css/[name].[contenthash:10].css"
        }),
        new CssMinimizerPlugin(),
    ],
    //模式
    mode: 'production',
    devtool: "source-map"

}