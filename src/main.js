import Vue from 'vue';

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/pagination.css';
import '@/assets/css/popover.css';
import '@/assets/css/message.css';
import '@/assets/css/dialog.css';
// import '@/assets/css/tooltip.css';
import './assets/font/font.css';

import App from './App.vue';
import store from './store';
import router from './router';
import ElementUI from 'element-ui';
import * as request from './common/http-service';

ElementUI.Dialog.props.lockScroll.default = false;

Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.prototype.channels = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$request = request;

/**
 * 时间格式化
 * @param fmt
 * @returns {*}
 */
Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1,                      //月份
    'd+': this.getDate(),                           //日
    'h+': this.getHours(),                          //小时
    'm+': this.getMinutes(),                        //分
    's+': this.getSeconds(),                        //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds()                     //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
};

let title = "信息安全对战平台";

// 全局路由守卫
router.beforeEach(async (to, from, next) => {

  // 前端鉴权
  if (to.meta.hasOwnProperty('authorization') && !store.state.is_login) {
    try {
      let res = await request.exec('post', 'checkin', null, Vue);
      store.commit('login', res.data)
    }catch (e) {
      ElementUI.Message.warning('请先登录！');

      if (from.path === to.path && from.fullPath === to.fullPath) {
        next({ path: '/login' });
      } else {
        next({ path: from.path });
      }

      return;
    }
  }

  if (store.state.userInfo.is_superuser && to.name === 'Index') {
    next({ name: 'Twinkingstar' });

    return;
  }

  if (!store.state.userInfo.is_superuser && (to.name === 'Twinkingstar' || to.name === 'CountDown')) {
    next({ name: 'Index' });

    return;
  }

  to.meta.hasOwnProperty('title') ? document.title = to.meta.title + " | " + title : title;

  next();
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
