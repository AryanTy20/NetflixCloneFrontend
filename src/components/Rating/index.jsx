import { useRef, useState, useEffect } from "react";
import "./style.scss";

const Rating = ({ rating }) => {
  const progressRef = useRef(null);
  const [progressValue, setProgressValue] = useState(0);
  const [percentColor, setPercentColor] = useState("white");

  useEffect(() => {
    let bgColor, progressColor;
    if (!rating) {
      bgColor = "#666666";
      progressColor = "#666666";
      setProgressValue("NR");
      return;
    }
    if (rating > 6) {
      setPercentColor("#21d07a");
      bgColor = "#204529";
      progressColor = "#21d07a";
    } else if (rating > 3) {
      setPercentColor("#d2d531");
      bgColor = "#423d0f";
      progressColor = "#d2d531";
    } else {
      setPercentColor("#be2424");
      bgColor = "#961c1c";
      progressColor = "#d92f23";
    }

    const progress = setInterval(() => {
      if (progressValue < rating * 10) {
        setProgressValue((prev) => prev + 1);
        progressRef.current.style.background = `conic-gradient(
        ${progressColor} ${progressValue * 3.6}deg,
        ${bgColor} ${progressValue * 3.6}deg)`;
      }
      if (progressValue == rating * 10) {
        clearInterval(progress);
      }
    }, 10);
    return () => {
      clearInterval(progress);
    };
  }, [progressValue]);

  return (
    <>
      <div className="circular-progress" ref={progressRef}>
        <div
          className="value-container"
          style={{ color: percentColor }}
        >{`${progressValue}${isNaN(progressValue) ? "" : "%"}`}</div>
      </div>
    </>
  );
};

export default Rating;
