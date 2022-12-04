import axios from "axios";
// const baseURL = "https://netflixclon3.herokuapp.com";
const baseURL="https://netflixclon3.cleverapps.io";
// const baseURL = "http://localhost:8000";
export const Axios = axios.create({
  baseURL,
  withCredentials: true,
});
export const privateAxios = axios.create({
  baseURL,
  withCredentials: true,
});
