import { Axios } from "../helper/axios";
import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await Axios.get("/auth/refresh");
      setAuth((prev) => {
        return { ...prev, accessToken: response.data.accessToken };
      });
      return response.data.accessToken;
    } catch (err) {
      if (err.response.status == 401) {
        return;
      } else {
        setError(err.response.data.message);
      }
    }
  };
  return refresh;
};
