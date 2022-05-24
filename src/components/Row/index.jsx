import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAxiosPrivate, useGoToWatch } from "../../hooks";
import { LazyImage } from "../../components";
import "./style.scss";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";

const Row = ({ Title, Wide, Req }) => {
  const baseUrl = "https://image.tmdb.org/t/p/w500/";
  const axiosPrivate = useAxiosPrivate();
  const goToWatch = useGoToWatch();
  const box = useRef();
  const [data, setdata] = useState([]);
  const [focus, setfocus] = useState(false);
  const [isAlpha, setisAlpha] = useState(true);
  const [isOmega, setisOmega] = useState(false);

  useEffect(() => {
    async function get() {
      try {
        const { data } = await axiosPrivate.get(Req);
        setdata(data.results);
      } catch (err) {
        if (err.response.status == 401) return;
        throw err.response?.data.message;
      }
    }
    get();
  }, [Req]);

  useEffect(() => {
    box.current.scrollLeft = 0;
    setisAlpha(true);
  }, [data, focus]);

  const scroll = (x) => {
    let sw = box.current.offsetWidth / 2;
    if (x === "right") {
      box.current.scrollLeft += sw * 1.8;
    } else {
      box.current.scrollLeft -= sw * 1.8;
    }
  };

  const arrow = () => {
    if (box.current.scrollLeft >= box.current.scrollLeftMax) {
      setisOmega(true);
    } else {
      setisOmega(false);
    }
    if (box.current.scrollLeft > 0) {
      setisAlpha(false);
    } else {
      setisAlpha(true);
    }
  };

  return (
    <>
      <motion.div
        className="row"
        onMouseLeave={() => setfocus(!focus)}
        initial={{
          opacity: 0,
          y: "50px",
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <h2>{Title}</h2>
        <div className="row-box">
          <div className="arrow">
            <BiChevronLeft
              className={`left ${isAlpha && "disable"}`}
              onClick={() => scroll("left")}
              style={{ zIndex: isAlpha && "-99" }}
            />
            <BiChevronRight
              className={`right ${isOmega && "disable"} `}
              onClick={() => scroll("right")}
              style={{ zIndex: isOmega && "-99" }}
            />
          </div>

          <div className="box" ref={box} onScroll={arrow}>
            {data &&
              data.map((e, i) => (
                <div
                  className={`${Wide ? "cardwide" : "card"}`}
                  key={i}
                  onClick={() => goToWatch(e)}
                  initial={{
                    opacity: 0,
                    y: "50px",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <LazyImage
                    keys={i}
                    src={baseUrl + `${Wide ? e.backdrop_path : e.poster_path}`}
                    alt={e.title}
                  />
                  {Wide && (
                    <div className="title">
                      <span>{e.name}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Row;
