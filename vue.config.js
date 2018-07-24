const NODE_ENV = process.env.NODE_ENV || 'development'
const externals = {
  moment: 'moment',
  underscore: 'underscore'
};

module.exports = {
  css: {
    extract: true
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    externals: NODE_ENV === 'development' ? {} : externals
  }
}
