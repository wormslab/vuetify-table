/* eslint-disable */

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VuetifyTable from './VuetifyTable.vue'
import TransitionOnEvent from './TransitionOnEvent'
Vue.config.productionTip = false

Vue.use(Vuetify);
Vue.component('vuetify-table', VuetifyTable);
Vue.component('transition-on-event', TransitionOnEvent);

new Vue({
  render (h) {
    return h('v-app', [
      h('div', { class: 'elevation-1 ma-3' }, [ h('transition-on-event') ])

    ])
  }
}).$mount('#app')
