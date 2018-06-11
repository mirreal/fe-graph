# 颜色格式转换 rgb -> hex 

```js
function rgbColor2HEX(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).substr(1);
}

// example
// let rgbColor = {
//     r: 234,
//     g: 36,
//     b: 122
// };
// let hexColor = rgbColor2HEX(rgbColor.r, rgbColor.g, rgbColor.b);
// console.log(hexColor); // #ea247a
```