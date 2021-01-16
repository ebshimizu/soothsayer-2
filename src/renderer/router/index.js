import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'General Info',
      component: require('@/components/GeneralInfo').default
    },
    {
      path: '/settings',
      name: 'Settings',
      component: require('@/components/AppSettings').default
    }
  ]
})
