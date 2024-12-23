import { post } from "../plugins/axios";

const authService = {
  login(data) {
    return post("/login", data);
  },
  logout(data) {
    return post("/logout", data);
  },

  resetPassword(data) {
    return post("/password/reset", data);
  },
  passwordForget(data) {
    return post("/password/forget", data);
  },
};

export default authService;
