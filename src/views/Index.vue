<template>
  <div id="index">
    <div class="name">
      <img :src="`${this.$request.baseURL}${match.logo}`" alt="" class="logo">
      {{ match.name }}

      <div class="btn btn-danger" @click="logout">退出登录</div>
    </div>
    <div class="top-container">
      <div class="container-item left">
        <img src="../assets/index/team-info.png" alt="">
        <div class="content team">

          <div class="avatar content-item">
            <img src="../assets/index/avatar.png" alt="">
          </div>
          <div class="info content-item">
            <div class="team-name">{{ userinfo.username }}{{ userinfo.first_name?` - ${userinfo.first_name}`:"" }}</div>
            <div class="team-tools">
              <span class="team-tools-item">排名：{{ team_info.rank }}</span>
              <span class="team-tools-item">已解答：{{ checked.length }}</span>
              <span class="team-tools-item">分数：{{ team_info.point }} pt</span>
            </div>
          </div>
        </div>
      </div>
      <div class="container-item right">
        <img src="../assets/index/dynamic.png" alt="">
        <div class="content dynamic">
          <div class="overflow">
            <div class="dynamic-item-" v-if="dynamic.length > 0" v-for="(data, index) in dynamic"
                 :key="index">
              <div class="dynamic-item">{{ data.ctimer }} {{
                  data.user.first_name?data.user.first_name:data.user.username
                }} 完成解题 《{{ data.image.name }}》.
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
    </div>
    <div class="bottom-container">
      <div class="container-item left">
        <img src="../assets/index/task-background.png" alt="">
        <div class="count_down"><img src="../assets/index/clock.png" alt=""> {{
            match_remaining_time
          }}
        </div>
        <div class="content task">
          <div class="category">
            <div :class="category_active == index? `item active`:`item`"
                 v-for="(data, index) in category" :key="index"
                 @click="change_category(index, data.id)">
              {{ data.name }}
            </div>
          </div>
          <div class="task-list" v-if="task_list.length > 0">
            <div class="item" v-for="(task, index) in task_list" :key="index"
                 @click="open_detailed(index)">
              <div class="task-done-num">
                <img src="../assets/index/task-num.png" alt="" class="background">
                <div class="content">{{ task.done_count }} 名选手已攻克</div>
              </div>
              <div class="info">
                <img  v-if="is_done(task.id)" src="../assets/index/task.png" alt="" class="background">
                <img  v-else src="../assets/index/task-nobody.png" alt="" class="background">
                <div class="content">
                  <div class="task-pt">
                    {{ task.point }} pt
                    <img src="../assets/index/done.png" alt="" v-if="is_done(task.id)">
                  </div>
                  <div class="task-name">题目名称：{{ task.name }}</div>
                  <div class="task-category">题目分类：{{ task.category }}</div>
                  <div class="task-rank">
                    <div class="not_done_team" v-if="task.done_count <= 0">暂无解出</div>
                    <img src="../assets/index/rank1.png" alt="" v-if="task.done_count >= 1">
                    <img src="../assets/index/rank2.png" alt="" v-if="task.done_count >= 2">
                    <img src="../assets/index/rank3.png" alt="" v-if="task.done_count >= 3">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="task-list" v-else>
            <p class="task_null">暂无题目.</p>
          </div>
        </div>
      </div>
      <div class="container-item right">
        <div class="notice">
          <img src="../assets/index/notice.png" alt="">
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
        <div class="rank">
          <img src="../assets/index/rank.png" alt="">
          <div class="content rank-content">
            <div class="overflow">
              <div v-for="(team, index) in rank_list" :key="index" class="rank-for-item">
                <div class="rank-item">{{ team.rank }}. {{ team.first_name?team.first_name:team.username }} <span>{{
                    team.point
                  }} pt</span></div>
                <div class="split-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detailed" v-if="show_detailed">
      <img src="../assets/index/detailed.png" alt="">
      <div class="content">
        <div class="detailed-task_name">{{ detailed_data.name }}</div>
        <img src="../assets/index/close.png" alt="" class="detailed-close" @click="close_detailed">
        <div class="detailed-top3">
          <div class="detailed-top3_item">
            <img src="../assets/index/rank1.png" alt=""> {{ top_team[0] ? top_team[0] : "虚位以待" }}
          </div>
          <div class="detailed-top3_item">
            <img src="../assets/index/rank2.png" alt=""> {{ top_team[1] ? top_team[1] : "虚位以待" }}
          </div>
          <div class="detailed-top3_item">
            <img src="../assets/index/rank3.png" alt=""> {{ top_team[2] ? top_team[2] : "虚位以待" }}
          </div>
        </div>
        <div class="detailed-task_description task-detailed-item">题目描述：
          <el-tooltip class="item" effect="dark" :content="detailed_data.description" placement="top-start">
            <span class="detailed-task_description-item">{{detailed_data.description}}</span>
          </el-tooltip>
        </div>
        <div class="detailed-task_point task-detailed-item">题目分数：{{ detailed_data.point }} pt</div>
        <div class="detailed-task_hints task-detailed-item">
          题目提示：
          <span v-if="detailed_data.hints.length > 0">
            <el-tooltip class="item" effect="dark" :content="hints.content" placement="top-start" v-for="(hints, index) in detailed_data.hints" :key="index">
              <span class="detailed-task_hints-item">Hints {{ index + 1 }}</span>
            </el-tooltip>
          </span>
          <span v-else class="detailed-task_hints-item-nothing">
              暂无
          </span>
        </div>
        <div class="detailed-task_image task-detailed-item" v-if="detailed_data.check_flag == 1">
          题目环境：
          <div class="btn btn-primary" @click="start_container" v-if="!running">启动环境</div>
          <div v-else class="container-info">
            <div class="public_port">{{ running_container.public_port }}</div>
            <div class="timer">
              <span class="label">倒计时:</span>
              <span>{{ remaining_time }}</span>
            </div>
            <el-popconfirm title="确定要删除场景吗？" @confirm="remove_container">
              <div class="delete" slot="reference">删除场景</div>
            </el-popconfirm>
          </div>
        </div>
        <div class="detailed-task_file task-detailed-item" v-if="detailed_data.check_flag == 2">
          附件下载：
          <a class="btn btn-primary" :href="`${this.$request.baseURL}${detailed_data.file}`" download target="_blank">下载附件</a>
        </div>
        <div class="flag-push" v-if="!is_cheked">
          <span>FLAG: </span>
          <input type="text" id="flag" name="flag" placeholder="flag...." class="flag-input"
                 v-model="flag">
          <div class="btn btn-primary" @click="check_flag()">提交</div>
        </div>
        <div class="flag-push flag-push_done" v-else>
          <img src="../assets/index/done-button.png" alt="" class="done-button">
        </div>
      </div>
    </div>

    <div class="mask" v-if="show_detailed" @click="close_detailed"></div>

    <el-dialog title="启动失败" :visible.sync="dialogVisible">
      <span>已启动 {{ running_container.image.name }} 的环境，是否将其关闭并启动当前环境？</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="remove_container(true)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      category_active: 0,
      rank_list: [],
      ws: null,
      userinfo: {
        id: 0,
        team: {
          id: 0,
          name: ""
        },
        username: "",
        first_name: '',
      },
      team_info: {
        name: "",
        rank: "",
        point: ""
      },
      task_list: [],
      task_count: 0,
      category: [],
      dynamic: [],
      show_detailed: false,
      detailed_data: {},
      detailed_index: 0,
      running_container: {
        image: {
          name: ""
        }
      },
      dialogVisible: false,
      running: false,
      remaining_time: "00:00:00",
      flag: '',
      checked: [],
      is_cheked: false,
      notice: [],
      match: {
        logo: '',
        name: '',
        start_datetime: '',
        end_datetime: '',
      },
      match_remaining_time: '00:00:00',
    }
  },
  async created() {
    // 获取比赛信息
    await this.get_match();

    // 获取排行榜
    await this.get_rank();

    // 获取动态
    this.get_checked();

    // 获取分类
    this.get_category();

    // 获取实时动态（答题记录）
    this.get_dynamic();

    //
    this.get_running_container();

    // 获取公告
    this.get_notice();

    this.websocket = new WebSocket(`ws://${location.hostname}:${location.port}/ws/`);

    this.websocket.onmessage = this.websocket_message_callback;
    this.websocket.onopen = this.websocket_open_callback;
    this.websocket.onerror = this.websocket_error_callback;
    this.websocket.onclose = this.websocket_close_callback;

  },
  methods: {
    async websocket_message_callback(msg) {
      let data = JSON.parse(msg.data)
      switch (data.type) {
        case "update_dynamic":
          // 更新动态
          this.get_dynamic();

          break;
        case "update_rank":
          // 更新排行榜
          await this.get_rank();

          break;
        case "update_task":
          // 更新题目信息
          if (this.category[this.category_active].id === data.data) {
            this.get_images(data.data);
          }

          break;
        case "update_task_hints":
          // 更新题目信息
          if (this.category[this.category_active].id === data.data.category) {
            this.get_images(data.data.category, true, data);
          }

          break;
        case "update_notice":
          // 更新公告
          this.get_notice();

          break;

      }
    },
    websocket_open_callback(msg) {
      // this.$message.success('WebSocket 链接成功.');
    },
    websocket_error_callback(msg) {
    },
    websocket_close_callback(msg) {
    },
    async get_match() {
      let res = await this.$request.exec('get', 'match', {}, this);
      this.match = res.data;

      this.calc_match_remaining_time();

      let self = this;
      this.interval = setInterval(function () {
        self.calc_match_remaining_time();
      }, 1000);
    },
    async get_rank() {
      let res = await this.$request.exec('get', 'rank', {}, this);
      this.rank_list = res.data;

      this.init_team_info();
      this.get_checked();
    },
    init_team_info() {
      this.userinfo = this.$store.getters.userinfo;
      let team_id = this.userinfo.id;
      let team_info = this.rank_list[this.rank_list.map(function (e) {
        return e.id
      }).indexOf(team_id)]

      if (team_info) {
        this.team_info = this.rank_list[this.rank_list.map(function (e) {
          return e.id
        }).indexOf(team_id)]
      }else {
        this.$router.push({
          name: 'Twinkingstar'
        })
      }
    },
    get_notice() {
      this.$request.exec('get', 'notice', {}, this).then((res) => {
        this.notice = res.data;
      }).catch((res) => {
        this.$message.error(res.data.msg);
      })
    },
    get_images(category = 0, update_detailed = false, data = {}) {
      this.$request.exec('get', `get_image?category=${category}`, {}, this).then((res) => {
        this.task_list = res.data;

        if (update_detailed) {
          // 更新已打开的提示
          if(this.detailed_data.id === data.data.image) {
            this.open_detailed(this.task_list.map(function (e) {
              return e.id
            }).indexOf(this.detailed_data.id))
          }
        }
      }).catch((res) => {
        this.$message.error(res.data.msg);
      })
    },
    get_category() {
      this.$request.exec('get', 'category', {}, this).then((res) => {
        this.category = res.data;

        this.get_images(res.data[0].id);
      }).catch((res) => {
        this.$message.error(res.data.msg);
      })
    },
    change_category(i, id) {
      this.category_active = i;

      this.get_images(id);
    },
    get_checked() {
      this.$request.exec('get', 'get_all_checked', {}, this).then((res) => {
        this.checked = res.data.checked;
      }).catch((res) => {
        this.$message.error(res.data.msg);
      })
    },
    get_dynamic() {
      this.$request.exec('get', 'get_checked', {}, this).then((res) => {
        this.dynamic = res.data;
      }).catch((res) => {
        this.$message.error(res.data.msg);
      })
    },
    close_detailed() {
      this.show_detailed = false;
      this.detailed_data = {};
    },
    open_detailed(i) {
      this.detailed_index = i;
      this.detailed_data = this.task_list[i];
      console.log(this.detailed_data)
      this.show_detailed = true;
      this.check_self_is_running();
      this.flag = null;
      this.top_team = this.detailed_data.top_user.split(',');

      for (let i in this.checked) {
        let image = this.checked[i].image;
        if (image.id === this.detailed_data.id) {
          this.is_cheked = true;
          break;
        } else {
          this.is_cheked = false;
        }
      }
    },
    is_done(id) {
      for (let i in this.checked) {
        let image = this.checked[i].image;
        if (image.id === id) return true
      }
      return false
    },
    check_flag(index) {
      this.$request.exec('post', 'check_flag', {
        'image_id': this.detailed_data.id,
        'flag': this.flag
      }, this)
        .then((res) => {
          if (res.code === 1) {
            this.is_cheked = true;

            this.task_list[this.detailed_index].done_count += 1;

            this.$message.success(res.msg);

            // 刷新显示
            this.checked.push({
              "image": {
                "id": this.detailed_data.id,
              },
            })
          }
        })
        .catch((res) => {
          this.$message.error(res.data.msg);
        });
    },
    start_container() {
      this.$request.exec('post', `run_container`, {'id': this.detailed_data.id}, this)
        .then((res) => {
          console.log(12312313);
          if (res.code === 2) {
            // this.$message.warning(res.msg);

            console.log(123123);
            console.log(res.data.container)
            console.log(this.userinfo)
            if (res.data.container.user.id === this.userinfo.id) {
              this.dialogVisible = true;

              return;
            }
          }

          this.$message.success(res.msg);

          this.running_container = res.data.container;
          this.timing = res.data.remaining_time;

          this.check_self_is_running();
        })
        .catch((res) => {
          console.log(res);
          // this.$message.error(res.data.msg);
        });
    },
    check_self_is_running() {
      if (this.running_container.image.id === this.detailed_data.id) {
        this.running = true;
        this.calc_remaining_time(this.running_container.create_time);
        let self = this;
        this.interval = setInterval(function () {
          self.calc_remaining_time(self.running_container.create_time);
        }, 1000);
      } else {
        this.running = false;
      }
    },
    get_running_container() {
      this.$request.exec('get', `get_running_container`, null, this)
        .then((res) => {
          if (res.data.container) {
            this.check_self_is_running();
            this.running_container = res.data.container;
            this.timing = res.data.remaining_time;
          }
        });
    },
    calc_remaining_time(date1) {
      date1 = new Date(new Date(date1).getTime() + this.timing * 60 * 60 * 1000);

      let date2 = new Date();    //结束时间
      let date3 = date1.getTime() - date2.getTime();

      //计算出小时数
      let leave1 = date3 % (24 * 3600 * 1000);
      let hours = this.format_time(Math.floor(leave1 / (3600 * 1000)));

      //计算相差分钟数
      let leave2 = leave1 % (3600 * 1000);
      let minutes = this.format_time(Math.floor(leave2 / (60 * 1000)));

      //计算相差秒数
      let leave3 = leave2 % (60 * 1000);
      let seconds = this.format_time(Math.round(leave3 / 1000));

      if (parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
        this.running = false;
        clearInterval(this.interval);
      }

      this.remaining_time = `${hours}:${minutes}:${seconds}`;
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
    format_time(s) {
      return (s < 10) ? ('0' + s) : s;
    },
    remove_container(restart = false) {
      this.$request.exec('post', 'remove_container', null, this)
        .then((res) => {
          this.running_container = {
            id: 0,
            container_id: '',
            image: {
              name: ''
            },
            name: '',
            public_port: '',
            username: '',
            create_time: '',
          };
          this.running = false;

          if (restart === true) {
            this.start_container();
            this.dialogVisible = false;
            return;
          }

          clearInterval(this.interval);

          this.$message.success(res.msg);
        })
        .catch((res) => {
          if (res.data.code === 2) {
            this.running_container = {
              id: 0,
              container_id: '',
              image: {
                name: ''
              },
              name: '',
              public_port: '',
              username: '',
              create_time: '',
            };
            this.running = false;
            clearInterval(this.interval);

            this.$message.success(res.data.msg);
          }
        });
    },
    logout() {
      this.$request.exec('post', 'logout', {}, this).then((res) => {

      }).catch((res) => {

      });

      location.href = '/'
    }
  }
}
</script>

<style scoped>
* {
  font-size: 0;
  color: #FFFFFF;
  font-family: "等线";
}

.logo {
  width: 3.25vw;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 53%);
  z-index: 98;
}

.detailed {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}

.detailed img {
  width: 52vw;
}

.detailed .content {
  position: absolute;
  z-index: 2;
  height: 100%;
  width: 100%;
}

.detailed-task_name {
  font-size: 1.2vw;
  text-align: center;
  line-height: 4.3vw;
  color: #fce2ff;
}

.detailed .detailed-close {
  width: 1.6vw;
  cursor: pointer;
  position: absolute;
  top: 3vw;
  right: 4vw;
  transition: all .2s ease;
}

.detailed .detailed-close:hover {
  transform: rotate(180deg);
}

.detailed-top3 {
  text-align: center;
  display: flex;
  padding: 0 3vw;
  margin-top: 2vw;
}

.detailed-top3 .detailed-top3_item {
  display: inline-block;
  font-size: 1vw;
  flex: 1;
  text-align: center;
}

.detailed-top3 .detailed-top3_item * {
  vertical-align: top;
}

.detailed-top3 .detailed-top3_item img {
  width: 1.1vw;
}

.detailed .detailed-task_description {
  margin-top: 3vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.task-detailed-item {
  font-size: .95vw;
  padding: 0 9vw;
  margin-top: 1.5vw;
}

.task-detailed-item .detailed-task_description-item {
  font-size: .95vw;
}

.task-detailed-item * {
  vertical-align: top;
}

.task-detailed-item .detailed-task_hints-item {
  font-size: .5vw;
  padding: 0.5vw 0.5vw;
  background: #06010e4f;
  border: 0.1vw solid #6489dcbf;
  border-radius: 0.2vw;
  cursor: pointer;
  margin-right: 0.5vw;
}

.task-detailed-item .detailed-task_hints-item-nothing {
  font-size: .95vw;
}

.flag-push {
  position: absolute;
  bottom: 4vw;
  padding: 0 9vw;
}

.flag-push * {
  vertical-align: middle;
}

.flag-push span {
  font-size: 1vw;
}

.flag-push #flag {
  font-size: 1vw;
  padding: 0.5vw 0.2vw;
  background: #00000033;
  margin: 0 1.5vw;
  border: 1px solid #2e75d4;
  width: 22vw;
}

.rank,
.notice,
.container-item {
  position: relative;
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

.not_done_team {
  font-size: .5vw;
  margin-top: 1.5vw;
  color: #a8a8a8;
}

#index {
  background: url("../assets/index/background.png") 0 0 / 100% 100%;
  padding: 2vw;
}

.name {
  color: #FFFFFF;
  font-size: 1.8vw;
  margin-left: .5vw;
  margin-right: 2vw;
  position: relative;
}

.name * {
  vertical-align: middle;
}

.name .btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -60%);
  font-size: .7vw !important;
}

.top-container {
  font-size: 0;
}

.container-item {
  display: inline-block;
  vertical-align: top;
  padding: 1vw;
}

.top-container img {
  height: 100%;
}

.top-container .container-item {
  height: 19vw;
}

.bottom-container {
  margin-top: 2vw;
}

.bottom-container img {
  width: 100%;
}

.bottom-container .left {
  width: 61.81vw;
}

.bottom-container .right {
  font-size: 0;
  width: 32.9vw;
  margin-top: .7vw;
}

.rank {
  margin-top: 4.4vw;
}

.content .content-item {
  display: inline-block;
  vertical-align: middle;
}

.content.team {
  padding: 5vw;
}

.content.team .avatar img {
  width: 10vw;
}

.content.team .info {
  margin-left: 1vw;
}

.content.team .team-name {
  font-size: 1.8vw;
  margin-bottom: 2vw;
}

.content.team .team-tools .team-tools-item {
  font-size: 1vw;
  margin-right: 2vw;
  min-width: 6vw;
  display: inline-block;
}

.dynamic {
  padding: 4.5vw 2.5vw;
}

.notice-content {
  padding: 4vw 2vw 2vw 2vw;
}

.rank-content {
  padding: 4vw 2vw 2vw 2vw;
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

.dynamic-item,
.notice-item,
.rank-item {
  font-size: .92vw;
  padding: .7vw 0;
}

.content.task {
  padding: 6vw 4vw;
}

.split-line {
  height: .1vw;
  background: -webkit-linear-gradient(left, #1c145b00 -4%, #2927ac 50%, #3e0c6f00 100%);
}

.rank .rank-item {
  padding: 1vw 0;
}

.rank .rank-item span {
  font-size: .92vw;
  float: right;
}

.rank .rank-for-item:nth-child(1) *,
.rank .rank-for-item:nth-child(2) *,
.rank .rank-for-item:nth-child(3) * {
  color: #d6be5cfc;
}

.rank .rank-for-item * {
  font-weight: 600;
}

.category .item {
  display: inline-block;
  font-size: 1.2vw;
  background: url("../assets/index/category.png") 0 0 / 100% 100%;
  padding: 1vw 3vw;
  font-style: italic;
  cursor: pointer;
  user-select: none;
  text-shadow: 0 0 1vw #0012ff;
  -webkit-text-fill-color: white;
  -webkit-text-stroke: .04vw #0012ff;
  letter-spacing: .3vw;
}

.category {
  width: 100%;
  white-space: nowrap;
  overflow-x: scroll;
  padding: 1vw 0;
}

.category::-webkit-scrollbar {
  height: .3vw;
  background: none;
}

/*定义滚动条轨道 内阴影+圆角*/
.category::-webkit-scrollbar-track {
  border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/
.category::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /*background-color: #d71af1;*/
  background: url("../assets/index/scrollbar-x.png");
}

.category .item.active,
.category .item:hover {
  background: url("../assets/index/category-active.png") 0 0 / 100% 100%;
  zoom: 1.1;
  text-shadow: 0 0 1vw #e617e2;
  -webkit-text-fill-color: white;
  -webkit-text-stroke: .04vw #e617e2;
}

.task-list {
  overflow-y: scroll;
  height: calc(100% - 6vw);
  margin-top: 1vw;
}

.task-list::-webkit-scrollbar {
  width: .3vw;
  background: none;
}

/*定义滚动条轨道 内阴影+圆角*/
.task-list::-webkit-scrollbar-track {
  border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/
.task-list::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /*background-color: #d71af1;*/
  background: url("../assets/index/scrollbar-x.png");
}

.task-list .item {
  display: inline-block;
  width: 17vw;
  text-align: center;
  cursor: pointer;
  margin-right: 1.2vw;
  margin-bottom: 3vw;
}

.task-list .item:nth-child(3n) {
  margin: 0;
}

.task-list .item .background {
  width: 100%;
}

.task-list .task-done-num {
  position: relative;
  margin-bottom: .5vw;
  margin-left: .5vw;
  user-select: none;
}

.task-list .task-done-num .content {
  font-size: .9vw;
  padding: .95vw 4.5vw .75vw 2.5vw;
  text-align: center;
}

.task-list .info {
  position: relative;
}

.task-rank img {
  width: 1vw;
  margin: 0 .5vw;
}

.task-list .item .info .content {
  padding: 2vw 2.5vw;
}

.task-pt * {
  vertical-align: middle;
}

.task-pt {
  font-size: 1.2vw;
  font-family: DIN-Bold;
  font-weight: 600;
  margin-bottom: 1vw;
  vertical-align: middle;
}

.task-pt img {
  width: 3vw;
  vertical-align: middle;
}

.task_null {
  font-size: 1vw;
  padding-top: 2vw;
  color: #d3d3d3;
}

.task-name,
.task-category {
  text-align: left;
  font-size: .9vw;
  font-family: PingFang-SC-Regular;
  margin-bottom: 1vw;
}

.container-info {
  display: inline-block;
}

.container-info * {
  font-size: 1vw;
}

.container-info .timer {
  margin: 1vw 0;
}

.delete {
  border: solid 1px #f45959ba;
  color: #ffffff;
  text-align: center;
  padding: 0.3vw 1.2vw;
  font-size: .8vw;
  display: inline-block;
  background: #f45959ba;
  cursor: pointer;
  user-select: none;
}

.delete:hover {
  background: #f45959e6;
}

.detailed .flag-push.flag-push_done {
  width: 100%;
  text-align: center;
}

.detailed .flag-push .done-button {
  width: 13vw;
  cursor: pointer;
}

.count_down {
  position: absolute;
  right: 4.5vw;
  top: 4vw;
  z-index: 2;
  font-size: 1vw;
  vertical-align: middle;
  color: #00f6ff;
}

.count_down * {
  vertical-align: middle;
}

.count_down img {
  width: 1.1vw;
  margin-right: .5vw;
}

</style>
