import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckInternet = () => {
  const [online, setOnline] = useState(true);
  const closeRef = useRef();
  useEffect(() => {
    const Online = () => {
      setOnline(true);
      toast.success(" Internet Connected ", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };
    const Offline = () => {
      setOnline(false);
      closeRef.current = toast.error(" No Internet Connection ! ", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    window.addEventListener("online", Online);
    window.addEventListener("offline", Offline);

    return () => {
      removeEventListener("online", Online);
      removeEventListener("offline", Offline);
    };
  }, []);

  useEffect(() => {
    if (online) {
      toast.dismiss(closeRef.current);
      // toast.clearWaitingQueue();
    }
  }, [online]);

  return (
    <>
      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        limit={1}
        rtl={false}
        pauseOnFocusLoss
        draggable
        style={{ fontSize: "var(--fs-n)", zIndex: "999999" }}
      />
    </>
  );
};

export default CheckInternet;
