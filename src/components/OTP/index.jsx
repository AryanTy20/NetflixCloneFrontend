import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Axios } from "../../helper/axios";
import { useAxiosPrivate, useAuth } from "../../hooks";
import "./style.scss";

const OTPField = ({ type, setShowOtp, result, email }) => {
  // const { type, setShowOtp, result, email } = props;

  const [otp, setOtp] = useState({
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
    sixth: "",
  });
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [otpLimit, setOtpLimit] = useState(false);
  const [count, setcount] = useState(1);
  const [disable, setdisable] = useState(true);
  const [timer, setTimer] = useState(60);
  const axiosPrivate = useAxiosPrivate();

  const keyUp = (e) => {
    e.target.value.length == 0 &&
      e.key == "Backspace" &&
      e.target.previousSibling != null &&
      e.target.previousSibling.focus();
    e.target.value.length > 0 &&
      e.target.nextSibling != null &&
      e.target?.nextSibling.focus();
    error != "" && setError("");
  };

  useEffect(() => {
    const countDown = () => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        setdisable(false);
        clearInterval(interval);
      }
      if (count == 3) {
        setdisable(true);
      }
    };
    const interval = setInterval(countDown, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer, count]);

  const resend = () => {
    if (count !== 3) {
      setcount((prev) => prev + 1);
      setOtp({
        first: "",
        second: "",
        third: "",
        fourth: "",
        fifth: "",
        sixth: "",
      });
      setTimer(60);
      setdisable(true);
    }
  };

  const formSubmit = async (e) => {
    const url = type == "account" ? "auth/activate" : "auth/verifyotp";
    e.preventDefault();
    const finalOtp = `${otp.first}${otp.second}${otp.third}${otp.fourth}${otp.fifth}${otp.sixth}`;

    if (type == "email") {
      try {
        await axiosPrivate.post(
          url,
          { otp: finalOtp },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        result(true);
        setShowOtp(false);
        return;
      } catch (err) {
        if (err.response?.status == 401) return;
        err.response.data.message == "OTP limit Reached" && setOtpLimit(true);
        setError(err.response.data.message);
      }
    } else {
      try {
        const res = await Axios.post(
          url,
          { otp: finalOtp },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        if (type == "reset") {
          result(true);
          setShowOtp(false);
        }

        if (type == "account") {
          setAuth((prev) => {
            return {
              ...prev,
              accessToken: res?.data?.accessToken,
            };
          });
          localStorage.clear();
          navigate("/", { replace: true });
        }
      } catch (err) {
        if (err.response?.status == 401) return;
        err.response.data.message == "OTP limit Reached" && setOtpLimit(true);
        setError(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const getOtp = async () => {
      let url;
      switch (type) {
        case "email":
          url = "auth/emailotp";
          break;
        case "reset":
          url = "auth/resetotp";
          break;
        default:
          url = "auth/activateotp";
      }
      try {
        if (type == "email") {
          await axiosPrivate.post(
            url,
            {
              email,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              signal: controller.signal,
            }
          );
        } else {
          await Axios.post(
            url,
            {
              email,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              signal: controller.signal,
            }
          );
        }
      } catch (err) {
        if (err.status == 401) return;
        setError(err.response.data.message);
      }
    };

    getOtp();

    return () => {
      controller.abort();
    };
  }, [count]);

  return (
    <>
      <div className="otp-box">
        {otpLimit ? (
          <div className="otp_max_limit">
            <h2>OTP LIMIT REACHED</h2>
            <button onClick={() => navigate("/login", { replace: true })}>
              Try again later
            </button>
          </div>
        ) : (
          <div className="otp">
            <form onSubmit={formSubmit}>
              {error && <p className="invalid_otp">{error}</p>}
              <h2>OTP Verification</h2>
              <div className="input_box">
                <input
                  type="text"
                  className="input_field"
                  maxLength={1}
                  value={otp.first}
                  onChange={(e) => setOtp({ ...otp, first: e.target.value })}
                  onKeyUp={keyUp}
                  required
                />
                <input
                  type="text"
                  className="input_field"
                  maxLength={1}
                  value={otp.second}
                  onChange={(e) => setOtp({ ...otp, second: e.target.value })}
                  onKeyUp={keyUp}
                  required
                />
                <input
                  type="text"
                  className="input_field"
                  maxLength={1}
                  value={otp.third}
                  onChange={(e) => setOtp({ ...otp, third: e.target.value })}
                  onKeyUp={keyUp}
                  required
                />
                <input
                  type="text"
                  className="input_field"
                  maxLength={1}
                  value={otp.fourth}
                  onChange={(e) => setOtp({ ...otp, fourth: e.target.value })}
                  onKeyUp={keyUp}
                  required
                />
                <input
                  type="text"
                  className="input_field"
                  maxLength={1}
                  value={otp.fifth}
                  onChange={(e) => setOtp({ ...otp, fifth: e.target.value })}
                  onKeyUp={keyUp}
                  required
                />
                <input
                  type="text"
                  className="input_field"
                  maxLength={1}
                  value={otp.sixth}
                  onChange={(e) => setOtp({ ...otp, sixth: e.target.value })}
                  onKeyUp={keyUp}
                  required
                />
              </div>
              <button
                type="submit"
                className={`btn ${count > 3 && disable ? "disable" : ""}`}
              >
                Verify
              </button>
            </form>
            <div className="remains">
              {count == 3 && timer == 0 ? (
                setOtpLimit(true)
              ) : (
                <p>OTP is valid only for {timer} sec.</p>
              )}
            </div>
            <div className="other-btn">
              <button
                className={`btn ${disable ? "disable" : ""}`}
                onClick={resend}
              >
                Resend
              </button>
              <button className="btn" onClick={() => setShowOtp(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OTPField;
