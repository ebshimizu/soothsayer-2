import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import unhandled from 'electron-unhandled'
import { shell } from 'electron'

unhandled({
  reportButton: (error) => {
    const body = `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n`
    shell.openExternal(
      `https://github.com/ebshimizu/soothsayer-2/issues/new?body=${encodeURIComponent(
        body,
      )}`,
    )
  },
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  vuetify,
  template: '<App/>',
}).$mount('#app')
