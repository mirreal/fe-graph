# 裴波那契

```js
// 以下两个版本均为低效实现方法
// 命令式用法
const fib = function(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}

// es6
const fibES6 = n => n < 2 ? n : fibES6(n-1) + fibES6(n-2)

// 使用尾递归实现
function fibTail(n, a = 1, b = 1) {
    if (n === 0) return a

    return fibTail(n - 1, b, a + b)
}
```
