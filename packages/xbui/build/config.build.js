const { resolve } = require('./utils');
const pub = require('./config.pub');

module.exports = {
  outputDir: resolve('dist'),
  configureWebpack: {
    entry: {
      xbui: resolve('./src/index.ts'),
    },
    output: {
      filename: 'index.js',
      libraryTarget: 'umd',
      libraryExport: 'default',
      library: 'xbui',
      umdNamedDefine: true,
    },
    resolve: pub.resolve,
    externals: {
      vue: 'Vue',
      moment: {
        root: 'moment',
        commonjs2: 'moment',
        commonjs: 'moment',
        amd: 'moment',
      },
      'ant-design-vue': 'antd',
      'vue-property-decorator': 'vue-property-decorator',
    },
    optimization: {
      // minimize: false,
    },
  },
  css: {
    sourceMap: true,
    extract: {
      filename: 'style.css',
    },
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks');
    config.plugins.delete('copy');
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    config.plugins.delete('html');
    config.plugins.delete('hmr');
    config.entryPoints.delete('app');

    config.module
      .rule('lessloader')
      .test(/.less$/)
      .use('lessloader')
      .loader('vue-style-loader')
      .loader('css-loader')
      .tap(() => {
        return {
          sourceMap: false,
        };
      })
      .loader('less-loader')
      .tap(() => {
        return {
          sourceMap: false,
          //   modifyVars: JSON.parse(
          //     fs.readFileSync(resolve('./src/styles/custom-less.json'))
          //   ),
          javascriptEnabled: true,
        };
      });
  },
};
