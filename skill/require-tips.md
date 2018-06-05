# RequireJS tips

## require timeout error

> The paths config was used to set two module IDs to the same file, and that file only has one anonymous module in it. If module IDs "something" and "lib/something" are both configured to point to the same "scripts/libs/something.js" file, and something.js only has one anonymous module in it, this kind of timeout error can occur. The fix is to make sure all module ID references use the same ID (either choose "something" or "lib/something" for all references), or use map config.

http://requirejs.org/docs/errors.html#timeout

简而言之，出现这种错误可能是对同一模块配置两个相同的 ID

## 不解析 RequireJs

涉及到 `geo.js` 里面的 `require(['googlemap'], function() { })`

这里 `require` 和 `commonJs` 里的 `require` 不同，推荐在使用 `requireJs` 的语义下，使用 `requirejs` 方法代替 `require`。

然后，在 `webpack` 配置中，我们应该忽略 `requireJs` 的解析，参考：[Rule.parser](https://webpack.js.org/configuration/module/#rule-parser) ，like this:

```js
{
    test: /\.jsx?$/,
    parser: {
        requireJs: false
    },
    loader: 'babel-loader'
}
```
