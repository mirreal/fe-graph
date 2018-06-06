# http 记住密码

设置记住密码（默认15分钟）：

```sh
git config --global credential.helper cache
```

如果想自己设置时间，可以这样做：

```sh
git config credential.helper 'cache --timeout=3600'
```

这样就设置一个小时之后失效

长期存储密码：

```sh
git config --global credential.helper store
```