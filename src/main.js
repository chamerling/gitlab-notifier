import 'vuetify/dist/vuetify.min.css';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify from 'vuetify';
import Gitlab from './gitlab';

Vue.config.productionTip = false
Vue.use(Vuetify);

const gl = new Gitlab(store);
gl.watchMergeRequests();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
