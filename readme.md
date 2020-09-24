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

4) 使用 lerna 来发布到 npm 仓库。

```
lerna publish
```

5. 对外发布的库 请在名称前加 @xb，如`@xiaobaoonline/xbui`

9) 本地 commit 后运行 `lerna publish` 会`npm publish` 并 `git push`到仓库

10) `@xb\xbui` 的使用方法请转至 [筛选组件文档](https://www.yuque.com/docs/share/4591256d-5cbb-4413-a733-123b8fad1b3c?#) ，正在预研 gitlab 是否支持 gitpages

11) 按照 xbfilter 的方法

```
npm config set registry http://repository.xiaobao100.com/npm/xiaobao-npm
npm install @xb\xbui -s
```
