import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { Navbar, LazyImage, CheckInternet, Loader } from "../../components";
import {
  useAxiosPrivate,
  useGoToWatch,
  useLocalStorageList,
  useToggleList,
} from "../../hooks";
import "./style.scss";

const WatchList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false);
  const goToWatch = useGoToWatch();
  const [setList, removeList, existList] = useLocalStorageList();
  const toggleList = useToggleList();
  const baseUrl = "https://image.tmdb.org/t/p/w500/";

  useEffect(() => {
    const controller = new AbortController();
    const get = async () => {
      try {
        const res = await axiosPrivate("/mylist", {
          signal: controller.signal,
        });
        setData([...res?.data?.list]);
        setLoading(false);
      } catch (err) {
        if (err.response?.status == 401) return;
        throw err.response?.data.message;
      }
    };
    get();
    return () => {
      controller.abort();
    };
  }, []);

  const delWishList = async (Data) => {
    try {
      await toggleList(Data);
      setData(data.filter((el) => el.id != Data.id));
      removeList(Data.id);
    } catch (err) {
      setError(err.response?.data.message);
    }
  };

  return (
    <>
      <CheckInternet />
      <Navbar />
      {data.length > 0 && (
        <div className="whistlist-control">
          <button onClick={() => setEdit(!edit)}>Edit</button>
        </div>
      )}
      {loading ? (
        <Loader />
      ) : data.length == 0 ? (
        <div className="noList">
          <h2>You have no item in your WishList </h2>
        </div>
      ) : (
        <div className="whislistBox">
          {data?.map((item, i) => (
            <motion.div
              className="card"
              key={i}
              onClick={() => !edit && goToWatch(item)}
              initial={{
                y: "50px",
              }}
              animate={{
                y: 0,
              }}
              whileHover={{
                scale: 1.05,
              }}
            >
              {edit && (
                <div className="delIcon" onClick={() => delWishList(item)}>
                  <DeleteIcon className="icon" />
                </div>
              )}
              <LazyImage src={baseUrl + `${item.posterPath}`} />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default WatchList;
