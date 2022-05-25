import { useEffect, useState } from "react";
import { Dropzone, FileItem } from "@dropzone-ui/react";
import { useAxiosPrivate } from "../../hooks";
import "./style.scss";

const ImageUpload = ({ type, data, edit, initial, close }) => {
  const axiosPrivate = useAxiosPrivate();
  const [files, setFiles] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    initial && setNewUsername(initial?.username);
  }, [initial]);

  const editAxios = async (updatedUser) => {
    try {
      await axiosPrivate.patch(
        `auth/updateuser/${initial?.username}`,
        {
          username: updatedUser.username,
          imgUrl: updatedUser.imgUrl,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (updatedUser.username && updatedUser.imgUrl) {
        edit({
          username: updatedUser.username,
          imgUrl: updatedUser.imgUrl,
        });
      } else {
        edit((prev) => {
          return {
            ...prev,
            ...(updatedUser.username && { username: updatedUser.username }),
            ...(updatedUser.imgUrl && { imgUrl: updatedUser.imgUrl }),
          };
        });
      }
      close(false);
      return;
    } catch (err) {
      if (err.response.status == 401) return;
      setError(err.response?.data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = files[0]?.file;
    if (!file && type == "add") {
      setImgError(true);
      return;
    }
    setImgError(false);
    const fr = new FileReader();
    file && fr.readAsDataURL(file);
    fr.onload = async () => {
      if (type == "add") {
        try {
          await axiosPrivate.put(
            "auth/user",
            {
              username: newUsername,
              imgUrl: fr.result,
            },
            { headers: { "Content-Type": "application/json" } }
          );

          data({
            username: newUsername,
            imgUrl: fr.result,
          });
          close(false);
          return;
        } catch (err) {
          if (err.response.status == 401) return;
          setError(err.response?.data.message);
        }
      } else {
        const updatedUser = {
          ...(newUsername !== initial.username && { username: newUsername }),
          imgUrl: fr.result,
        };
        ((file && fr.result) || fr.result) && (await editAxios(updatedUser));
      }
    };
    fr.onerror = () => {
      setImgError("something went wrong");
    };

    if (!file && newUsername != "" && type != "add") {
      const updatedUser = {
        username: newUsername,
      };
      await editAxios(updatedUser);
    }
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className={`uploadBox ${error ? "imgError" : ""}`}>
            <Dropzone
              maxHeight="20em"
              minHeight="15em"
              onChange={(img) => setFiles(img)}
              value={files}
              maxFiles={1}
              // header={false}
              maxFileSize={2998000}
              label="Drag'n drop files here or click to browse"
              accept=".png,.jpeg,.jpg"
              uploadingMessage={"Uploading..."}
              fakeUploading
              disableScroll
            >
              {files?.map((file, i) => (
                <FileItem {...file} preview info hd key={i} />
              ))}
            </Dropzone>
          </div>
          {imgError && <p style={{ color: "red" }}>image field is required</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="text"
            placeholder="username"
            autoComplete="off"
            required={type == "add" ? true : false}
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <div className="buttons">
            <button
              className={`${type == "add" ? "addbtn" : "updatebtn"}`}
              type="submit"
            >
              {type == "add" ? "Add" : "Update"}
            </button>
            <button
              className={`${type == "add" ? "addbtn" : "updatebtn"}`}
              type="reset"
              onClick={() => close(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ImageUpload;
