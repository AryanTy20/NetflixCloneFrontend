import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, CheckInternet } from "../../";
import { useAuth, useLocalStorageList, useWindowResizer } from "../../../hooks";
import { Axios } from "../../../helper/axios";
import "./style.scss";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [setList] = useLocalStorageList();
  const [height, width] = useWindowResizer();
  const [windowHeight, setWindowHeight] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const formHandle = async (e) => {
    e.preventDefault();
    const entries = new FormData(e.target);
    const loginData = Object.fromEntries(entries);
    loginData.remember == "on"
      ? (loginData.remember = true)
      : (loginData.remember = false);
    try {
      const res = await Axios.post("/auth/login", JSON.stringify(loginData), {
        headers: {
          "Content-type": "application/json",
        },
      });
      if (res.status == 200) {
        setAuth((prev) => {
          return {
            ...prev,
            accessToken: res.data.accessToken,
          };
        });
        navigate(from, { replace: true });
      }
      localStorage.clear();
      if (res?.data?.list.length > 0) {
        res?.data?.list.map((el) => setList(el));
      }
    } catch (err) {
      err.response?.status >= 400 && setError("Wrong Credentials");
    }
  };
  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, [width]);

  return (
    <>
      <CheckInternet />
      <Navbar navlink={false} menu={false} profile={false} />
      <div className="loginBox" style={{ height: `${windowHeight}px` }}>
        <img src="https://i.ibb.co/gWNCCXD/rgbbig-min.png" loading="lazy" />
        <div className="login">
          <form className="login_form" onSubmit={formHandle}>
            {error && <p className="error shake">{error}</p>}
            <h2>Sign In</h2>
            <div className="input_box">
              <div className="user">
                <input
                  type="text"
                  name="username"
                  placeholder=" "
                  required
                  onKeyUp={(e) => e.target.value.length > 0 && setError("")}
                />
                <label htmlFor="username">Email or username</label>
              </div>
              <div className="pass">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder=" "
                  required
                  onKeyUp={(e) => e.target.value.length > 0 && setError("")}
                />
                <label htmlFor="password">Password</label>
                <span
                  className="show-btn"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </span>
              </div>
            </div>
            <button type="submit" className="submit-btn">
              Sign In
            </button>

            <div className="otherlinks">
              <label className="check__remember">
                Remember me
                <input type="checkbox" name="remember" />
                <span className="checkmark"></span>
              </label>
              <Link to="/resetpassword">Need help ?</Link>
            </div>
            <div className="signup-link">
              New to Netflix?
              <Link to="/register">Sign up now.</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
