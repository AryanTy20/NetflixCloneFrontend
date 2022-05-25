import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd as AddIcon,
  MdEdit as EditIcon,
  MdDelete as DeleteIcon,
} from "react-icons/md";
import { Navbar, Loader, CheckInternet, ImageUpload } from "../../components";
import { useAxiosPrivate, useLocalStorageImg } from "../../hooks";
import "./style.scss";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [setImg, checkImg] = useLocalStorageImg();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    imgUrl: "",
  });
  const [editedUser, setEditedUser] = useState({
    username: "",
    imgUrl: "",
  });
  const [editData, setEditData] = useState("");
  const [editIndex, seteditIndex] = useState();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    const get = async () => {
      try {
        const res = await axiosPrivate.get("auth/users");
        setUsers(res?.data);
        setIsLoading(false);
        console.log(res.data);
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
    setUsers([...users, updatedUser]);
  }, [updatedUser]);

  useEffect(() => {
    if (!isNaN(editIndex)) {
      const copyUser = users.slice();
      const temp = copyUser[editIndex];
      if (editedUser.username) temp.username = editedUser.username;
      if (editedUser.imgUrl) temp.imgUrl = editedUser.imgUrl;
      setUsers(copyUser);
      setShowEditUser(false);
    }
  }, [editedUser]);

  const edits = async (data, index) => {
    seteditIndex(index);
    if (showDeleteUser) {
      try {
        await axiosPrivate.delete(`auth/deleteuser/${data.username}`);
        setUsers([...users.filter((el) => el.username != data.username)]);
      } catch (err) {
        throw err;
      }
    }
    if (showEditUser) {
      setEditData(data);
      setShowEditForm(true);
    }
  };

  const setUser = (data) => {
    setImg("user", data.imgUrl);
    navigate("/");
  };

  return (
    <>
      <CheckInternet />
      <Navbar profile={false} menu={false} />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="profileContainer">
          <h1>Who's watching ?</h1>
          <div className="profileBox">
            {users?.map((user, i) => (
              <div
                className="card"
                key={i}
                onClick={() =>
                  !showEditUser && !showDeleteUser && setUser(user)
                }
              >
                <div className="edits" onClick={() => edits(user, i)}>
                  {showEditUser && <EditIcon className="icon" />}
                  {showDeleteUser && <DeleteIcon className="icon" />}
                </div>
                <div className="profile">
                  <img src={user.imgUrl} alt={`user ${i}`} />
                </div>
                <h2>{user.username}</h2>
              </div>
            ))}
          </div>
          <div className="upload">
            <div className="controls">
              <AddIcon
                onClick={() => {
                  setShowDeleteUser(false);
                  setShowEditUser(false);
                  setShowAddUser(true);
                }}
                className={`add icon ${users.length == 4 ? "disable" : ""}`}
              />

              <EditIcon
                className="edit icon"
                onClick={() => {
                  setShowEditUser(!showEditUser);
                  setShowDeleteUser(false);
                }}
              />
              <DeleteIcon
                className="delete icon"
                onClick={() => {
                  setShowDeleteUser(!showDeleteUser);
                  setShowEditUser(false);
                }}
              />
            </div>
            {showAddUser && (
              <ImageUpload
                type="add"
                close={setShowAddUser}
                data={setUpdatedUser}
              />
            )}
            {showEditForm && (
              <ImageUpload
                type="Edit"
                close={setShowEditForm}
                initial={editData}
                edit={setEditedUser}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
