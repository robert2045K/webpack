//import 'core-js' //处理js，es6以上的兼容性问题，比如async,promise
//按需加载，兼容性包
//import "core-js/es/promise"
//用babel来处理引用core-js所需要的包。
import count from './js/count';
import sum from './js/sum';
// 这里引入css.
// 然后，无论哪个html引入main.js， webpack都会把这个css以<style>方式嵌入到该html中
import './css/index.css'
import './less/index.less'
import './sass/index.sass'
import './sass/index.scss'
import './css/iconfont.css'
document.getElementById('btn').onclick=function (){
    //动态导入，一定会被单独打包成一个文件。
    //vue的路由，就是用的这种import语法。也就是会被单独打包成一个文件。
    import(/* webpackChunkName: 'math' */'./js/math').then(({mul})=>{
        console.log(mul(2, 1));
    })
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}


console.log(count(2, 1));
console.log(sum(1, 2, 3,4));