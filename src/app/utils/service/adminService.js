import { get, post, put, del } from '../plugins/axios'

const adminService = {
  getAllAdmins() {
    return get('/admin')
  },
  getAdminById(id) {
    return get(`/admin/${id}`)
  },
  createAdmin(data) {
    return post('/admin', data)
  },
  updateAdmin(id, data) {
    return put(`/admin/${id}`, data)
  },
  deleteAdmin(id) {
    return del(`/admin/${id}`)
  },
}

export default adminService
