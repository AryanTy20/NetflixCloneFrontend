import axios from "axios";
// const baseURL = "https://netflixclon3.herokuapp.com";
// const baseURL="https://netflixcloneapi.up.railway.app";
const baseURL="https://netflix-api-zh2w.onrender.com";
// const baseURL = "http://localhost:8000";
export const Axios = axios.create({
  baseURL,
  withCredentials: true,
});
export const privateAxios = axios.create({
  baseURL,
  withCredentials: true,
});
