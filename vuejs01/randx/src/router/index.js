import Vue from 'vue'
import VueRouter from  'vue-router'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/user/:id',
    name: 'user',
    component: User,
    children: [
      {
        path: 'profile',
        component : ()=>import('@/views/Profile.vue')
      },
      {
        path: 'posts',
        component : ()=>import('@/views/Posts.vue')
      }
    ],
    props: true,
    // props: (route)=>({
    //   id: route.params.id,
    //   title: route.query.title
    // })
  },
  {
    path: '/page',
    name: 'page',
    component: ()=>import('@/views/Page.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import('@/views/Login.vue')
  },
  {
    path: '/notes',
    name: 'notes',
    component: ()=>import('@/views/Notes.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/edit',
    name: 'edit',
    component: ()=>import('@/views/Editor.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/blog',
    name: 'blog',
    component: ()=>import('@/views/Blog.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '*',
    name: '404',
    component: ()=>import('@/views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})


export default router