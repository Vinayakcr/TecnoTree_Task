import React, { useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const AuthCallback = () => {
  const { exchangeCodeForTokens } = useContext(AuthContext);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          console.error("No authorization code found in URL");
          alert("Login failed: missing authorization code");
          window.location.replace("/login");
          return;
        }

        await exchangeCodeForTokens(code);

        window.history.replaceState(null, "", "/home");
        window.location.replace("/home");
      } catch (err) {
        console.error("Auth callback error:", err);
        alert("Login failed. Please try again.");
        window.location.replace("/login");
      }
    };

    processCallback();
  }, [exchangeCodeForTokens]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20vh",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <h2>Processing login…</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default AuthCallback;
