export default {
  login(state, v) {
    state.userInfo = v;
    state.is_login = true;
  },
};
