<template>
  <div id="login">
    <div class="login-form">
      <div class="title">比赛登录</div>
      <div class="form-group username">
        <img src="../assets/login/username.png" alt="" class="label">
        <input type="text" class="username" id="username" placeholder="请输入用户名" v-model="username">
        <div class="line"></div>
      </div>
      <div class="form-group password">
        <img src="../assets/login/password.png" alt="" class="label">
        <input type="password" class="password" id="password" placeholder="请输入密码" v-model="password">
        <div class="line"></div>
      </div>
      <div class="form-group captcha">
        <img src="../assets/login/captcha.png" alt="" class="label">
        <input type="text" class="icaptcha" id="icaptcha" placeholder="请输入验证码" v-model="icaptcha">
        <img :src="captcha.image_base" alt="验证码" @click="get_captcha" class="captcha-img">
        <div class="line"></div>
      </div>
      <div class="form-group form-group_btn">
        <img src="../assets/login/button.png" alt="" class="login-btn" @click="login">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      username: '',
      password: '',
      icaptcha: '',
      captcha: {
        id: 0,
        image_base: ''
      },
    };
  },
  created() {
    this.get_captcha();
  },
  methods: {
    login() {

      // 删除前后空白字符
      let username = this.username.trim();
      let password = this.password.trim();
      let icaptcha = this.icaptcha.trim();

      // 简单判断是否为空, 节省请求资源
      if (username === '' || password === '' || password.length <= 0 || icaptcha === '' && icaptcha.length <= 0) {
        // Message.
        this.$message.error('用户名、密码、验证码不能为空!');
        return false;
      }

      // 发起登录请求
      this.$request.exec('post', 'login',
        {
          username: username,
          password: password,
          image_id: this.captcha.id,
          captcha_code: icaptcha,
        }, this, true)
        .then((res) => {
          if (res.code === 1 && res.msg === '登陆成功') {
            this.$message.success(res.msg);

            // 设置登录状态和用户信息
            this.$store.commit('login', res.data.user);

            // 将 Token 存储到缓存中
            localStorage.setItem('_USERTOKEN', res.data.token);

            let next = this.$route.query.next;
            if (this.$route.query.next) {
              this.$router.push({ path: next });
              return false;
            }
            this.$router.push('/');
          }
        })
        .catch((res) => {
          // 表单填写错误！！
          if (res.status === 417) {
            let d = res.data.data;
            if (d.hasOwnProperty('__all__')) {
              this.$message.error(d.__all__[0]);
            } else if (d.hasOwnProperty('username') || d.hasOwnProperty('password')) {
              this.$message.error('用户名、密码不能为空!');
            }
          }else {
            this.$message.error(res.data.msg);
          }
        });
    },
    get_captcha() {
      this.$request.exec('get', 'get_captcha', null, this)
        .then((res) => {
          this.captcha = res.data;
        })
        .catch((res) => {
          this.$message.error(res.data.msg);
        });
    },
  },
};
</script>

<style scoped>

* {
  user-select: none;
  font-family: PingFang-SC-Regular;
}

#login {
  height: 100vh;
  background-image: url("../assets/login/background.png");
  background-size: cover;
  background-position: center center;
  overflow: hidden;
}

.login-form {
  background: url("../assets/login/form.png") 0 0 / 100% 100%;
  width: 46vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8vw 8vw 5vw 7vw;
}

.title {
  font-size: 1.4vw;
  font-weight: normal;
  font-stretch: normal;
  color: #ffffff;
  text-align: center;
}

.form-group {
  font-size: 0;
  margin-top: .5vw;
  text-align: center;
}

.form-group.captcha {
  text-align: left;
}

.form-group.captcha .captcha-img {
  width: 20%;
  height: 2.5vw;
}

.form-group.captcha input {
  width: calc(100% - 28%);
}

.form-group * {
  vertical-align: middle;
}

.form-group .line {
  background: #7c64db;
  height: .1vw;
  box-shadow: 0 0 0.6vw #7c64db;
}

input {
  background: none;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: .9vw;
  height: 3.5vw;
}

.form-group #username,
.form-group #password {
  width: calc(100% - 2.2vw);
}

.form-group #username,
.form-group #password {
  width: calc(100% - 2.2vw);
}

input::-webkit-input-placeholder {
  color: #cbcbcb;
  font-size: .85vw;
}

input::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #cbcbcb;
  font-size: .85vw;
}

input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #cbcbcb;
  font-size: .85vw;
}

input:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: #cbcbcb;
  font-size: .85vw;
}

input:-internal-autofill-previewed,
input:-internal-autofill-selected {
  -webkit-text-fill-color: #FFFFFF !important;
  transition: background-color 5000s ease-in-out 0s !important;
}

.label {
  width: 2.2vw;
}

.login-btn {
  width: 12vw;
  margin: 1vw 0;
  cursor: pointer;
}
</style>
