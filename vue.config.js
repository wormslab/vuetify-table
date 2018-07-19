module.exports = {
  css: {
    extract: true
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    externals: {
      vuetify: 'Vuetify',
      moment: 'moment',
      underscore: 'underscore'
    }
  }
}
