import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/general',
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
    {
      path: '/',
      name: 'Dashboard',
      component: require('@/components/AppDashboard').default,
    },
    {
      path: '/tournament',
      name: 'Tournament Info',
      component: require('@/components/TournamentInfo').default,
    },
    {
      path: '/whiteboard',
      name: 'Whiteboard',
      component: require('@/components/WhiteBoard').default,
    },
    {
      path: '/graphics',
      name: 'Motion Graphics',
      component: require('@/components/MotionGraphics').default,
    },
  ],
})
