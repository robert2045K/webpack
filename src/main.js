import count from './js/count';
import sum from './js/sum';
// 这里引入css.
// 然后，无论哪个html引入main.js， webpack都会把这个css以<style>方式嵌入到该html中
import './css/index.css'
import './less/index.less'
import './sass/index.sass'
import './sass/index.scss'
import './css/iconfont.css'


console.log(count(2, 1));
console.log(sum(1, 2, 3,4));
