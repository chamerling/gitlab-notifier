import 'vuetify/dist/vuetify.min.css';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import gitlab from './gitlab';
import Vuetify from 'vuetify';
import VueMoment from 'vue-moment';

Vue.config.productionTip = false
Vue.use(Vuetify);
Vue.use(VueMoment);

gitlab.init(store);
console.log('INIT')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
