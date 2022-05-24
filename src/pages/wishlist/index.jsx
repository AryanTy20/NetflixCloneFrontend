import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar, LazyImage, CheckInternet, Loader } from "../../components";
import { useAxiosPrivate, useGoToWatch } from "../../hooks";
import "./style.scss";

const WatchList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState(false);
  const goToWatch = useGoToWatch();
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
        if (!err.response) {
          setError("No Internet Connection");
        } else {
          throw err.response?.data.message;
        }
      }
    };
    get();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <CheckInternet />
      <Navbar />
      {loading ? (
        <Loader />
      ) : data.length == 0 ? (
        <div className="noList">
          <h2>You have no item in your WatchList </h2>
        </div>
      ) : (
        <div className="whislistBox">
          {data?.map((item, i) => (
            <motion.div
              className="card"
              key={i}
              onClick={() => goToWatch(item)}
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
              <LazyImage src={baseUrl + `${item.posterPath}`} />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default WatchList;
