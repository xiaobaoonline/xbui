1. 强依赖 lerna 请先安装 lerna

```
yarn global add lerna
npm install lerna -g
```

2. 使用 lerna 来安装依赖（子包之间存在依赖关系，所以请在根节点处安装）

```
lerna bootstrap
```

3. 2.5 在发布之前需要设置 npm 库配置（暂时只写在 xb 私有 npm 仓库里）

```
npm config set registry http://repository.xiaobao100.com/npm/xiaobao-npm
npm config set always-auth true
npm adduser
// 账号密码按需给
```

4. 使用 lerna 来发布到 npm 仓库。

```
lerna publish
```

5. 对外发布的库 请在名称前加 @xb，如`@xb/xbui`
   如果发布带有@符号的包失败， 使用命令 `npm publish --access=public clickoutside`

6. ~~每次发布时，请更新版本号~~ 版本号自动更新，不用改了

7. ~~测试一下 竟然需要 commit 才能变化吗？~~ publish 前请先 commit
8. ~~试了半天 竟然是我 workspace 写错了！！！~~
9. 本地 commit 后运行 `lerna publish` 会`npm publish` 并 `git push`到仓库

10. `@xb\xbui` 的使用方法请转至 [筛选组件文档](https://www.yuque.com/docs/share/4591256d-5cbb-4413-a733-123b8fad1b3c?#) ，正在预研 gitlab 是否支持 gitpages

11. 按照 xbfilter 的方法

```
npm config set registry http://repository.xiaobao100.com/npm/xiaobao-npm
npm install @xb\xbui -s
```
