import { Navbar } from "../../components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.scss";

const PageNotFound = () => {
  return (
    <>
      <Navbar menu={false} profile={false} />
      <motion.div
        id="notfound"
        initial={{
          y: "50px",
        }}
        animate={{
          y: 0,
        }}
      >
        <div className="notfound">
          <div className="notfound-404">
            <h1>404</h1>
            <h2>Page not found</h2>
          </div>
          <Link to="/">
            <span>Homepage</span>
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default PageNotFound;
