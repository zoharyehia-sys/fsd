import { type CSSProperties } from "react";

interface LoaderProps {
  message?: string;
  fullPage?: boolean;
}

const Loader = ({
  message = "\u05D8\u05D5\u05E2\u05DF...",
  fullPage = false,
}: LoaderProps) => {
  const containerStyle: CSSProperties = fullPage
    ? {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
      }
    : {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      };

  const spinnerStyle: CSSProperties = {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} />
      {message && <p style={{ marginTop: "10px", color: "#666" }}>{message}</p>}
    </div>
  );
};

export default Loader;
