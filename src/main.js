import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VuetifyTable from './VuetifyTable.vue'
Vue.config.productionTip = false

Vue.use(Vuetify);
Vue.component('vuetify-table', VuetifyTable);

new Vue({
  render: h => h('v-app', [ h('vuetify-table', { attrs: { } }) ])
}).$mount('#app')
