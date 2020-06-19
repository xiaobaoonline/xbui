const pub = require('./config.pub');

module.exports = {
  runtimeCompiler: true,
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.ts',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'pl-app document',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  configureWebpack: {
    resolve: {
      ...pub.resolve,
      // alias: {
      //   vue$: 'vue/dist/vue.esm.js',
      // },
    },
  },
  chainWebpack: config => {
    config.module
      .rule('lessloader')
      .test(/.less$/)
      .use('lessloader')
      .loader('vue-style-loader')
      .loader('css-loader')
      .tap(() => {
        return {
          sourceMap: true,
        };
      })
      .loader('less-loader')
      .tap(() => {
        return {
          sourceMap: true,
          //   modifyVars: JSON.parse(
          //     fs.readFileSync(resolve('./src/styles/custom-less.json'))
          //   ),
          javascriptEnabled: true,
        };
      });
    // .loader("ts-loader")
    // .test(/\.tsx?$/, /.vue$/);
  },
};
