import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { SearchBox, Notification, LazyImage } from "../";
import {
  useWindowResizer,
  useLogout,
  useOnClickOutside,
  useGoToWatch,
  useLocalStorageImg,
} from "../../hooks";
import { motion } from "framer-motion";
import "./style.scss";

const Navbar = ({ navlink = true, menu = true, profile = true }) => {
  const [showDrop, setshowDrop] = useState(false);
  const [height, width] = useWindowResizer();
  const [mobMenu, setMobMenu] = useState(width < 1023);
  const [showMobMenu, setShowMobMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scroll, setscroll] = useState(false);
  const [page, setPage] = useState(1);
  const goToWatch = useGoToWatch();
  const [searchResult, setSearchResult] = useState({
    query: "",
    data: [],
    error: false,
    loading: true,
    hasMore: false,
  });
  const Logout = useLogout();
  const [setImg, checkImg] = useLocalStorageImg();
  const [lastPosition, setLastPosition] = useState();
  const [logoClass, setLogoClass] = useState("");
  const profileRef = useRef(null);
  const menuRef = useRef(null);
  const searchOutRef = useRef(null);
  useOnClickOutside([profileRef], () => setshowDrop(false));
  useOnClickOutside([menuRef], () => setShowMobMenu(false));
  const baseUrl = "https://image.tmdb.org/t/p/w500";

  const logoClassName = () => {
    let logoL = "logoL",
      logoW = "logoWord";
    if (width < 600 && (!menu || !profile)) {
      setLogoClass(logoW);
    } else if (width < 600) {
      setLogoClass(logoL);
    } else if (width > 600) {
      setLogoClass(logoW);
    }
  };

  useEffect(() => {
    const windowScroll = window.addEventListener("scroll", () => {
      if (window.screenX) removeEventListener("scroll", windowScroll);
      if (window.scrollY > 50) {
        setscroll(true);
      } else {
        setscroll(false);
      }
    });
    return () => {
      removeEventListener("scroll", windowScroll);
    };
  }, []);

  useEffect(() => {
    setMobMenu(width < 1023);
    setShowMobMenu(false);
    logoClassName();
  }, [width]);

  useEffect(() => {
    if (searchResult.data.length > 0) {
      page == 1 && setLastPosition(window.scrollY);
      window.scrollTo(0, 0);
    }
    !searchOpen && window.scrollTo(0, lastPosition);
  }, [searchResult.data.length]);

  return (
    <>
      <div
        className={`navbar ${
          (scroll && menu) || searchResult.data.length > 0
            ? "navfix"
            : "navnormal"
        }`}
      >
        <div className="logo_box">
          <div
            className={`logo ${logoClass}`}
            style={{
              marginLeft:
                mobMenu && (menu || profile) ? "clamp(2em,20%,5em)" : "0",
            }}
          >
            {navlink ? (
              <Link to="/">
                <picture>
                  {profile && menu && (
                    <source
                      media="(max-width:600px )"
                      srcSet="https://i.ibb.co/NV6LGgV/LogoL.png"
                    />
                  )}
                  <img
                    src="https://i.ibb.co/nRYmVmh/LogoW.png"
                    loading="lazy"
                    alt="Logo"
                  />
                </picture>
              </Link>
            ) : (
              <picture>
                <img
                  src="https://i.ibb.co/nRYmVmh/LogoW.png"
                  alt="Logo"
                  loading="lazy"
                />
              </picture>
            )}
          </div>
        </div>
        <div className="menuContainer" ref={menuRef}>
          {mobMenu && navlink && menu && (
            <div className="ham " onClick={() => setShowMobMenu(!showMobMenu)}>
              <span className={showMobMenu ? "open" : ""}></span>
            </div>
          )}
          {menu && (mobMenu ? showMobMenu : true) && (
            <ul className={`menu ${mobMenu ? "mobMenu" : ""}`}>
              <NavLink to="/">
                <li>Home</li>
              </NavLink>
              <NavLink to="/movies">
                <li>Movies</li>
              </NavLink>
              <NavLink to="/series">
                <li>Series</li>
              </NavLink>
              <NavLink to="/wishlist">
                <li>Watchlist</li>
              </NavLink>
            </ul>
          )}
        </div>
        {profile && (
          <div className="navBarProfile">
            <div className="navbar_profile">
              <SearchBox
                setSearchResult={setSearchResult}
                searchOutRef={searchOutRef}
                page={page}
                setSearchOpen={setSearchOpen}
                searchOpen={searchOpen}
              />
              {((width < 600 && !searchOpen) || width > 600) && (
                <Notification />
              )}
              {((width < 600 && !searchOpen) || width > 600) && (
                <div className="profileBox" ref={profileRef}>
                  <div
                    className="profile"
                    onClick={() => setshowDrop(!showDrop)}
                  >
                    <img
                      src={
                        checkImg("user")
                          ? checkImg("user")
                          : "https://i.ibb.co/dmJDQBn/images.png"
                      }
                    />
                  </div>
                  {showDrop && (
                    <ul className="dropdown">
                      <Link to="/users">
                        <li>Users</li>
                      </Link>
                      <Link to="/setting">
                        <li>Setting</li>
                      </Link>
                      <Link to="/login">
                        <li onClick={() => Logout()}>Logout</li>
                      </Link>
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {searchResult.data.length > 0 && searchResult.query.length > 0 && (
        <div className="searchOut" ref={searchOutRef}>
          <h1>Search results for:{searchResult.query}</h1>
          <div className="searchResult">
            {searchResult.data?.map(
              (item, i) =>
                item.poster_path && (
                  <motion.div
                    className="card"
                    key={i}
                    onClick={() => {
                      goToWatch(item);
                      setSearchOpen(false);
                    }}
                    initial={{
                      y: "50px",
                    }}
                    animate={{
                      y: 0,
                    }}
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 1.05,
                    }}
                  >
                    <LazyImage src={baseUrl + `${item.poster_path}`} />
                  </motion.div>
                )
            )}
          </div>

          {!searchResult.loading && searchResult.hasMore && (
            <button
              className="loadMore"
              onClick={() => searchResult.hasMore && setPage(page + 1)}
            >
              Load More...
            </button>
          )}
        </div>
      )}
    </>
  );
};
export default Navbar;
