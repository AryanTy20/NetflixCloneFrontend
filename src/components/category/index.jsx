import { useState, useRef, useCallback, useEffect } from "react";
import { LazyImage, Loader } from "../";
import { motion } from "framer-motion";
import { useInfiniteScroll, useGoToWatch } from "../../hooks";
import "./style.scss";

const Category = ({ req }) => {
  const [page, setPage] = useState(1);
  const baseUrl = "https://image.tmdb.org/t/p/w500/";
  const goToWatch = useGoToWatch();
  const [isLoading, setIsLoading] = useState(true);
  const { error, hasMore, Data, loading } = useInfiniteScroll(req, page);
  const observer = useRef();
  const lastElementRef = useCallback(
    (element) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (element) observer.current.observe(element);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    page == 1 && Data.length > 0 && setIsLoading(false);
  }, [Data]);

  return (
    <>
      <div className="main">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="content">
            {Data?.map((item, index) => {
              if (Data.length == index + 1) {
                return (
                  <div
                    className="card"
                    ref={lastElementRef}
                    key={index}
                    onClick={() => goToWatch(item)}
                  >
                    <LazyImage src={`${baseUrl}${item.poster_path}`} />
                  </div>
                );
              } else {
                return (
                  <motion.div
                    className="card"
                    key={index}
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
                    whileTap={{
                      scale: 1.05,
                    }}
                  >
                    <LazyImage src={`${baseUrl}${item.poster_path}`} />
                  </motion.div>
                );
              }
            })}
            {loading && page != 1 && (
              <div className="card">
                <Loader />
              </div>
            )}
            {!loading && error && <p>Error...</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default Category;
