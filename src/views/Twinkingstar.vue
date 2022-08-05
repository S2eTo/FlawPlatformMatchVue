<template>
  <div id="twinkingstar">
    <div class="count_down"><img src="../assets/index/clock.png" alt=""> {{
        match_remaining_time
      }}
    </div>
    <div class="name">
      <img :src="`${this.$request.baseURL}${match.logo}`" alt="" class="logo">
      {{ match.name }}
    </div>
    <div class="top-container">
      <div class="container-item left">
        <img src="../assets/twinkingstar/dynamic.png" alt="">
        <div class="content dynamic">
          <div class="overflow">
            <div class="dynamic-item-" v-if="dynamic.length > 0" v-for="(data, index) in dynamic"
                 :key="index">
              <div class="dynamic-item">{{ data.ctimer }} {{ data.user.first_name?data.user.first_name:data.user.username }}  完成解题 《{{ data.image.name }}》.
              </div>
              <div class="split-line"></div>
            </div>
            <div class="dynamic-item-" v-if="dynamic.length == 0">
              <div class="dynamic-item">暂无动态.</div>
              <div class="split-line"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-item center">
        <img src="../assets/twinkingstar/notice.png" alt="">
        <div class="content notice-content">
          <div class="overflow">
            <div class="notice-item-" v-if="notice.length > 0" v-for="(data, index) in notice"
                 :key="index">
              <div class="notice-item">{{ data.ctimer }} {{ data.content }}</div>
              <div class="split-line"></div>
            </div>
            <div class="notice-item-" v-if="notice.length == 0">
              <div class="notice-item">暂无公告</div>
              <div class="split-line"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-item right">
        <img src="../assets/twinkingstar/match.png" alt="">
        <div class="content match">
          <div class="start-datetime match-item">共 {{ rank_list.length }} 人参赛</div>
          <div class="split-line"></div>
          <div class="start-datetime match-item">比赛开始时间：{{ new Date(match.start_datetime).format('yyyy年MM月d日 hh:mm:ss') }}</div>
          <div class="split-line"></div>
          <div class="end_datetime match-item">比赛结束时间：{{ new Date(match.end_datetime).format('yyyy年MM月d日 hh:mm:ss') }}</div>
          <div class="split-line"></div>
          <div class="websocket_status match-item">WebSocket 状态：
            <span :class="websocket_status==='连接正常'?`success`:`error`">{{ websocket_status }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-container">
      <img src="../assets/twinkingstar/rank.png" alt="">
      <div class="content rank">
        <div class="overflow">
          <table cellspacing="0" cellpadding="0" border="0">
            <thead>
            <tr>
              <th>排名</th>
              <th>姓名</th>
              <th v-for="(data, index) in count_image">{{data.name}} 完成度</th>
              <th>分数</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(rank_item, index) in rank_list">
              <td>{{ rank_item.rank }}</td>
              <td>{{ rank_item.first_name?rank_item.first_name:rank_item.username }}</td>
              <td v-for="(category, index) in count_image">{{ calc_percentage(rank_item, category) }}</td>
              <td>{{ rank_item.point }} pt</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Twinkingstar",
  data() {
    return {
      match: {
        logo: '',
        name: '',
        start_datetime: '',
        end_datetime: '',
      },
      websocket: null,
      match_remaining_time: '',
      dynamic: [],
      notice: [],
      rank_list: [],
      count_image: [],
      websocket_status: '未连接'
    }
  },
  async created() {
    // 获取公告
    this.get_notice();

    // 获取比赛信息
    await this.get_match();

    // 获取排行榜
    this.get_rank_detailed();

    //
    this.get_category_image_count();

    // 获取实时动态（答题记录）
    this.get_dynamic();

    // WebSocket 链接
    this.websocket = new WebSocket(`ws://${location.hostname}:${location.port}/ws/`);

    this.websocket.onmessage = this.websocket_message_callback;
    this.websocket.onopen = this.websocket_open_callback;
    this.websocket.onerror = this.websocket_error_callback;
    this.websocket.onclose = this.websocket_close_callback;
  },
  methods: {
    websocket_message_callback(msg) {
      let data = JSON.parse(msg.data)
      switch (data.type) {
        case "update_dynamic":
          // 更新动态
          this.get_dynamic();

          break;
        case "update_rank":
          // 更新排行榜
          this.get_rank_detailed();

          break;

        case "update_notice":
          // 更新公告
          this.get_notice();

          break;

      }
    },
    websocket_open_callback(msg) {
      // this.$message.success('WebSocket 链接成功.');
      this.websocket_status = "连接正常";
    },
    websocket_error_callback(msg) {
      this.websocket_status = "连接错误";
    },
    websocket_close_callback(msg) {
      this.websocket_status = "未连接";
    },
    async get_match() {
      let res = await this.$request.exec('get', 'match', {}, this);
      this.match = res.data;

      this.calc_match_remaining_time();

      let self = this;
      this.interval = setInterval(function () {
        self.calc_match_remaining_time();
      }, 1000)
    },
    get_rank_detailed() {
      this.$request.exec('get', 'rank_detailed', {}, this).then((res) => {
        this.rank_list = res.data;
      }).catch((res) => {
        this.$message.error(res.data.msg);
      })
    },
    get_category_image_count() {
      this.$request.exec('get', 'count_image', {}, this).then((res) => {
        this.count_image = res.data;
      }).catch((res) => {
        this.$message.error(res.data.msg);
      })
    },
    count(arr, item) {
      let count = 0;
      arr.forEach((e)=> item === e ? count++:0);
      return count;
    },
    calc_percentage(team, category) {

      let count = this.count(team.checked.map(function (e) {
        return e.image.category.id
      }), category.id)

      if (count > 0) {
        return `${(count * 100 / category.count).toFixed()}%`
      }else {
        return `0%`
      }
    },
    get_dynamic() {
      this.$request.exec('get', 'get_checked', {}, this).then((res) => {
        this.dynamic = res.data;
      }).catch((res) => {
        this.$message.error(res.data.msg);
      })
    },
    get_notice() {
      this.$request.exec('get', 'notice', {}, this).then((res) => {
        this.notice = res.data;
      }).catch((res) => {
        this.$message.error(res.data.msg);
      })
    },
    format_time(s) {
      return (s < 10) ? ('0' + s) : s;
    },
    calc_match_remaining_time() {
      let date1 = new Date(this.match.start_datetime);
      let date2 = new Date(this.match.end_datetime);
      let date3 = new Date();

      if (date3 - date2 >= 0) {
        this.match_remaining_time = ` 比赛已结束`
      }else if (date1 - date3 > 0) {

        let horus= this.format_time(date1.getHours());
        let minutes= this.format_time(date1.getMinutes());
        let sec = this.format_time(date1.getSeconds());

        this.match_remaining_time = ` 比赛开始时间：${horus}:${minutes}:${sec}`
      } else {

        let totalSecs = (date2 - date3) / 1000;

        let days = this.format_time(Math.floor(totalSecs / 3600 / 24));
        let hours = this.format_time(Math.floor((totalSecs - days * 24 * 3600) / 3600));
        let mins = this.format_time(Math.floor((totalSecs - days * 24 * 3600 - hours * 3600) / 60));
        let secs = this.format_time(Math.floor((totalSecs - days * 24 * 3600 - hours * 3600 - mins * 60)));

        this.match_remaining_time = ` 比赛倒计时：${hours}:${mins}:${secs}`;
      }
    },
  },
}
</script>

<style scoped>
#twinkingstar {
  background: url("../assets/twinkingstar/background.png") 0 0 / 100% 100%;
  padding: 2vw;
}

.name {
  color: #FFFFFF;
  font-size: 1.8vw;
  margin-left: .5vw;
}

.name * {
  vertical-align: middle;
}

.logo {
  width: 3.25vw;
}

.top-container {
  font-size: 0;
  margin: 1vw 0;
}

.top-container img {
  height: 100%;
}

.container-item {
  display: inline-block;
  vertical-align: top;
  padding: 1vw;
  position: relative;
}

.top-container .container-item {
  height: 17.7vw;
}

.bottom-container{
  position: relative;
}

.bottom-container img {
  padding: 1vw;
  width: 100%;
}


.count_down {
  position: absolute;
  right: 3.5vw;
  top: 2.8vw;
  z-index: 2;
  font-size: 1.2vw;
  vertical-align: middle;
  color: #00f6ff;
}

.count_down * {
  vertical-align: middle;
}

.count_down img {
  width: 1.9vw;
  margin-right: .5vw;
}

.content {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 9;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  outline: none;
}

.dynamic {
  padding: 4.5vw 3vw 3vw 3vw;
}

.dynamic-item,
.notice-item,
.match-item {
  font-size: .92vw;
  padding: .7vw 0;
  color: #FFFFFF;
}

.split-line {
  height: .1vw;
  background: -webkit-linear-gradient(left, #1c145b00 -4%, #2927ac 50%, #3e0c6f00 100%);
}

.notice-content {
  padding: 4.5vw 3vw 3vw 3vw;
}

.match {
  padding: 4vw 2vw 2vw 3.5vw;
  color: #FFFFFF;
}

.match .start-datetime {
  font-size: .92vw;
}

.rank {
  padding: 6vw 3vw 3vw 3vw;
}

table {
  width: 100%;
  text-align: center;
  color: #FFFFFF;
}

td, th {
  border-bottom: 1px solid #1e286c;
  padding: 1vw;
  font-size: .92vw;
}

.overflow {
  overflow-y: scroll;
  height: 100%;
  padding: 0 .5vw;
}

.overflow::-webkit-scrollbar {
  width: .3vw;
  background: none;
}

/*定义滚动条轨道 内阴影+圆角*/
.overflow::-webkit-scrollbar-track {
  border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/
.overflow::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /*background-color: #d71af1;*/
  background: url("../assets/index/scrollbar.png");
}

.websocket_status .success {
  color: #4caf50;
}

.websocket_status .error {
  color: #e91e63;
}
</style>
