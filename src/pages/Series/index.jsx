import { Navbar, Category, CheckInternet } from "../../components";
const Movie = () => {
  return (
    <>
      <CheckInternet />
      <Navbar />
      <Category req="series" />
    </>
  );
};

export default Movie;
