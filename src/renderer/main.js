import Vue from 'vue'
import App from './App'
import 'font-awesome/css/font-awesome.min.css'
import 'bulma/css/bulma.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
