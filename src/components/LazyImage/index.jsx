import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./style.scss";

const LazyImage = ({ src, alt }) => {
  const [visible, setvisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    const Observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((el) => {
          if (el.isIntersecting) {
            setvisible(true);
            Observer.unobserve(el.target);
          }
        });
      },
      {
        rootMargin: "50px 50px 0px 0px",
      }
    );
    imgRef.current && Observer.observe(imgRef.current);
  }, []);

  const imageLoaded = () => {
    setImageLoading(false);
    setTimeout(() => setPulsing(false), 600);
  };

  return visible ? (
    <div className={`${pulsing ? "pulse " : ""}loadable`}>
      <motion.img
        animate={{
          opacity: imageLoading ? 0 : 1,
        }}
        transition={{ opacity: { delay: 0.5, duration: 0.4 } }}
        onLoad={imageLoaded}
        src={src}
        alt={imageLoading ? "" : alt}
        loading="lazy"
      />
    </div>
  ) : (
    <div ref={imgRef} className="loading"></div>
  );
};
export default LazyImage;
