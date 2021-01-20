import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Cast Info',
      component: require('@/components/GeneralInfo').default,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: require('@/components/AppSettings').default,
    },
    {
      path: '/theme',
      name: 'Theme',
      component: require('@/components/ThemeSettings').default,
    },
    {
      path: '/status',
      name: 'Status',
      component: require('@/components/AppStatus').default,
    },
  ],
})
