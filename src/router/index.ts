import { createRouter, createWebHistory } from 'vue-router'
import PlayerRating from '../views/PlayerRating.vue'
import AquireToken from '../views/AquireToken.vue'
import HomePage from '../views/HomePage.vue'
import OAuthGetBox from '../views/OAuthGetBox.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
     path: '/AquireToken',
     name: 'AquireToken',
     component: AquireToken
   },
   {
    path: '/OAuthGetBox',
    name: 'OAuthGetBox',
    component: OAuthGetBox
  },
     {
      path: '/playerRating',
      name: 'PlayerRating',
      component: PlayerRating
    }
  ]
})

export default router
