import axios from "axios";
const baseURL = "https://netflixclon3.herokuapp.com";
export const Axios = axios.create({
  baseURL,
  withCredentials: true,
});
export const privateAxios = axios.create({
  baseURL,
  withCredentials: true,
});
