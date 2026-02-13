module.exports = {
    //这里配置具体规则
    extends:['exlint:recommended'],
    env: {
        node:true, //启用node中全局变量
        browser:true, //启用浏览器中全局变量
    },
    parserOptions:{
        ecmaVersion:6,//es6
        sourceType:'module' // es module
    },
    rules: {
        "no-var":2, //禁止使用var
    },
    plugins:['import'], //解决动态导入语法报错。
}