export function ErrorFallback({ error, resetErrorBoundary }) {
  const errorBox = {
    minHeight: "100vh",
    width: "100vw",
    display: "grid",
    placeItems: "center",
    padding: "2em",
  };

  const heading = {
    fontSize: "2rem",
  };

  return (
    <div style={errorBox}>
      <div role="alert">
        <h1 style={{ fontSize: "3rem" }}>Something went wrong</h1>
        <pre
          style={{
            color: "red",
            fontSize: "1rem",
            margin: "1em 0",
          }}
        >
          error : {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          style={{
            padding: "0.5em 0.8em",
            textAlign: "center",
            backgroundColor: "white",
            outline: "none",
            border: 0,
            borderRadius: ".2em",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
