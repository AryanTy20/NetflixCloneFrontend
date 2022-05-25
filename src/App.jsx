import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./helper/errorHandler";
import { RequireAuth, Layout, PersistLogin } from "./components";
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Loader = lazy(() => import("./components/Loader"));
const Login = lazy(() => import("./components/Auth/Login"));
const Register = lazy(() => import("./components/Auth/Register"));
const ForgotPassword = lazy(() => import("../src/components/Auth/Forgot"));
const Home = lazy(() => import("./pages/Home"));
const Movies = lazy(() => import("./pages/Movie"));
const Series = lazy(() => import("./pages/Series"));
const Wishlist = lazy(() => import("./pages/wishlist"));
const Watch = lazy(() => import("./pages/Watch"));
const Profile = lazy(() => import("./pages/Profile"));
const Setting = lazy(() => import("./pages/settings"));

const loaderStyle = {
  position: "absolute",
  inset: "0",
  display: "grid",
  placeItems: "center",
  minHeight: "100vh",
  width: "100%",
};

const App = () => {
  return (
    <>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          console.clear();
          window.location.reload();
        }}
      >
        <Suspense
          fallback={
            <div style={loaderStyle}>
              <Loader />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              //Auth
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resetpassword" element={<ForgotPassword />} />
              //App
              <Route element={<PersistLogin />}>
                <Route element={<RequireAuth />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/series" element={<Series />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/watch/:id/:title" element={<Watch />} />
                  <Route path="/users" element={<Profile />} />
                  <Route path="/setting" element={<Setting />} />
                </Route>
              </Route>
              //page not found
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default App;
