module.exports = [
    {
        // 1. 指定检测文件的范围 (src 下的所有 js 文件)
        files: ["src/**/*.js"],
        // 2. 配置语言选项
        languageOptions: {
            ecmaVersion: "latest", // 使用最新的 ECMAScript 语法
            sourceType: "module",  // 代码是模块化的 (ES Module)
        },
        // 3. 配置规则
        rules: {
            "no-var": "error", // 示例规则：禁止使用 var 定义变量
            "no-console": "off", // 允许使用 console.log (生产环境通常设为 warn 或 error)
        },
    },
];