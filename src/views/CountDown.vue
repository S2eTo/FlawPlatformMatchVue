<template>
  <div id="countdown">
    <img src="../assets/countdown/right.png" class="right" alt="">
    <img src="../assets/countdown/left.png" class="left" alt="">
    <div class="name">
      <img :src="`${this.$request.baseURL}${match.logo}`" alt="" class="logo">
      {{ match.name }}
    </div>
    <div class="c">
      <img src="../assets/countdown/content.png" alt="">
      <div class="content">{{match_remaining_time}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CountDown",
  data () {
    return {
      match: {
        logo: '',
        name: '',
        start_datetime: '',
        end_datetime: '',
      },
      match_remaining_time: '',
    }
  },
  async created() {
    // 获取比赛信息
    await this.get_match();
  },
  methods: {
    async get_match() {
      let res = await this.$request.exec('get', 'match', {}, this);
      this.match = res.data;

      this.calc_match_remaining_time();

      let self = this;
      this.interval = setInterval(function () {
        self.calc_match_remaining_time();
      }, 1000);
    },
    format_time(s) {
      return (s < 10) ? ('0' + s) : s;
    },
    calc_match_remaining_time() {
      let date1 = new Date(this.match.start_datetime);
      let date2 = new Date(this.match.end_datetime);
      let date3 = new Date();

      if (date3 - date2 >= 0) {
        this.match_remaining_time = ` 00 : 00 : 00`
      }else if (date1 - date3 > 0) {

        let horus= this.format_time(date1.getHours());
        let minutes= this.format_time(date1.getMinutes());
        let sec = this.format_time(date1.getSeconds());

        this.match_remaining_time = ` 00 : 00 : 00`
      } else {

        let totalSecs = (date2 - date3) / 1000;

        let days = this.format_time(Math.floor(totalSecs / 3600 / 24));
        let hours = this.format_time(Math.floor((totalSecs - days * 24 * 3600) / 3600));
        let mins = this.format_time(Math.floor((totalSecs - days * 24 * 3600 - hours * 3600) / 60));
        let secs = this.format_time(Math.floor((totalSecs - days * 24 * 3600 - hours * 3600 - mins * 60)));

        this.match_remaining_time = ` ${hours} : ${mins} : ${secs}`;
      }
    },
  }
}
</script>

<style scoped>
#countdown {
  height: 100vh;
  background-image: url("../assets/countdown/background.png");
  background-size: cover;
  background-position: center center;
  overflow: hidden;
}

.name {
  color: #FFFFFF;
  font-size: 1.8vw;
  left: 2.5vw;
  position: absolute;
  top: 1.2vw;
}

.name * {
  vertical-align: middle;
}

.logo {
  width: 3.25vw;
}

.right,
.left {
  position: absolute;
  width: 32vw;
}

.right {
  top: 1.2vw;
  right: 2.5vw;
}

.left {
  bottom: 1.2vw;
  left: 2.5vw;
}

.c {
  font-size: 4.5vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #FFFFFF;
  letter-spacing: .5vw;
  text-shadow: 0 0 38px #00d4ff;
}

.c img {
  width: 45vw;
}

.c .content {
  position: absolute;
  top: 47%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'PingFang-SC-Heavy';
  white-space: nowrap;
}
</style>
