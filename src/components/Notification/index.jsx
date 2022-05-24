import { useState, useEffect, useRef } from "react";
import { MdNotifications } from "react-icons/md";
import {
  useAxiosPrivate,
  useOnClickOutside,
  useGlobalState,
  useGoToWatch,
} from "../../hooks";
import "./style.scss";

const Notification = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const [data, setData] = useState([]);
  const [indicator, setIndicator] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const goToWatch = useGoToWatch();
  const axiosPrivate = useAxiosPrivate();
  const notificationRef = useRef(null);
  useOnClickOutside([notificationRef], () => setShowNotification(false));
  const baseUrl = "https://image.tmdb.org/t/p/w500/";

  const ranOnce = () => {
    let count = 0;
    const ranOnceFun = (fun) => {
      if (count == 0) {
        fun();
        globalState.notifyIdicator == undefined &&
          setGlobalState((prev) => {
            return {
              ...prev,
              notifyIdicator: true,
            };
          });
        count++;
      }
    };
    return ranOnceFun;
  };

  useEffect(() => {
    const controller = new AbortController();
    const get = async () => {
      try {
        const { data } = await axiosPrivate("/notification");
        setData(data.results);
      } catch (err) {
        throw err.response?.data.message;
      }
    };
    ranOnce()(get);
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    !indicator &&
      setGlobalState((prev) => {
        return {
          ...prev,
          notifyIdicator: false,
        };
      });
  }, [indicator]);

  return (
    <>
      <div className="notification-icon" ref={notificationRef}>
        {globalState.notifyIdicator && <span className="indicator"></span>}
        <MdNotifications
          className="icon"
          onClick={() => {
            setIndicator(false);
            setShowNotification(!showNotification);
          }}
        />
        {showNotification && (
          <div className="notificationOut">
            <h2>Upcoming...</h2>
            <div className="dataBox">
              {data.map((item, i) => (
                <div
                  key={i}
                  className="card-row"
                  onClick={() => {
                    goToWatch(item);
                  }}
                >
                  <div className="poster">
                    <img src={`${baseUrl}${item.poster_path}`} />
                  </div>
                  <div className="title">
                    {item.title}
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;
