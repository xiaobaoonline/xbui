module.exports = {
  runtimeCompiler: true,
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
        }
      })
      .loader('less-loader')
      .tap(() => {
        return {
          sourceMap: true,
          //   modifyVars: JSON.parse(
          //     fs.readFileSync(resolve('./src/styles/custom-less.json'))
          //   ),
          javascriptEnabled: true,
        }
      })

    // config.resolve.alias.set('vue$', resolve('vue/dist/vue.esm.js'))
  },
}
