import axios from "axios";

const BASE_URL = "https://backend-4a19.onrender.com";

export const createOrder = (amount) =>
  axios.post(`${BASE_URL}/create-order`, { amount }).then(res => res.data);

export const verifyPayment = (data) =>
  axios.post(`${BASE_URL}/verify-payment`, data).then(res => res.data);

export const saveBooking = (data) =>
  axios.post(`${BASE_URL}/save-booking`, data).then(res => res.data);