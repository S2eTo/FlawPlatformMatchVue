<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>

:root {
  --color-blue-lv10: #5a8cff;
  --color-blue-lv11: #4f7be0;
  --color-white-lv10: #f2f3f8;
  --color-white-lv11: #a9adb7;
  --color-white-lv12: #fff;
  --header-height: 60px;
  --sidler-width: 250px;
  --sidler__user-height: 69px;
  --sidler__list-height: calc(100% - var(--sidler__user-height));
  --container-height: calc(100% - var(--header-height));
  --content-width: calc(100% - var(--sidler-width));
  --header-logo-width: var(--sidler-width);
  --header-other-width: calc(100% - var(--header-logo-width));
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-weight: 400;
  font-family: PingFang-SC-Medium;
}

.container {
  min-height: calc(100vh - 9.439vh);
  width: 100%;
}

html,
body {
  height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
}

body {
  /*background-color: #000241 !important;*/
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

ul {
  list-style: none none;
}

a {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  position: relative;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  font-size: .9vw;
  font-weight: 500;
  color: #409eff;
  -moz-outline-style: none;
}

a:hover {
  color: #66b1ff;
  text-decoration: underline;
}

#app {
  min-height: 100%;
}

img {
  user-select: none;
}

html::-webkit-scrollbar
{
  width: .3vw;
  background-color: #33085c;
}

/*定义滚动条轨道 内阴影+圆角*/
html::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/
html::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  /*background-color: #3e4dc7;*/
  background: url("./assets/index/scrollbar.png");
}

.btn {
  user-select: none;
  font-size: .9vw !important;
  display: inline-block;
  padding: .6vw 1.5vw;
  cursor: pointer;
}

.btn.btn-primary {
  background: linear-gradient(-43deg, #ce33f0, #5460d4);
}

.btn.btn-primary:hover {
  background: linear-gradient(-43deg, #c132e1, #4e59c5);
  text-decoration: none;
  color: #FFFFFF;
}

.btn.btn-danger {
  background: linear-gradient(-43deg, #f03333, #d45d54);
}

.btn.btn-danger:hover {
  background: linear-gradient(-43deg, #e53030, #bf524a);
  text-decoration: none;
  color: #FFFFFF;
}

</style>
