import { get, post, put, del } from "../axios";

const adminUserService = {
  getUsers() {
    return get("admin/user");
  },
  getUserById(id) {
    return get(`admin/user/${id}`);
  },
  createUser(data) {
    return post("admin/user", data);
  },
  updateUser(id, data) {
    return put(`admin/user/${id}`, data);
  },
  deleteUser(id) {
    return del(`admin/user/${id}`);
  },
};

export default adminUserService;
