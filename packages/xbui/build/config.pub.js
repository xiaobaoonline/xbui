const utils = require('./utils');

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts', 'tsx'],
    alias: {
      src: utils.resolve('src'),
      components: utils.resolve('components'),
      xbfilter: utils.resolve('src/index.ts'),
    },
  },
};
