import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '../views/SignUp.vue'
import ModerationView from '../views/ModerationView.vue'
import IdeasView from '../views/IdeasView.vue'
import VideosView from '../views/VideosView.vue'
import QAView from '@/views/QAView.vue'
import ModerationVideoView from '@/views/ModerationVideoView.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import ModerationIdeasComponent from '@/components/ModerationIdeasComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'profile',
      component: ProfileComponent
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/moderation',
      name: 'moderation',
      component: ModerationView
    },
    {
      path: '/ideas',
      name: 'ideas',
      component: IdeasView
    },
    {
      path: '/videos',
      name: 'videos',
      component: VideosView
    },
    {
      path: '/q&a',
      name: 'qa',
      component: QAView
    },
    {
      path: '/moderation/videos',
      name: 'moderation-videos',
      component: ModerationVideoView
    },
    {
      path: '/moderation/ideas',
      name: 'moderation-ideas',
      component: ModerationIdeasComponent
    }
  ]
})

export default router
