import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Axios } from "../../../helper/axios";
import { Navbar, OTPField } from "../../";
import "./style.scss";

const ForgotPassword = () => {
  const [validEmail, setValidEmail] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <>
      <Navbar menu={false} navlink={false} profile={false} />
      <div className="forgotPassword">
        <img
          src="https://i.ibb.co/nPQwJdb/login-the-crown-2-1500x1000.jpg"
          loading="lazy"
        />
        <div className="signIn">
          <Link to="/login">Sign In</Link>
        </div>

        {validEmail && (
          <OTPField
            type="reset"
            email={email}
            result={setOtpSuccess}
            setShowOtp={setValidEmail}
          />
        )}
        {otpSuccess ? (
          <ResetForm email={email} />
        ) : (
          !validEmail && (
            <EmailForm
              setValidEmail={setValidEmail}
              email={email}
              setEmail={setEmail}
            />
          )
        )}
      </div>
    </>
  );
};

const EmailForm = ({ setValidEmail, email, setEmail }) => {
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const submitEmail = async (e) => {
    e.preventDefault();
    try {
      await Axios.post(
        "/auth/forgot",
        { email },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      setValidEmail(true);
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    setError("");
  }, [email]);

  return (
    <>
      <div className="Form">
        {error && <p className="error">{error}</p>}
        <h1>Forgot Password</h1>
        <form className="emailBox" onSubmit={submitEmail}>
          <div className="emailField">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required={true}
              onBlur={() => setFocused(true)}
              focused={focused.toString()}
            />
            <span>Please enter valid email</span>
          </div>
          <button>Submit</button>
        </form>
      </div>
    </>
  );
};

const ResetForm = ({ email }) => {
  const [pass, setPass] = useState({
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const resetPass = async () => {
    try {
      await Axios.post(
        "auth/reset",
        { email, password: pass.password, repeatPassword: pass.repeatPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/login", { replace: true });
    } catch (err) {
      if (err.response.status == 422) {
        setError("Password not Matched");
      }
    }
  };

  return (
    <>
      <div className="Form">
        {error && <p className="error">{error}</p>}
        <h1>Forgot Password</h1>
        <div className="resetBox">
          <div className="resetField">
            <input
              type="text"
              value={pass.password}
              onChange={(e) => setPass({ ...pass, password: e.target.value })}
              required={true}
              onBlur={() => setFocused(true)}
              focused={focused.toString()}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$@!%&*?])[A-Za-z\\d#$@!%&*?]{8,20}$"
              placeholder="Password"
            />
            <span>
              password should be 8-20 characters long and should at least 1
              uppercase , 1 symbol and 1 digit
            </span>
          </div>
          <div className="resetField">
            <input
              type="text"
              value={pass.repeatPassword}
              onChange={(e) =>
                setPass({ ...pass, repeatPassword: e.target.value })
              }
              required={true}
              onBlur={() => setFocused(true)}
              focused={focused.toString()}
              pattern={pass.password}
              placeholder="Repeat Password"
            />
            <span>Password not Matched</span>
          </div>
          <button onClick={resetPass}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
