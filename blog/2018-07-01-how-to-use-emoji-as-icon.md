# 如何将 emoji 当成单色 icon 使用

> 原文：[How to Use Emojis as Icons](https://preethisam.com/2018/06/25/how-to-use-emojis-as-icons/)
> 
> 作者：[Preethi Sam](https://twitter.com/rpsthecoder)

## 使用单色 emoji

在 web 设计中 icon 变得越来越重要，在网上有很多关于 icon 的资源，免费的付费的都有。在这里，介绍如何运用一种已经我们非常熟悉的方式 -- emoji ，来当成 icon 使用。

emoji 的一个好处是已经在系统中内置，而 icon 资源还需要从站点服务器获取。emoji 只是一些跟普通文本类似的简单字符，所以这会是传统 icon 图片的一种很好的替代方式。

使用 emoji 很简单，只需要通过键盘将其作为文本添加到 HTML 中，或者是直接使用它们的 Unicode 字符码点。但要把它们当成 icon 使用，还有一点问题。

通常，icon 是单色组成的形状，但 emoji 并不是。

可以使用 `text-shadow` 来实现将其变成单色。

```html
<ul>
	<li><span class=icon>🚲</span>   Bicycles</li>
	<li><span class=icon>✈️</span>   Planes</li>
	<li><span class=icon>🚂</span>   Trains</li>
</ul>
<ul>
	<li><span class=icon>📥</span>   Inbox</li>
	<li><span class=icon>📤</span>   Outbox</li>
	<li><span class=icon>📁</span>   Folder</li>
</ul>
```

加点 css:

```css
.icon {
	color: transparent;
	text-shadow: 0 0 #ec2930;
}
```

[CodePen: Emojis as Icons](https://codepen.io/rpsthecoder/pen/rKrMrj)

将 `color` 设置成 `transparent` 会隐藏原本的 emoji，然后我们看到的其实是它的阴影。

另一种实现方式是使用 `background-clip`：

```css
.icon {
	color: transparent;
	background-color: #ec2930;
	background-clip: text;
	-webkit-background-clip: text;
}
```

使用这种方式，还可以设置渐变背景来获得渐变色的 icon ：

```css
.icon {
	color: transparent;
	background-image: linear-gradient(45deg, blue, red);
	background-clip: text;
	-webkit-background-clip: text;
}
```

[Emojis as Icons: gradient](https://codepen.io/mirreal/pen/MXLppr)

## Unicode 与 emoji

在上述例子中的 6 个 emoji，有一个跟其余 5 个是不同类型，就是 ✈️。我们已经了解，emoji 不是什么魔法，就是一个 Unicode 字符，不同的系统会对其做不同处理，比如在 Windows 7 及以前这些字符本来都是单色的，大概到现在主流的 Windows 10 已经有了各种五颜六色的 emoji。先看看例子中 6 个 emoji 的码点：

```js
'🚲'.codePointAt().toString(16) // 1f6b2
'✈️'.codePointAt().toString(16) // 2708
'🚂'.codePointAt().toString(16) // 1f682
'📥'.codePointAt().toString(16) // 1f4e5
'📤'.codePointAt().toString(16) // 1f4e4
'📁'.codePointAt().toString(16) // 1f4c1
```

除了 '✈️'，其余 emoji 都不在 Unicode 基本平面（U+0000 ~ U+FFFF）。

很久很久以前，人们以为这世界上的各种符号只需要 16 位就可以搞定，即 65536 个字符。后来发现根本不够用，于是开始进行扩展，增加了 16 个辅助平面，可以表示的范围是 U+000000 ~ U+10FFFF。JavaScript 中采用的 Unicode 编码方式是 utf-16，基本平面的使用两个字节表示一个字符，辅助平面的需要四个字节。字符的 Unicode 的表示法在 JavaScript 中如下：

```
\uxxxx
```

`xxxx` 表示字符的 Unicode 码点，范围是 \u0000~\uFFFF。比如：

```js
console.log('\u2708') // ✈
```

这个飞机 ✈ 长得有点奇怪，跟例子中的 ✈️ 根本就不是一个。Why?

```js
'✈️'.length // 2
```
'✈️' 的长度也是 2，不妨看看第二位的码点

```js
'✈️'.codePointAt(1).toString(16) // fe0f
```

fe0f 这其实是一个 emoji [异体字选择符](https://www.unicode.org/charts/PDF/UFE00.pdf)，就是[将之前版本已经存在的字符进行 emoji 转换](http://unicode.org/emoji/charts/emoji-variants.html)。

所以，需要这样一起使用：

```js
console.log('\u2708\ufe0f') // ✈️
```

其余 5 个 emoji，本身就是码点超过 \uffff 的字符，在 ES6 新增一种表示法：

```
\u{xxxxxx}
```

就像这样：

```js
console.log('\u{1f6b2}') // 🚲
console.log('\u{1f682}') // 🚂
console.log('\u{1f4e5}') // 📥
console.log('\u{1f4e4}') // 📤
console.log('\u{1f4c1}') // 📁
```

当然，也是可以通过 `charCodeAt ` 获取不同位置的码点，使用老派表示法：

```js
const h = '🚂'.charCodeAt(0).toString(16) // d83d
const l = '🚂'.charCodeAt(1).toString(16) // de82
console.log(String.fromCharCode(0xd83d, 0xde82)) // 🚂
console.log('\ud83d\ude82') // 🚂
```

基本平面的 /ud800 到 /udfff 是空段，辅助平面共有 2^20 个字符，在 utf-16 编码时，高位映射到 /ud800 到 /udbff（空间大小 2^10，即 0x400)，低位映射到 /udc00 到 /udfff，对应的映射规则计算方式是：

```js
H = Math.floor((char - 0x10000) / 0x400) + 0xD800

L = (char - 0x10000) % 0x400 + 0xDC00
```

所以，当知道其码点时，还可以直接计算其编码。
