import axios from 'axios';
import qs from 'qs';
import { Message, Loading } from 'element-ui';

export const baseURL = 'http://127.0.0.1:8000';
// export const baseURL = '';
export const baseVer = 'v1';

axios.defaults.timeout = 30000;
axios.defaults.baseURL = `${baseURL}/${baseVer}/`;

/**
 * HTTP 请求 拦截器
 */
axios.interceptors.request.use(
  config => {
    config.headers['X-Token'] = localStorage.getItem('_USERTOKEN');
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器即异常处理
 */
axios.interceptors.response.use(response => {
  return response.data;
}, err => {
  if (err && err.response) {
    if (err.response.status === 500) {
      Message.error('服务器出错！请联系管理员！');
      return;
    }
    return Promise.reject(err.response);
  } else {
    Message.error('网络连接错误, 请检查网络');
    return Promise.reject({
      'code': 0,
      message: '网络连接错误, 请检查网络',
      data: {}
    });
  }
});

/**
 *
 * @param method
 * @param uri
 * @param data
 * @param self
 * @param reload_captcha
 * @param config
 */
export function exec(method, uri, data, self, reload_captcha=false, config = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', }
}) {

  if (config['headers']['Content-Type'] === 'application/x-www-form-urlencoded') data = qs.stringify(data);

  // 打开加载
  let loading = Loading.service({
    fullscreen: true,
    text: '拼命加载中',
    background: 'rgba(0, 0, 0, 0.8)',
    spinner: 'el-icon-loading',
  });

  return new Promise((resolve, reject) => {
    axios[method](uri, data, config)
      .then((res) => {
        // 关闭加载
        loading.close();
        resolve(res);
      })
      .catch((res) => {
        // 关闭加载
        loading.close();
        try {
          if (res.status === 403 || res.data.detail === '身份认证信息未提供。') {
            self.$router.push({
              path: '/login',
              query: { next: self.$route.fullPath }
            });

            // 删除缓存信息
            localStorage.removeItem('_USERTOKEN');

            Message.warning('请先登录！');

            return;
          }

          if (res.status === 400 && res.data.data.hasOwnProperty('form_errors')) {
            self.errors = res.data.data.errors;
            let errors = res.data.data.errors;
            let msg = '';
            for (let k in errors) {
              let error = errors[k];
              self.errors[k] = errors[k].join('');
              msg += error.join(', ') + ', ';
            }

            // 请求数据有误，但不是验证码错误的情况下刷新验证码
            if (!res.data.data.hasOwnProperty('captcha_errors') && reload_captcha) {
              self.get_captcha();
            }

            Message.error(msg.substring(0, msg.length - 2));

            return;
          }
        }catch (e) {

        }

        reject(res);
      });
  });
}
