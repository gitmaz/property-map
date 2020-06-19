import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store/store'
import router from './router'

Vue.config.productionTip = false

import VueMapbox from "vue-mapbox";
import Mapbox from "mapbox-gl";
Vue.use(VueMapbox, { mapboxgl: Mapbox });

import VueMobileDetection from 'vue-mobile-detection'
Vue.use(VueMobileDetection)

import VueToastr from "vue-toastr";
Vue.use(VueToastr, {});


new Vue({
  store,
  router,
  render: h => h(App),
  created () {
  },
  mounted(){

  }
}).$mount('#app')
