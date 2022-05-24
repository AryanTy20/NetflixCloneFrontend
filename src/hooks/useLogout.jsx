import { useAxiosPrivate } from "./useAxiosPrivate";
import { useAuth } from "./useAuth";
export const useLogout = () => {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const Logout = async () => {
    try {
      await axiosPrivate.get("/auth/logout");
      setAuth({});
      localStorage.removeItem("wishlist");
    } catch (err) {
      if (!err?.response) {
        setError("No Internet Connection");
      } else if (err.response.status == 401) {
        return;
      } else {
        setError(err.response.data.message);
      }
    }
  };
  return Logout;
};
