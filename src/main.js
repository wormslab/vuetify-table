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
  { key: 'servicePeriod.startAt', text: '시작일' },
  { key: 'servicePeriod.endAt', text: '종료일' },
]

const data = [
  { id: 1000, name: 'foo', servicePeriod: { startAt: '2018-07-01', endAt: '2018-07-31' } },
  { id: 1000, name: 'foo', servicePeriod: { startAt: '2018-07-01', endAt: '2018-07-31' } },
]

const attrs = {
  columns,
  data,
  page: 1,
  rowsPerPage: 10,
  totalElements: 253
}

const clazz = [ 'elevation-1' ]

new Vue({
  render: h => h('v-app', [
    h('div', { class: 'elevation-1', style: 'width: 800px' }, [
      h('vuetify-table', { class: clazz, attrs })
    ])
  ])
}).$mount('#app')
