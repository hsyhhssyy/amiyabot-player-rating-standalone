import { createRouter, createWebHistory } from 'vue-router'
import PlayerRating from '../views/PlayerRating.vue'
import AquireToken from '../views/AquireToken.vue'
import RatingRule from '../views/RatingRule.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AquireToken',
      component: AquireToken
    },{
      path: '/playerRating',
      name: 'PlayerRating',
      component: PlayerRating
    },{
      path: '/ratingRule',
      name: 'RatingRule',
      component: RatingRule
    }
  ]
})

export default router
