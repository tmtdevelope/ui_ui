import { get, put, patch } from "../plugins/axios";

const adminQuoteService = {
  getPrivateQuote(requestType) {
    return get("/admin/quote/private?requestType=" + requestType);
    // return get('/admin/quote/private')
  },
  getFacilityQuote() {
    return get("/admin/quote/facility");
  },
  getInsuranceQuote() {
    return get("/admin/quote/insurance");
  },
  getQuotes() {
    return get("/admin/quote/fetch_guotes");
  },
  /*   markAsRead1(requestNumber) {
    return put("/admin/quote/${id}/mark-as-read`");
  }, */

  async markAsRead3(id) {
    return axios.put(`/api/v1/admin/quote/${id}`);
  },
  markAsRead(id, isRead) {
    patch(`/admin/quote/${id}`, {
      is_read: isRead,
    });
  },
};

export default adminQuoteService;
