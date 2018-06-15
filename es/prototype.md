# `prototype` 和 `__proto__`

* `Object.getPrototypeOf()` 方法返回指定对象的原型（即其内部 `[[Prototype]]` 属性的值）
* `__proto__` 是在 `Object.getPrototypeOf()` 之前的浏览器非标准实现
* `prototype`：只有函数才有 `prototype`，`prototype` 表示的是创建对象的原型对象，其 `constructor` 指向该函数，
* 所有对象的最终原型都是 `Object`，即所有对象的 `__proto__` 最终都指向 `Object.prototype`
* `Object.prototype` 也是对象，但跟其他对象不同，其原型对象是 `null` ，即 `Object.prototype.__proto__ === null`，原型链到此终止
* 每个函数也是一个 `Function` 对象，其原型对象是 `Function.prototype`：
    * `function doNothing() {}; doNothing.__proto__ === Function.prototype;`
* `Object`，`Function` 等构造函数也不例外，都是函数，参照上一条，其原型对象是 `Function.prototype`：
    * `Object.__proto__ === Function.prototype`
    * `Function.__proto__ === Function.prototype`
* `Function.prototype` 是所有函数的原型，包含 `Function` 自身，并且，`Function.prototype` 是一个 `function`，但不是 `Function` 的实例，而是 `Object` 的实例
    * `Function.prototype.__proto__` === `Object.prototype`
* `instanceof` 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 `prototype` 属性

http://www.mollypages.org/tutorials/js.mp

![img](http://www.mollypages.org/tutorials/jsobj.jpg)