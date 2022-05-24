import { Navbar, Slider, CheckInternet, Row } from "../../components";
import { request } from "../../helper/request";

const Home = () => {
  return (
    <>
      <CheckInternet />
      <Navbar />
      <Slider />
      <Row Title="Trending" Req={request.Trending} />
      <Row
        Title="Netflix-Originals"
        Wide={true}
        Req={request.NetflixOriginals}
      />
      <Row Title="Tv Discover" Req={request.TvDiscover} />
      <Row Title="Movie Discover" Req={request.MovieDiscover} />
      <Row Title="Action" Req={request.ActionMovie} />
      <Row Title="Comedy" Req={request.ComedyMovie} />
      <Row Title="Horror" Req={request.HorrorMovie} />
      <Row Title="Romance" Req={request.RomanceMovie} />
      {/*  <Row Title="Documentory" Req={request.Documentaries} /> */}
    </>
  );
};

export default Home;
