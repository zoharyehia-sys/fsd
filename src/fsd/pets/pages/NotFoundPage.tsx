import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        color: "#333",
        maxWidth: "720px",
        backgroundColor: "#fff",
        margin: "50px auto",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1>{"404 - \u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0"}</h1>
      <p>
        {
          "\u05D4\u05D3\u05E3 \u05E9\u05D0\u05EA\u05D4/\u05D0\u05EA \u05DE\u05D7\u05E4\u05E9/\u05EA \u05DC\u05D0 \u05E7\u05D9\u05D9\u05DD."
        }
      </p>
      <br />
      <Link
        style={{
          display: "inline-block",
          padding: "10px 16px",
          borderRadius: "6px",
          backgroundColor: "#111",
          color: "#fff",
          textDecoration: "none",
        }}
        to="/"
      >
        {"\u05D7\u05D6\u05D5\u05E8/\u05D9 \u05DC\u05D3\u05E3 \u05D4\u05D1\u05D9\u05EA"}
      </Link>
    </div>
  );
};

export default NotFoundPage;
