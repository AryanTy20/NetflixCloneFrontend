import { useState } from "react";
import {
  BsCheckCircle as CheckIcon,
  BsPlusCircle as AddIcon,
} from "react-icons/bs";
import { Rating, LazyImage } from "../";
import { useGoToWatch, useToggleList, useLocalStorageList } from "../../hooks";
import "./style.scss";

const MoreInfoPopUp = ({ Data = "" }) => {
  const [setList, removeList, existList] = useLocalStorageList();
  const [addToggle, setAddToggle] = useState(existList(Data?.id));
  const goToWatch = useGoToWatch();
  const toggleList = useToggleList();
  const baseUrl = "https://image.tmdb.org/t/p/w500";

  const listToggle = async () => {
    const res = await toggleList(Data);
    if (res == true) {
      setAddToggle(true);
      setList(Data.id);
    } else {
      setAddToggle(false);
      removeList(Data.id);
    }
  };

  return (
    <>
      <div className="popModal">
        <div className="poster">
          <div className="card">
            {Data && <LazyImage src={`${baseUrl}${Data.poster_path}`} />}
          </div>
          <div className="controlbtn">
            <button className="playbtn" onClick={() => goToWatch(Data)}>
              Play
            </button>
            {addToggle ? (
              <CheckIcon className="checkIcon" onClick={listToggle} />
            ) : (
              <AddIcon className="addIcon" onClick={listToggle} />
            )}
          </div>
        </div>
        <div className="metaInfo">
          <h1 className="title">
            {Data.title}
            {Data.name}
          </h1>
          <div className="rating">
            <span>
              <Rating rating={Data.vote_average} />
            </span>
            {Data?.original_language ? (
              <span className="languages">
                <span>Languages : {Data?.original_language}</span>
              </span>
            ) : (
              <span className="languages">
                <span>
                  Languages :
                  {Data.languages.map((el, i) => {
                    if (i == 0) {
                      return <span key={i}>{el}</span>;
                    } else {
                      return <span key={i}> , {el}</span>;
                    }
                  })}
                </span>
              </span>
            )}
          </div>
          {Data.tagline && (
            <div className="tagline">
              <b>Tagline : {Data.tagline}</b>
            </div>
          )}
          <div className="genre">
            <span>{Data.genres.length == 1 ? "Genre" : "Genres"} : </span>
            <span className="genreChild">
              {Data.genres.map((el, i) => {
                if (i == 0) {
                  return <span key={i}>{el.name}</span>;
                } else {
                  return <span key={i}>, {el.name}</span>;
                }
              })}
            </span>
          </div>
          {Data.release_date && (
            <div className="release" style={{ marginBottom: "0.5em" }}>
              Released On : {Data.release_date}
            </div>
          )}
          {Data.runtime && (
            <div className="runtime" style={{ marginTop: "0.5em" }}>
              Runtime : {Data.runtime} min
            </div>
          )}
          <div className="createdby">
            Created By :
            {Data.created_by.map((el, i) => {
              if (i == 0) {
                return <span key={i}> {el.name} </span>;
              } else {
                return <span key={i}>, {el.name}</span>;
              }
            })}
          </div>
          <table className="seasons">
            <thead>
              <tr>
                <th>Seasons</th>
                <th>Episodes</th>
                <th>Air</th>
              </tr>
            </thead>
            <tbody>
              {Data.seasons.map((el, key) => {
                if (el.episode_count != 0 && el.air_date) {
                  return (
                    <tr key={key}>
                      <td>{el.name}</td>
                      <td>{el.episode_count}</td>
                      <td>{el.air_date}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
        <div className="desc">{Data && Data.overview}</div>
      </div>
    </>
  );
};

export default MoreInfoPopUp;
