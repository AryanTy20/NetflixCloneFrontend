import { useState, useEffect, useRef } from "react";
import { MdSearch, MdClose } from "react-icons/md";
import {
  useAxiosPrivate,
  useOnClickOutside,
  useWindowResizer,
} from "../../hooks";

import "./style.scss";

const SearchBox = ({
  searchOpen,
  setSearchOpen,
  searchOutRef,
  setSearchResult,
  page,
}) => {
  const [query, setquery] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [height, width] = useWindowResizer();
  const [Data, setData] = useState([]);
  const searchRef = useRef(null);
  useOnClickOutside([searchRef, searchOutRef], () => {
    setSearchOpen(false);
    setSearchResult((prev) => {
      return {
        ...prev,
        data: [],
        loading: false,
      };
    });
    setquery("");
  });

  useEffect(() => {
    const controller = new AbortController();
    setSearchResult((prev) => {
      return {
        ...prev,
        query,
        loading: true,
        error: false,
      };
    });

    const get = async () => {
      try {
        if (page == 1) {
          const res = await axiosPrivate(`/search?&title=${query}`);
          setSearchResult((prev) => {
            return {
              ...prev,
              data: res?.data?.results,
              loading: false,
              hasMore: res?.data?.total_pages > page,
            };
          });
          setData(res?.data?.results);
        } else {
          const res = await axiosPrivate(
            `/search?&title=${query}&page=${page}`
          );
          setData((prev) => {
            return [...prev, ...res?.data?.results];
          });
          setSearchResult((prev) => {
            return {
              ...prev,
              loading: false,
              hasMore: res?.data?.total_pages > page,
            };
          });
        }
      } catch (err) {
        if (err.response?.status == 401) return;
        if (!err.response) {
          setError("No Internet Connection");
        } else if (err.response) {
          setSearchResult({ error: err });
        } else {
          throw err.response?.data.message;
        }
      }
    };
    query != "" && get();
    return () => {
      controller.abort();
    };
  }, [query, page]);

  useEffect(() => {
    if (page > 1) {
      setSearchResult((prev) => {
        return {
          ...prev,
          data: [
            ...Data.reduce(
              (map, obj) => map.set(obj.id, obj),
              new Map()
            ).values(),
          ],
        };
      });
    }
  }, [Data]);

  useEffect(() => {
    if (query.length == 0 || !searchOpen) {
      setSearchResult((prev) => {
        return {
          query: "",
          error: false,
          data: [],
          loading: false,
        };
      });
    }
  }, [query, searchOpen]);

  return (
    <>
      <div className="search-box" ref={searchRef}>
        <div className="search_input" opensearch={searchOpen.toString()}>
          {((width < 600 && searchOpen) || width > 600) && (
            <input
              type="search"
              placeholder="search"
              value={query}
              onChange={(e) => setquery(e.target.value)}
            />
          )}

          {((width < 600 && searchOpen) || width > 600) && (
            <MdClose
              className="close"
              onClick={() => {
                setquery("");
              }}
            />
          )}
        </div>

        <MdSearch
          className="search"
          onClick={() => {
            setSearchOpen(!searchOpen);
            setquery("");
          }}
        />
      </div>
    </>
  );
};

export default SearchBox;
