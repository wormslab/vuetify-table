import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VuetifyTable from './VuetifyTable.vue'
Vue.config.productionTip = false

Vue.use(Vuetify);
Vue.component('vuetify-table', VuetifyTable);

const columns = [
  { key: 'id', text: '아이디' },
  { key: 'name', text: '이름' },
  { key: 'deep.foo', text: '푸우' },
]

const data = [
  { id: 1000, name: 'foo', deep: { foo: 'foo' } },
  { id: 1000, name: 'foo', deep: { foo: 'bar' } },
]


new Vue({
  render: h => h('v-app', [ h('vuetify-table', { attrs: { columns, data } }) ])
}).$mount('#app')
