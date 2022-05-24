import { Navbar, Category, CheckInternet } from "../../components";

const Movie = () => {
  return (
    <>
      <CheckInternet />
      <Navbar />
      <Category req="movie" />
    </>
  );
};

export default Movie;
