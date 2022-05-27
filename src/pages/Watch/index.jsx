import { useEffect, useState, useRef } from "react";
import {
  BsCheckCircle as CheckIcon,
  BsPlusCircle as AddIcon,
} from "react-icons/bs";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  Navbar,
  Loader,
  LazyImage,
  CheckInternet,
  Rating,
} from "../../components";
import {
  useAxiosPrivate,
  useLocalStorageList,
  useGoToWatch,
  useToggleList,
  useOnClickOutside,
} from "../../hooks";
import "./style.scss";

const Watch = () => {
  const [isLoading, setIsLoading] = useState(true);
  let { id, title } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [setList, removeList, existList] = useLocalStorageList();
  const [addToggle, setAddToggle] = useState();
  const goToWatch = useGoToWatch();
  const toggleList = useToggleList();
  const [error, setError] = useState();
  const [data, setData] = useState("");
  const [video, setVideo] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  useOnClickOutside(videoRef, () => setShowVideo(false));
  const posterBase = "https://image.tmdb.org/t/p/original/";
  const baseUrl = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    const get = async () => {
      try {
        title = title.replace(/[^a-zA-Z0-9]/g, "");
        const res = await axiosPrivate.get(`/watch/${id}/${title}`);
        setVideo(res.data.video);
        setRecommend(res.data?.recommend.results);
        setData(res.data.data);
        setIsLoading(false);
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
  }, [id]);

  useEffect(() => {
    setAddToggle(existList(id));
  }, [id]);

  const listToggle = async () => {
    const res = await toggleList(data);
    if (res == true) {
      setAddToggle(true);
      setList(id);
    } else {
      setAddToggle(false);
      removeList(id);
    }
  };

  const play = () => {
    const trailer = video
      .map((el) => /Trailer/.test(el.name) && el)
      .filter((el) => el);
    const index = Math.floor(Math.random() * trailer.length);
    setVideoId(trailer[index].key);
    setShowVideo(true);
  };

  return (
    <>
      <CheckInternet />
      <Navbar />
      {isLoading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <div
          className="watchBox"
          style={{
            filter: showVideo ? "blur(2px)" : "initial",
            pointerEvents: showVideo ? "none" : "initial",
          }}
        >
          <div className="backdrop">
            <img
              src={`${posterBase}${data.backdrop_path}`}
              alt={`${data.title || data.name}`}
              loading="lazy"
            />
          </div>
          <div className="infoitems">
            <div className="infobox">
              <div className="controls">
                <div className="poster">
                  <img src={`${baseUrl}${data.poster_path}`} alt="poster" />
                </div>
                <div className="controlbtn">
                  <button className="playbtn" onClick={play}>
                    Play
                  </button>
                  {addToggle ? (
                    <CheckIcon className="checkIcon" onClick={listToggle} />
                  ) : (
                    <AddIcon className="addIcon" onClick={listToggle} />
                  )}
                </div>
              </div>
              <div className="metaInfo">
                <h1 className="title">
                  {data.title}
                  {data.name}
                </h1>
                <div className="rating">
                  <span>
                    <Rating rating={data.vote_average} />
                  </span>

                  {data?.original_language ? (
                    <span className="languages">
                      <span>Languages : {data?.original_language}</span>
                    </span>
                  ) : (
                    <span className="languages">
                      <span>
                        Languages :
                        {data.languages.map((el, i) => {
                          if (i == 0) {
                            return <span key={i}>{el}</span>;
                          } else {
                            return <span key={i}> , {el}</span>;
                          }
                        })}
                      </span>
                    </span>
                  )}
                </div>
                {data.tagline && (
                  <div className="tagline">
                    <b>Tagline : {data.tagline}</b>
                  </div>
                )}
                <div className="genre">
                  <span>{data.genres.length == 1 ? "Genre" : "Genres"} : </span>
                  <span className="genreChild">
                    {data.genres.map((el, i) => {
                      if (i == 0) {
                        return <span key={i}>{el.name}</span>;
                      } else {
                        return <span key={i}>, {el.name}</span>;
                      }
                    })}
                  </span>
                </div>
                {data.release_date && (
                  <div className="release" style={{ marginBottom: "0.5em" }}>
                    Released On : {data.release_date}
                  </div>
                )}
                {data.runtime && (
                  <div className="runtime" style={{ marginTop: "0.5em" }}>
                    Runtime : {data.runtime} min
                  </div>
                )}
                {data.created_by && (
                  <div className="createdby">
                    Created By :
                    {data.created_by.map((el, i) => {
                      if (i == 0) {
                        return <span key={i}> {el.name} </span>;
                      } else {
                        return <span key={i}>, {el.name}</span>;
                      }
                    })}
                  </div>
                )}
                {data.seasons && (
                  <table className="seasons">
                    <thead>
                      <tr>
                        <th>Seasons</th>
                        <th>Episodes</th>
                        <th>Air</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.seasons.map((el, key) => {
                        if (el.episode_count != 0 && el.air_date) {
                          return (
                            <tr key={key}>
                              <td>{el.name}</td>
                              <td>{el.episode_count}</td>
                              <td>{el.air_date}</td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="desc">
                <p>{data.overview}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showVideo && (
        <div className="player-wrapper" ref={videoRef}>
          <ReactPlayer
            className="react-player"
            onEnded={() => setShowVideo(false)}
            url={`https://www.youtube.com/watch?v=${videoId}`}
            width="100%"
            height="100%"
            onDisablePIP={true}
            controls
          />
        </div>
      )}
      {!isLoading && (
        <div className="other">
          {recommend.length > 0 && (
            <div className="recommendContainer">
              <h2>{video.length > 1 ? "Recommends" : "Recommend"}</h2>
              <div className="recommend">
                {recommend.map((el, i) => (
                  <motion.div
                    className="card"
                    key={i}
                    onClick={() => goToWatch(el)}
                    initial={{
                      y: "50px",
                    }}
                    animate={{
                      y: 0,
                    }}
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 1.05,
                    }}
                  >
                    <LazyImage src={baseUrl + `${el.poster_path}`} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Watch;
