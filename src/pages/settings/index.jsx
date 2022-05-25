import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Loader, OTPField, CheckInternet } from "../../components";
import { useAxiosPrivate, useOnClickOutside } from "../../hooks";
import "./style.scss";

const Setting = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [updatedValue, setUpdatedValue] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    const get = async () => {
      try {
        const res = await axiosPrivate.get("/auth/profile");
        setData(res.data);
        setIsLoading(false);
      } catch (err) {
        if (err.response?.status == 401) return;
        if (!err.response) {
          setError("No Internet Connection");
        } else {
          throw err.response?.data.message;
        }
      }
    };
    get();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setUpdatedValue({
      ...updatedValue,
      username: data.username,
      email: data.email,
    });
  }, [data]);

  useEffect(() => {
    updatedValue.email !== data.email
      ? setEmailChanged(true)
      : setEmailChanged(false);
  }, [updatedValue.email]);

  const changeHandler = () => {
    const change = {};
    if (updatedValue.username !== data.username)
      change["username"] = updatedValue.username;
    if (updatedValue.email !== data.email) change["email"] = updatedValue.email;
    if (updatedValue.password != "") change["password"] = updatedValue.password;
    if (updatedValue.repeatPassword != "")
      change["repeatPassword"] = updatedValue.repeatPassword;
    return change;
  };
  const updateProfile = async () => {
    if (error) console.log(error);
    const change = changeHandler();
    if (emailChanged) {
      setShowOtp(true);
      return;
    }
    try {
      const res = await axiosPrivate.patch("/auth/updateprofile", { change });
      setData({ ...data, username: res.data.username, email: res.data.email });
      setUpdate(false);
    } catch (err) {
      console.log(err);
    }
  };

  const updateInputs = [
    {
      id: 1,
      name: "username",
      placeholder: "Username",
      readOnly: !update && true,
      pattern: "^[A-Za-z0-9]{3,15}",
      errorMessage:
        "username should be 3-15 characters and shouldn't include any special character .",
    },
    {
      id: 2,
      name: "email",
      placeholder: "Email",
      readOnly: !update && true,
      pattern: "(\\w+.?)(\\w*.?){2}@gmail.com|@GMAIL.COM$",
      errorMessage: "email should be valid email .",
    },

    {
      id: 3,
      name: "password",
      placeholder: "Password",
      readOnly: !update && true,
      pattern:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$@!%&*?])[A-Za-z\\d#$@!%&*?]{8,20}$",
      errorMessage:
        "password should be 8-20 characters long and should at least 1 uppercase , 1 symbol and 1 digit .",
    },
    {
      id: 4,
      name: "repeatPassword",
      placeholder: "Repeat Password",
      readOnly: !update && true,
      pattern: updatedValue.password,
      errorMessage: "passwords not matched",
    },
  ];

  const onChange = (e) => {
    setUpdatedValue({ ...updatedValue, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const controller = new AbortController();
    if (validEmail) {
      const change = changeHandler();
      const emailUpdate = async () => {
        try {
          const res = await axiosPrivate.patch(
            "/auth/updateprofile",
            {
              change,
            },
            { signal: controller.signal }
          );
          setData({
            ...data,
            username: res.data.username,
            email: res.data.email,
          });
          setUpdate(false);
        } catch (err) {
          console.log(err);
        }
      };

      emailUpdate();
    }

    return () => {
      controller.abort();
    };
  }, [validEmail]);

  return (
    <>
      <CheckInternet />
      <Navbar profile={false} menu={false} />
      <div className="settingBox">
        {!isLoading ? (
          <div
            className={`setting ${showConfirmModal || showOtp ? "blur" : ""}`}
          >
            <h1> Account Setting</h1>
            <div className="accountInfo">
              <div className="info">
                {update ? (
                  updateInputs.map((input) => (
                    <FormInput
                      key={input.id}
                      {...input}
                      value={updatedValue[input.name]}
                      onChange={onChange}
                      onError={setError}
                    />
                  ))
                ) : (
                  <div className="displayOnly">
                    <div className="displayInput">
                      <label htmlFor="username">Username</label>
                      <input type="text" readOnly value={data.username || ""} />
                    </div>
                    <div className="displayInput">
                      <label htmlFor="email">Email</label>
                      <input type="text" readOnly value={data.email || ""} />
                    </div>
                    <div className="displayInput">
                      <label htmlFor="active">Active</label>
                      <input
                        type="text"
                        readOnly
                        defaultValue={data?.active || ""}
                      />
                    </div>
                    <div className="displayInput">
                      <label htmlFor="DOJ">Date of joining</label>
                      <input
                        type="text"
                        readOnly
                        value={(data.DOJ && data?.DOJ.substr(0, 10)) || ""}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="buttons">
                <button
                  onClick={() => {
                    setUpdate(true);
                    update && updateProfile();
                  }}
                >
                  {update ? "Update" : "Edit"}
                </button>
                {update ? (
                  <button onClick={() => setUpdate(!update)}>Cancel</button>
                ) : (
                  <button onClick={() => setShowConfirmModal(true)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
        {showConfirmModal && <ConfirmModal showModal={setShowConfirmModal} />}
        {showOtp && (
          <OTPField
            setShowOtp={setShowOtp}
            type="email"
            result={setValidEmail}
            email={updatedValue.email}
          />
        )}
      </div>
    </>
  );
};

const ConfirmModal = ({ showModal }) => {
  const popRef = useRef();
  const navigate = useNavigate();
  useOnClickOutside([popRef], () => showModal(false));
  const axiosPrivate = useAxiosPrivate();

  const deleteAccount = async () => {
    try {
      await axiosPrivate.delete("/auth/deleteprofile");
      navigate("/login", { replace: true });
      localStorage.clear();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="confirmBox">
        <div className="confirmModal" ref={popRef}>
          <div className="info">
            <h2>Are you sure you want to delete ?</h2>
          </div>
          <div className="buttons">
            <button onClick={deleteAccount}>Confirm</button>
            <button onClick={() => showModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const { value, onChange, id, errorMessage, onError, ...inputProps } = props;

  useEffect(() => {
    if (inputRef.current.validity.valid) {
      onError(false);
    } else {
      onError(true);
    }
  }, [inputRef?.current?.validity?.valid]);

  const handleFocus = () => {
    setFocused(true);
  };
  return (
    <>
      <div className="input_field" key={id}>
        <input
          onChange={onChange}
          {...inputProps}
          value={value}
          onBlur={handleFocus}
          focused={focused.toString()}
          ref={inputRef}
        />

        <span className="input_error">{errorMessage}</span>
      </div>
    </>
  );
};

export default Setting;
