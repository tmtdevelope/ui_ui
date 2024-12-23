import { post } from "../plugins/axios";

const quoteService = {
  privatePay(data) {
    return post("quote/private", data);
  },
  facilityPay(data) {
    return post("quote/facility", data);
  },
  insurancePay(data) {
    return post("quote/insurance", data);
  },
  getQuote(data) {
    return post("/getquote", data);
  },
  addQuote(data) {
    return post("quote/add_quote", data);
  },
};

export default quoteService;
