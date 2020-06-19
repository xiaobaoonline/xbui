module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'false',
      },
    ],
  ],
  plugins: ['lodash'],
  env: {
    jest: {
      presets: [
        '@vue/app',
        {
          corejs: '3', // <---  此处加个这个，就没有报错警告了
          useBuiltIns: 'entry',
        },
      ],
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
};
