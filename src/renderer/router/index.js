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
      path: '/lower-third',
      name: 'Lower Third',
      component: require('@/components/LowerThird').default,
    },
    {
      path: '/notepad',
      name: 'Note Pad',
      component: require('@/components/NotePad').default,
    },
    {
      path: '/schedule',
      name: 'Schedule',
      component: require('@/components/EventSchedule').default,
    },
    {
      path: '/players-teams',
      name: 'Players and Teams',
      component: require('@/components/PlayersTeams').default,
    },
    {
      path: '/about',
      name: 'About Soothsayer',
      component: require('@/components/AppAbout').default,
    },
    {
      path: '/scoreboard',
      name: 'Scoreboard',
      component: require('@/components/ScoreBoard').default,
    },
  ],
})
