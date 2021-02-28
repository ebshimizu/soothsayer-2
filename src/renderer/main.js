import Vue from 'vue'
import VueI18n from 'vue-i18n'

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
Vue.use(VueI18n)

Vue.config.productionTip = false

// i18n config
const messages = {
  en: require('@/locales/en.json'),
}

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  vuetify,
  i18n,
  template: '<App/>',
}).$mount('#app')
