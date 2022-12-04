import axios from "axios";
// const baseURL = "https://netflixclon3.herokuapp.com";
const baseURL="https://netflixcloneapi.up.railway.app";
// const baseURL = "http://localhost:8000";
export const Axios = axios.create({
  baseURL,
  withCredentials: true,
});
export const privateAxios = axios.create({
  baseURL,
  withCredentials: true,
});
