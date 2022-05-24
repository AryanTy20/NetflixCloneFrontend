import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAxiosPrivate, useOnClickOutside, useGoToWatch } from "../../hooks";
import { Loader, MoreInfoPopUp } from "../../components";
import useSWR from "swr";
import "./style.scss";

const Slider = () => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState("");
  const modalRef = useRef(null);
  useOnClickOutside([modalRef], () => setShowPop(false));
  const goToWatch = useGoToWatch();
  const posterBase = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const get = async () => {
      setData();
      try {
        const { data } = await axiosPrivate.get("/random", {
          signal: controller.signal,
        });
        setData(data);
        setLoading(false);
      } catch (err) {
        if (err.response.status == 401) return;
        setError(err.response?.data.message);
      }
    };
    get();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading-slider">
          <Loader />
        </div>
      ) : (
        <div
          className="slider"
          style={{ filter: showPop ? "blur(3px)" : "initial" }}
        >
          <motion.div
            className="sliderInfo"
            initial={{
              opacity: 0,
              y: "50px",
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: ".5s",
            }}
          >
            <div className="infoContainer">
              <div className="tags">
                {data &&
                  data.genres
                    .map((el) => el.name)
                    .map((el, i) => (
                      <span key={i}>
                        <b>|</b>
                        {el}
                      </span>
                    ))}
              </div>
              <div className="title">
                {data && data.name}
                {data && data.title}
              </div>
              <div className="metaInfo">
                <span>Rating : {data && data.vote_average}</span>
                <span>Air Date : {data.last_air_date}</span>
                <span>Seasons : {data && data.number_of_seasons}</span>
                <span>
                  {data &&
                    data.episode_run_time.map((el, _, arr) => {
                      if (arr.length > 0) {
                      } else {
                        return "Duration : " + el + " min";
                      }
                    })}
                </span>
              </div>
              <div className="desc">{data && data.overview}</div>
              <div className="buttons">
                <button className="playbtn" onClick={() => goToWatch(data)}>
                  Play
                </button>
                <button onClick={() => setShowPop(!showPop)}>More Info</button>
              </div>
            </div>
          </motion.div>
          <div className="poster">
            {data && (
              <img src={`${posterBase}${data.backdrop_path}`} loading="lazy" />
            )}
          </div>
        </div>
      )}

      {showPop && (
        <div className="showInfo">
          <motion.div
            initial={{
              opacity: 0,
              y: "100%",
              x: "-50%",
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              type: "spring",
              duration: 0.3,
            }}
            className="modal"
            ref={modalRef}
          >
            <button className="close" onClick={() => setShowPop(false)}>
              X
            </button>
            <MoreInfoPopUp Data={data} setShowPop={setShowPop} />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Slider;
