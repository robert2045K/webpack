/*
* @Author: your name
 */
export function sum(...args) {
    return args.reduce((acc, cur) => acc + cur, 0);
}

export default function count(x,y) {
    return x-y;
}