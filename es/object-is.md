# Object.is

基本跟 `===` 一致，但有两个地方不同

而且，即便严格相等运算符 `===` 不会对操作数进行类型转换，但它不能区分两个不同的数字 -0 和 +0，还会把两个 NaN 看成是不相等的。

```js
// 两个特例，=== 也没法判断的情况
0 === -0; // true
NaN === NaN; // false

Object.is(0, -0);            // false
Object.is(NaN, 0/0);         // true
```

polyfill

```js
if (!Object.is) {
  Object.is = function(x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}
```