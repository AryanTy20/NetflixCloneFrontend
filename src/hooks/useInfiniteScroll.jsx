import { useState, useEffect } from "react";
import { useAxiosPrivate } from "./useAxiosPrivate";

export const useInfiniteScroll = (req, page) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [Data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setLoading(true);
    setError(false);
    const controller = new AbortController();
    const get = async () => {
      try {
        const { data } = await axiosPrivate.get(`/${req}/${page}`, {
          signal: controller.signal,
        });
        setData((prev) => {
          return [...prev, ...data.results];
        });
        setHasMore(data?.total_pages > page);
        setLoading(false);
      } catch (err) {
        setError(true);
        if (!err?.response) {
          setError("No Internet Connection");
        } else if (err.response.status == 401) {
          return;
        } else {
          throw err.response.data.message;
        }
      }
    };
    get();

    return () => {
      controller.abort();
    };
  }, [req, page]);

  return { loading, error, Data, hasMore };
};
