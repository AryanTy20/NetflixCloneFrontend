import { useState, useEffect } from "react";
import { Axios } from "../../../helper/axios";
import { Link } from "react-router-dom";
import { Navbar, OTPField, CheckInternet } from "../../";
import "./style.scss";
import { useWindowResizer } from "../../../hooks";

const Register = () => {
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [height, width] = useWindowResizer();
  const [windowHeight, setWindowHeight] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, [width]);

  const formHandle = async (e) => {
    e.preventDefault();
    if (passErr) return;
    try {
      await Axios.post("auth/register", value, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setShowOtp(true);
    } catch (err) {
      if (err.response?.status == 401) return;
      setError(err.response?.data?.message);
    }
  };

  const inputs = [
    {
      id: 1,
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      pattern: "^[A-Za-z0-9]{3,15}",
      errorMessage:
        "username should be 3-15 characters and shouldn't include any special character .",
    },
    {
      id: 2,
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      pattern: "(\\w+.?)(\\w*.?){2}@(gmail.com||Gmail.com)$",
      errorMessage: "email should be valid email .",
    },
    {
      id: 3,
      name: "password",
      label: "Password",
      type: "text",
      required: true,
      pattern:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$@!%&*?])[A-Za-z\\d#$@!%&*?]{8,20}$",
      errorMessage:
        "password should be 8-20 characters long and should at least 1 uppercase , 1 symbol and 1 digit",
    },
    {
      id: 4,
      name: "repeatPassword",
      label: "Repeat Password",
      type: "text",
      required: true,
    },
  ];

  const onChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    value.repeatPassword !== value.password
      ? setPassErr(true)
      : setPassErr(false);
  }, [value.password, value.repeatPassword]);

  return (
    <>
      <CheckInternet />
      <Navbar menu={false} navlink={false} profile={false} />
      <div className="registerBox" style={{ Height: `${windowHeight}px` }}>
        <img src="https://i.ibb.co/gWNCCXD/rgbbig-min.png" loading="lazy" />
        {!showOtp ? (
          <div className="register">
            <form
              className="register_form"
              onSubmit={formHandle}
              autoComplete="off"
            >
              {error && !showOtp && <p className="error shake">{error}</p>}
              <h2>Sign Up</h2>
              <div className="input_box">
                {inputs.map((input) => (
                  <FormInput
                    key={input.id}
                    {...input}
                    value={value[input.name]}
                    onChange={onChange}
                    passErr={passErr}
                  />
                ))}
              </div>
              <button type="submit">Sign Up</button>
              <div className="signin-link">
                Already an User?
                <Link to="/login">Sign In now.</Link>
              </div>
            </form>
          </div>
        ) : (
          <OTPField
            type="account"
            setShowOtp={setShowOtp}
            email={value.email}
          />
        )}
      </div>
    </>
  );
};

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, value, onChange, id, errorMessage, passErr, ...inputProps } =
    props;
  const [passError, setPassError] = useState(false);

  const handleFocus = () => {
    setFocused(true);
    setPassError(passErr);
  };
  useEffect(() => {
    focused && setPassError(passErr);
  }, [passErr]);

  return (
    <>
      <div className="input_field" key={id}>
        <input
          onChange={onChange}
          {...inputProps}
          value={value}
          onBlur={handleFocus}
          placeholder=" "
          focused={focused.toString()}
          className={label == "Repeat Password" && passError ? "passErr" : ""}
        />
        <span className="input_error">{errorMessage}</span>
        {label == "Repeat Password" && passError && (
          <span className="notmatched">Password not Matched</span>
        )}
        <label>{label}</label>
      </div>
    </>
  );
};

export default Register;
