# 在 web 使用 JavaScript 模块

> 原文：[
Using JavaScript modules on the web](https://developers.google.com/web/fundamentals/primers/modules)


现在 [所有主流浏览器都支持](https://caniuse.com/#feat=es6-module) JavaScript 模块。本文将介绍如何使用 JS 模块，如何有效地部署，以及 Chrome 团队如何使模块在未来变得更好用。

## 什么是 JS 模块？

JS 模块（也称为“ES 模块”或“ECMAScript模块”）是 ES6 中一项非常重要的新语言特性。在此以前，你可能使用过用户级别的 JavaScript 模块系统。也许[在 Node.js 中的 CommonJS](https://nodejs.org/docs/latest-v10.x/api/modules.html)，或者是 [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)，或者其他的东西。所有这些模块系统都有一个共同点：允许导入和导出内容。

JavaScript 现在拥有标准化的语法来完成这些事。在一个模块中，可以使用 `export` 关键字来导出任何内容，比如一个 `const` ，一个 `function` 或任何其他变量绑定或是声明。只需在变量语句或声明前面加上 `export` 即可：

```js
// 📁 lib.mjs
export const repeat = (string) => `${string} ${string}`;
export function shout(string) {
  return `${string.toUpperCase()}!`;
}
```

然后可以使用 `import` 关键字从另一个模块导入模块。在这里，我们从 `lib` 模块导入 `repeat` 和 `shout` 函数，并在 `main` 模块中使用它们 ：

```js
// 📁 main.mjs
import {repeat, shout} from './lib.mjs';
repeat('hello');
// → 'hello hello'
shout('Modules in action');
// → 'MODULES IN ACTION!'
```

还也可以从模块中导出 *default* 值：

```js
// 📁 lib.mjs
export default function(string) {
  return `${string.toUpperCase()}!`;
}
```

这时候 `default` 导出可以使用任何名称导入：

```js
// 📁 main.mjs
import shout from './lib.mjs';
//     ^^^^^
```

模块与经典脚本有点不太一样：

* 模块默认开启[严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)。
* 模块中不支持 HTML 样式的注释语法。

  ```js
  // Don’t use HTML-style comment syntax in JavaScript!
  const x = 42; <!-- TODO: Rename x to y.
  // Use a regular single-line comment instead:
  const x = 42; // TODO: Rename x to y.
  ```
* 模块有一个顶级词法作用域。也就是说，如果在一个模块中运行 `var foo = 42;` *不会*创建一个名为 `foo`，可以在浏览器通过`window.foo` 访问的全局变量。
* 新的静态 `import` 和 `export` 语法仅在模块中可用，不适用于经典脚本。

正是由于这些差异，**相同的 JavaScript 代码在模块与经典脚本时可能会在处理上存在差异**。因此，JavaScript 运行时需要知道哪些脚本是模块。

## 在浏览器中使用 JS 模块

在 Web 上，可以将 `<script>` 元素中的 `type` 属性设置为 `module`，通过这种方式来告诉浏览器将其视为模块。

```html
<script type="module" src="main.mjs"></script>
<script nomodule src="fallback.js"></script>
```

能够解析 `type="module"` 的浏览器将忽略具有 `nomodule` 属性的脚本。这意味着，可以对支持模块的浏览器提供基于模块的代码，同时对其他不支持浏览器的提供 fallback 脚本。这个特性在性能上是有很大好处的，由于只有现代浏览器支持模块，如果浏览器能够解析模块，那应该还支持[模块之前的语言特性](https://codepen.io/samthor/pen/MmvdOM)，比如箭头函数或是 `async`- `await`。这样就不必在基于模块的包中编译这些语言特性，就能[为现代浏览器提供体积更小并且没有经过编译的代码](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)。只有传统浏览器才会降级使用带有 `nomodule` 的脚本。

### 模块和经典脚本之间的浏览器特定差异

现在已经了解，模块与经典脚本不同。除了上面列出的平台无关差异之外，还有一些浏览器特定差异。

比如，模块只会执行一次，而经典脚本则只要将其添加到 DOM 多少次就会执行多少次。

```html
<script src="classic.js"></script>
<script src="classic.js"></script>
<!-- classic.js executes multiple times. -->

<script type="module" src="module.mjs"></script>
<script type="module" src="module.mjs"></script>
<script type="module">import './module.mjs';</script>
<!-- module.mjs executes only once. -->
```

另外，模块脚本及其依赖关系通过 CORS 获取。也就是说，任何跨域模块脚本都必须提供正确的 HTTP 头部信息，比如 `Access-Control-Allow-Origin: *`。

另一个区别与 `async` 属性有关，它可以让脚本下载不阻止 HTML 解析器（就像 `defer`），但会立即执行脚本，不保证顺序，并且不需要等待 HTML 解析完成。`async` 属性不适用于内联经典脚本，但仍适用于内联 `<script type="module">`。

### 关于文件扩展名的说明

可能已经注意到我们正在使用 `.mjs` 作为模块的文件扩展名。在 Web 上，文件扩展名无关紧要，只要该文件是以[ JavaScript MIME 类型提供的 `text/javascript`](https://html.spec.whatwg.org/multipage/scripting.html#scriptingLanguages:javascript-mime-type)。从 script 元素的 `type` 属性，浏览器就能知道它是一个模块。

不过，我们建议在模块使用 `.mjs` 扩展名，原因有两个：

1. 在开发过程中，它清楚地表明该文件是一个模块，而不是一个普通的脚本。如前所述，模块的处理方式与普通脚本不同，因为必须通过某种方式表明其差异。
2. 与 Node.js 保持一致，[实验功能的模块实现](https://nodejs.org/api/esm.html)只支持带 `.mjs` 扩展名的文件。

**注意：**在 Web 上部署 `.mjs` ，需要在 Web 服务器将此扩展名配置成 `Content-Type: text/javascript`。另外，你可能还希望配置编辑器将 `.mjs` 文件视为 `.js` 文件来获得语法高亮显示，事实上大多数现代编辑已经默认这样做了。

### 模块标识符

在 `import` 模块时，指定模块位置的字符串称为“模块标识符”或“导入标识符”。在之前的例子中，模块表示哦符是 `'./lib.mjs'`：

```js
import {shout} from './lib.mjs';
//                  ^^^^^^^^^^^
```

todo

在浏览器中使用模块标识符有一些限制。目前不支持“纯”模块标识符，这个限制参考 [HTML 规范](https://html.spec.whatwg.org/multipage/webappapis.html#resolve-a-module-specifier) ，以便将来浏览器可以允许自定义模块加载器为纯模块标识符赋予特殊含义，如下所示：

```js
// Not supported (yet):
import {shout} from 'jquery';
import {shout} from 'lib.mjs';
import {shout} from 'modules/lib.mjs';
```

另一方面，下面的例子都是支持的：

```js
// Supported:
import {shout} from './lib.mjs';
import {shout} from '../lib.mjs';
import {shout} from '/modules/lib.mjs';
import {shout} from 'https://simple.example/modules/lib.mjs';
```

现在，模块标识符必须是完整的 URL，或是类似 `/`，`./` 或 `../` 的相对 URL 。

### 模块默认 defer

经典 `<script>` 元素默认阻止 HTML 解析器。我们可以通过添加 [`defer`属性](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer) 来保证了脚本下载与 HTML 解析同时进行。

![img](https://developers.google.com/web/fundamentals/primers/imgs/async-defer.svg)

而模块脚本默认 defer。因此，不需要添加 `defer` 到 `<script type="module">` 标签。不仅主模块的下载与 HTML 解析并行，所有依赖模块也是如此。

here

## 其他模块功能

### 动态 `import()`

到目前为止，我们只使用静态 `import`。使用静态 `import` 时，整个模块需要在主代码运行之前下载并执行。但有时，可能并不希望预先加载模块，而是按需加载模块，只有在用到时才加载，比如时在用户单击链接或按钮时，以此到达提高初始化性能的需求。这就是 [动态 `import()`](https://developers.google.com/web/updates/2017/11/dynamic-import) 。

```html
<script type="module">
  (async () => {
    const moduleSpecifier = './lib.mjs';
    const {repeat, shout} = await import(moduleSpecifier);
    repeat('hello');
    // → 'hello hello'
    shout('Dynamic import in action');
    // → 'DYNAMIC IMPORT IN ACTION!'
  })();
</script>
```

与静态 `import` 不同，动态 `import()` 可以在常规脚本中使用，可以从这里开始在现有代码库中逐步使用模块。有关更多详情，请参阅[我们关于动态 import 的文章](https://developers.google.com/web/updates/2017/11/dynamic-import)。

**注意：**[webpack 有它自己的实现版本](https://developers.google.com/web/fundamentals/performance/webpack/use-long-term-caching)，巧妙地将导入的模块分割成独立于主包的 chunk。

### `import.meta`

另一个与模块相关的新特性是 `import.meta`，提供有关当前模块的元数据。确切的元数据不是 ECMAScript 规范的一部分，这取决于宿主环境。比如在浏览器中，可能会获得与在 Node.js 中不同的元数据。

这是一个在 web 上使用 `import.meta` 的例子。默认情况下，图像时相对于当前 URL 加载，使用 `import.meta.url` 使它可以相对于当前模块加载。

```js
function loadThumbnail(relativePath) {
  const url = new URL(relativePath, import.meta.url);
  const image = new Image();
  image.src = url;
  return image;
}

const thumbnail = loadThumbnail('../img/thumbnail.png');
container.append(thumbnail);
```

## 性能建议

### 继续使用打包

借助模块，可以在不使用打包工具（如 webpack，Rollup 或 Parcel）的情况下开发网站。在以下情况下，直接使用原生 JS 模块会更具优势：

* 在本地开发时
* 在小型网络应用程序的生产环境，即总共少于 100 个模块并且具有相对较浅的依赖关系树（最大深度小于 5）

但是，正如我们之前所了解到的，[在加载由〜300个模块组成的模块化库，对 Chrome 加载管道进行性能瓶颈分析时](https://docs.google.com/document/d/1ovo4PurT_1K4WFwN2MYmmgbLcr7v6DRQN67ESVA-wq0/pub)，打包之后的加载性能优于非打包。

[![img](https://developers.google.com/web/fundamentals/primers/imgs/renderer-main-thread-time-breakdown.png)](https://docs.google.com/document/d/1ovo4PurT_1K4WFwN2MYmmgbLcr7v6DRQN67ESVA-wq0/pub)

其中一个原因是静态 `import`/ `export` 语法是静态可分析的，因此打包工具优可以通过消除未使用的导出优化代码。静态 `import` 和 `export` 不仅仅是语法，它们是一个非常关键的特性。

**成功：****我们的一般建议是在模块部署到生产之前继续使用打包工具。**在某种程度上，打包是一种压缩代码的优化方式，会带来性能上的好处，因为最终将传输更少的代码。

当然，[DevTools 的代码覆盖功能](https://developers.google.com/web/updates/2017/04/devtools-release-notes#coverage)可以帮助确定是否将不必要的代码推送给用户。我们还建议使用[代码拆分](https://developers.google.com/web/fundamentals/performance/webpack/use-long-term-caching#lazy-loading)来拆分包，并延迟加载非关键路径的脚本。

#### 在模块打包上的权衡

在 web 开发中，很多都是一种折衷。使用非打包模块可能会降低初始加载性能（冷缓存），但实际上可以提高后续访问（热缓存）的加载性能。对于一个没有使用代码拆分的 200 KB 的代码库，在更改一个细粒度的模块时，从服务器单独获取这个模块要比重新获取整个 bundle 更好。

如果你更关心使用热缓存的访问者的体验，而不是首次访问的性能，并且网站的细粒度模块少于几百个，那么可以尝试使用非打包模块。评估冷缓存和热缓存的加载性能，然后做出数据驱动的决定。

浏览器工程师正在努力改进即开即用的模块性能。随着时间的推移，预计在更多情况下，使用费打包模块将会成为可行。

### 使用细粒度模块

应该养成使用小而细的模块编写代码的习惯。在开发过程中，更好的方式是在一个文件中使用更少的导出。

比如一个名为 `./util.mjs` 的模块，导出三个函数 `drop`，`pluck` 以及 `zip`：

```js
export function drop() { /* … */ }
export function pluck() { /* … */ }
export function zip() { /* … */ }
```

如果代码库仅仅需要 `pluck` 函数，那么可能会按如下方式进行导入：

```js
import { pluck } from './util.mjs';
```

在这种情况下（没有使用构建时打包步骤），浏览器仍然需要下载，解析和编译整个 `./util.mjs` 模块，即使需要的只是其中的一个导出。这很浪费。

如果 `pluck` 不he`drop` 和 `zip` 共享任何代码，更好的方式是把它移动到自己的细粒度模块，比如 `./pluck.mjs`：

```js
export function pluck() { /* … */ }
```

然后我们可以导入 `pluck` 而不需要处理 `drop` 和 `zip`：

```js
import { pluck } from './pluck.mjs';
```

**注意：**可以在这哭使用 `default` 导出而不是命名导出，取决于你的个人偏好。

这不仅可以让源代码更加简单，而且还可以减少打包工具消除死代码的需求。如果源代码树中的某个模块未被使用，那么它永远不会被导入，所以浏览器永远不会下载它。浏览器可以单独为该模块进行[代码缓存](https://v8project.blogspot.com/2018/04/improved-code-caching.html)。

使用小而细的模块有助于为将来的[原生打包解决方案](https://developers.google.com/web/fundamentals/primers/modules#web-packaging)做好准备。

### 预加载模块

还可以通过使用 [`<link rel="modulepreload">`](https://developers.google.com/web/updates/2017/12/modulepreload) 进一步优化模块。这样，浏览器可以预加载，甚至可以预解析以及预编译模块及其依赖关系。

```js
<link rel="modulepreload" href="lib.mjs">
<link rel="modulepreload" href="main.mjs">
<script type="module" src="main.mjs"></script>
<script nomodule src="fallback.js"></script>
```

对于一个更大的依赖树，这一点尤其重要。如果没有 `rel="modulepreload"`，浏览器需要执行多个 HTTP 请求来找出完整的依赖关系树。但是，如果声明依赖模块脚本的完整列表 `rel="modulepreload"`，那浏览器就不必逐步去发现这些依赖关系。

### 使用 HTTP/2

如果可能的话，使用 HTTP/2 是一个很好的性能建议，比如仅仅是为了[多路复用支持](https://developers.google.com/web/fundamentals/performance/http2/#request_and_response_multiplexing)。通过 HTTP/2 多路复用，多个请求和响应消息可以同时在运行，这对加载模块树很有帮助。

Chrome 团队调查了另一个 HTTP/2 功能，[HTTP/2 服务器推送功能](https://developers.google.com/web/fundamentals/performance/http2/#server_push)是否可以成为部署高度模块化应用程序的实用解决方案。不幸的是，[HTTP/2 服务器推送很困难](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/)，Web 服务器和浏览器的实现目前还没有针对高度模块化的Web 应用进行优化。比如，很难仅推送用户尚未缓存的资源，解决这个问题的一种方式是将源的整个缓存状态传达服务器，但这会带来隐私风险。

所以通过一切手段，继续使用 HTTP/2，但是 HTTP/2 服务器推送并不是一个银弹。

## JS 模块在 Web 的使用情况

在 web 上正在逐渐使用 JS 模块。[我们的使用情况计数器](https://www.chromestatus.com/metrics/feature/timeline/popularity/2062) 显示仅 0.08％ 的页面在使用 `<script type="module">`。注意，该数字不包括其他入口点，例如动态 `import()` 或[worklets](https://drafts.css-houdini.org/worklets/)。

## JS 模块的下一步是什么？

Chrome 团队正在尝试各种方式改善 JS模块 的开发体验，现在来讨论其中的一些。

### 更快和确定的模块解析算法

我们提出了改变模块分辨率算法，以解决速度和确定性的不足。新算法现在既生活在[HTML规范中](https://github.com/whatwg/html/pull/2991)，也生活在[ECMAScript规范中](https://github.com/tc39/ecma262/pull/1006)，并在[Chrome 63中](http://crbug.com/763597)实现。预计这种改进很快就会在更多的浏览器中登陆！

新算法效率更高，速度更快。旧算法的计算复杂度是依赖图大小的二次方，即O（n2），Chrome的实现也是如此。新算法是线性的，即O（n）。

而且，新算法以确定性方式报告分辨率错误。给定一个包含多个错误的图，旧算法的不同运行可能会报告不同的错误，因为它们会导致解析失败。这使得调试非常困难。新算法保证每次都报告相同的错误。

### Worklets 和 web workers

Chrome现在实现了 [wokelets](https://drafts.css-houdini.org/worklets/)，它允许 web 开发人员在 web 浏览器的“低级部分”中自定义硬编码逻辑。通过使用 worklets，Web 开发人员可以将 JS 模块提供给渲染管道或音频处理管道（未来可能还会有更多管道）。

Chrome 65 支持 [`PaintWorklet`](https://developers.google.com/web/updates/2018/01/paintapi)（又名 CSS Paint API）来控制 DOM 元素的绘制方式。

```js
const result = await css.paintWorklet.addModule('paint-worklet.mjs');
```

Chrome 66 支持 [`AudioWorklet`](https://developers.google.com/web/updates/2017/12/audio-worklet)，可使用自己的代码控制音频处理。同时加入 [OriginTrial for`AnimationWorklet`](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AZ-PYPMS7EA/DEqbe2u5BQAJ)，可以用来创建滚动链接和高性能程序动画。

最后，[`LayoutWorklet`](https://drafts.css-houdini.org/css-layout-api/)（也就是 CSS 布局 API）在 Chrome 67 中实现。

我们正在[实现](https://bugs.chromium.org/p/chromium/issues/detail?id=680046)为 Chrome 中专用 web worker 提供 JS 模块的支持。可以在 `chrome://flags/#enable-experimental-web-platform-features` 启用后尝试使用此功能 。

```js
const worker = new Worker('worker.mjs', { type: 'module' });
```

JS 模块支持 shared worker 和 service worker 即将到来：

```js
const worker = new SharedWorker('worker.mjs', { type: 'module' });
const registration = await navigator.serviceWorker.register('worker.mjs', { type: 'module' });
```

### 包名称映射

在 Node.js/npm 中，通过“包名称”导入 JS 模块的很常见。例如：

```js
import moment from 'moment';
import { pluck } from 'lodash-es';
```

目前，[根据 HTML 规范](https://html.spec.whatwg.org/multipage/webappapis.html#resolve-a-module-specifier)，这种“纯导入标识符”会引发异常。[我们提出包名称映射的提案](https://github.com/domenic/package-name-maps)允许此类代码在 Web 上运行，包括在生产应用程序中。包名称映射是一种 JSON 资源，可帮助浏览器将纯导入标识符转换为完整的 URL。

包名称映射仍处于提案阶段。尽管我们已经考虑了很多关于他们如何解决各种用例的问题，但我们仍然与社区合作，并且尚未编写完整的规范。

### web packing：native bundles

Chrome 浏览器加载团队目前正在探索[一种原生的 web 打包格式，](https://github.com/WICG/webpackage)作为分发网络应用的新方式。其核心功能是：

[签名的 HTTP Exchange](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html)允许浏览器相信单个 HTTP 请求/响应对由其声称的来源生成; [打包的 HTTP Exchange](https://wicg.github.io/webpackage/draft-yasskin-dispatch-bundled-exchanges.html)，即一组交换，每个交换都可以是签名或未签名的，其中一些元数据描述如何将包作为一个整体解析。

这样的组合打包格式将使 *多个相同来源的资源* 被 *安全地嵌入* *单个* HTTP `GET` 响应。

现有的打包工具（如 webpack，Rollup 或 Parcel）目前发出单个 JavaScript 包，其中原始独立模块的语义丢失。使用原生软件包，浏览器可以将资源分解回原来的形式。简而言之，可以将 Bundled HTTP Exchange 想象成可通过内容目录（清单）以任意顺序访问的资源束，并且根据其相对重要性可以有效存储和标记所包含的资源，所有同时保持个人文件的概念。正因为如此，原生软件包可以改善调试体验。在 DevTools 中查看资源时，浏览器可以精确定位原始模块，而不需要复杂的 source map。

基于原生打包格式的透明度，可以轻松实现优化。比如，如果浏览器已经拥有本地缓存的一部分，它可以将其传输到 Web 服务器，然后只下载缺少的部分。

Chrome 已经支持提案（[`SignedExchanges`](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html)）的一部分，但打包格式本身以及其对高度模块化应用的应用仍处于探索阶段。

### 分层 API

发布新功能和Web API会导致持续的维护和运行时成本 - 每个新功能都会污染浏览器名称空间，增加启动成本，并且代表了在整个代码库中引入错误的新表面。[分层API](https://github.com/drufball/layered-apis) 旨在以更具扩展性的方式实现和发布带有Web浏览器的更高级API。JS模块是分层API的关键支持技术：

* 由于模块是明确导入的，因此需要通过模块公开分层的API，以确保开发人员只支付他们使用的分层API。
* 由于模块加载是可配置的，分层API可以具有内置机制，用于在不支持分层API的浏览器中自动加载polyfills。

模块和分层 API 如何协同工作的细节[仍在制定中](https://github.com/drufball/layered-apis/issues)，但目前的提案看起来像这样：

```html
<script
  type="module"
  src="std:virtual-scroller|https://example.com/virtual-scroller.mjs"
></script>
```

该`<script>`元素`virtual-scroller`从浏览器的内置分层API集（`std:virtual-scroller`）或从指向polyfill的回退URL 加载API 。这个API可以完成JS模块在Web浏览器中可以执行的任何操作。一个例子是定义[一个自定义 ``元素](https://www.chromestatus.com/feature/5673195159945216)，以便根据需要逐步增强以下HTML：

```html
<virtual-scroller>
  <!-- Content goes here. -->
</virtual-scroller>
```