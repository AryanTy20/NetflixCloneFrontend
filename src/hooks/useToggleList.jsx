import { useAxiosPrivate } from "./useAxiosPrivate";

export const useToggleList = () => {
  const axiosPrivate = useAxiosPrivate();
  const toggleList = async (data) => {
    try {
      let { id, title, name, poster_path } = data;
      title = title || name;
      const item = {
        id,
        title,
        posterPath: poster_path,
      };

      const res = await axiosPrivate.post("/addlist", { item });
      if (res.status == 201) return true;
      if (res.status == 204) return false;
    } catch (err) {
      console.log(err);
    }
  };
  return toggleList;
};
