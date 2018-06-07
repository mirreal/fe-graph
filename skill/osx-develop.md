# 基于 OS X 开发指南

## MAC 快捷键

```
Command 鍵 ⌘
Shift 鍵 ⇧
Option 鍵 ⌥
Control 鍵 ⌃
Caps Lock 鍵 ⇪
Fn 鍵
```

## 使用 Homebrew 安装软件

OS X 包管理器，类似于 CentOS 的 `yum` , unbuntu 的 `apt-get`

### 安装 brew

```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### 基础用法

```sh
# 安装 wget
brew install wget

# 卸载 wget
brew unstall wget

# 查询(后面可以是一个正则表达式）
brew search /wget*/

# 查看包是否需要更新
brew outdated

# 更新安装包
brew upgrade <package_name>

# 清理旧版本的包
brew cleanup

# 查看已安装的包(包括版本号)
brew list --versions
```

其他常见用法，可直接输入 `brew` 查看。

### Homebrew Cask

安装和管理 OS X 图形界面程序

#### 安装 cask

```sh
brew install brew-cask
```

#### 使用 Homebrew Cask 安装软件

```sh
# 安装 chrome
brew cask install google-chrome
```

## 打造一个舒适的终端

### 安装 iTerm2

```sh
brew cask install iterm2
```

### zsh

一种 shell 类型语言，兼容 `bash` 语法，支持类似 tab 补全等功能

```sh
# 安装 zsh
brew install zsh

# 变更默认 shell
chsh -s /bin/zsh
```

### oh my zsh

一个简化管理 zsh 配置的工具

自动安装

```sh
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

配置都在 `.zshrc` 里

[ZSH 主题大全](http://zshthem.es/all/)

```sh
# 主题
ZSH_THEME="dst"

# 插件
plugins=(git textmate ruby autojump osx mvn gradle)
```

## 推荐安装软件

### IDE/Editor

* WebStorm
* Sublime
* VSCode
* Atom

#### 在命令行使用 Sublime

```sh
ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/sublime
```

example

```sh
# 打开当前目录
sublime .

# 打开某个文件
sublime redux.js
```

#### 如果使用 vscode

Open the Command Palette (⇧⌘P) and type 'shell command' to find the Shell Command: Install 'code' command in PATH command.

https://code.visualstudio.com/docs/setup/mac

### 代理工具
    
* charles
* anyproxy

### 开发工具

* switchHost host 管理
* postman http 请求
