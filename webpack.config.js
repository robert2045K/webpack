const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

//练习代码分割
module.exports = {
    // 注意，这是单入口。
    entry: {
        main: './src/codeSplit/main.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js', // webpack命名方式，[name]以文件名自己的命名
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/indexSplit.html'),
        })
    ],
    mode: "production",
    //代码分割
    optimization: {
        splitChunks: {
            chunks: 'all', //所有的代码进行分割
            minSize: 20000,  //文件最小是多少。
            minRemainingSize: 0, //确保提取的文件大小不能为0
            minChunks: 1, //引用的次数最少是多少次， 满足条件才会被分割。
            maxAsyncRequests: 30, //按需加载时，并行加载的文件的最大数量。
            maxInitialRequests: 30, //入口js文件最大并行请求数量
            enforceSizeThreshold: 50000, //超过多少，一定会单独打包，（此时会忽略minRemainingSize, maxAsyncRequests, maxInitialRequests）
            //cacheGroups的使用示例：
            // cacheGroups: {
            //     // 组，哪些模块要打包到一起。 node_modules已经默认被打包了，这里可以不写。
            //     // defaultVendors: {
            //     //     test: /[\\/]node_modules[\\/]/,
            //     //     priority: -10, //权重，越大越高
            //     //     reuseExistingChunk: true, //如果当前chunk包含已从主bundle中拆分出的模块，则它将被重用，而不是生成新的模块。
            //     // },
            //     //这里是共公配置，只要这里配置的参数，都会生效，前面的相同配置都会失效。
            //     //只对当前组生效。
            //     default: {
            //         minSize: 2,
            //         minChunks:2,
            //         priority: -20,
            //         reuseExistingChunk: true,
            //     }
            // },
            cacheGroups: {
                //这里是默认组，一定会执行。也就是给了一个默认组。
                default: {
                    minSize: 2, //这里覆盖前面的minSize.
                    minChunks:2,
                    priority: -20,
                    reuseExistingChunk: true,
                }
            }
        },
    },
}