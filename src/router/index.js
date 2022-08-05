import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue'),
    meta: {
      authorization: true,
      title: '比赛',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/twinkingstar',
    name: 'Twinkingstar',
    component: () => import('../views/Twinkingstar.vue'),
    meta: {
      authorization: true,
      title: '比赛态势',
    },
  },
  {
    path: '/countdown',
    name: 'CountDown',
    component: () => import('../views/CountDown.vue'),
    meta: {
      authorization: true,
      title: '比赛倒计时',
    },
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
