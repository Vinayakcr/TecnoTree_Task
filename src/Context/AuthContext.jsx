import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const ID_TOKEN_KEY = "id_token";
const CODE_VERIFIER_KEY = "pkce_verifier";

const WSO2_CONFIG = {
  clientId: import.meta.env.VITE_WSO2_CLIENT_ID,
  authorizeEndpoint:
    import.meta.env.VITE_WSO2_AUTH_URL || "https://localhost:9443/oauth2/authorize",
  tokenEndpoint:
    import.meta.env.VITE_WSO2_TOKEN_URL || "https://localhost:9443/oauth2/token",
  revokeEndpoint: "https://localhost:9443/oauth2/revoke",
  redirectUri: import.meta.env.VITE_WSO2_REDIRECT_URI || "http://localhost:5173/auth/callback",
  scope: "openid profile email offline_access address",
  loginUrl:
    import.meta.env.VITE_WSO2_LOGIN_URL ||
    "https://localhost:9443/authenticationendpoint/login.do",
  logoutEndpoint: "https://localhost:9443/oidc/logout",
  postLogoutRedirectUri: "http://localhost:5173/login",
};

// Utility functions
function generateCodeVerifier(length = 64) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let verifier = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    verifier += possible.charAt(array[i] % possible.length);
  }
  return verifier;
}

function base64URLEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(digest);
}

const revokeToken = async (token, tokenType = "access_token") => {
  if (!token) return;

  const body = new URLSearchParams({
    token,
    token_type_hint: tokenType,
    client_id: WSO2_CONFIG.clientId,
  });

  try {
    await fetch(WSO2_CONFIG.revokeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch (err) {
    console.error(`Failed to revoke ${tokenType}:`, err);
  }
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem(TOKEN_KEY));

  const login = async () => {
    const verifier = generateCodeVerifier();
    localStorage.setItem(CODE_VERIFIER_KEY, verifier);
    const challenge = await generateCodeChallenge(verifier);

    const authUrl =
      `${WSO2_CONFIG.authorizeEndpoint}?response_type=code` +
      `&client_id=${WSO2_CONFIG.clientId}` +
      `&redirect_uri=${encodeURIComponent(WSO2_CONFIG.redirectUri)}` +
      `&scope=${encodeURIComponent(WSO2_CONFIG.scope)}` +
      `&code_challenge=${challenge}` +
      `&code_challenge_method=S256` +
      `&prompt=login`;

    window.location.href = authUrl;
  };

  const exchangeCodeForTokens = async (code) => {
    const verifier = localStorage.getItem(CODE_VERIFIER_KEY);
    if (!verifier) throw new Error("PKCE verifier not found");

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: WSO2_CONFIG.redirectUri,
      client_id: WSO2_CONFIG.clientId,
      code_verifier: verifier,
    });

    const response = await fetch(WSO2_CONFIG.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
      setAccessToken(data.access_token);

      if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
      if (data.id_token) localStorage.setItem(ID_TOKEN_KEY, data.id_token);

      localStorage.removeItem(CODE_VERIFIER_KEY);
    } else {
      throw new Error(data.error_description || "Token exchange failed");
    }

    return data;
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) return null;

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: WSO2_CONFIG.clientId,
    });

    try {
      const response = await fetch(WSO2_CONFIG.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token);
        setAccessToken(data.access_token);
        if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
        return data.access_token;
      } else {
        await logout();
        return null;
      }
    } catch (err) {
      console.error("Refresh token failed:", err);
      await logout();
      return null;
    }
  };

  // 🔹 UPDATED LOGOUT FUNCTION
  const logout = async () => {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_KEY);

    // Revoke tokens
    await revokeToken(accessToken, "access_token");
    await revokeToken(refreshToken, "refresh_token");

    // Clear local storage
    localStorage.clear();
    setAccessToken(null);

    // Immediately redirect to WSO2 login page (same as "Login with SSO")
    const verifier = generateCodeVerifier();
    localStorage.setItem(CODE_VERIFIER_KEY, verifier);
    const challenge = await generateCodeChallenge(verifier);

    const authUrl =
      `${WSO2_CONFIG.authorizeEndpoint}?response_type=code` +
      `&client_id=${WSO2_CONFIG.clientId}` +
      `&redirect_uri=${encodeURIComponent(WSO2_CONFIG.redirectUri)}` +
      `&scope=${encodeURIComponent(WSO2_CONFIG.scope)}` +
      `&code_challenge=${challenge}` +
      `&code_challenge_method=S256` +
      `&prompt=login`;

    window.location.href = authUrl;
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (accessToken) await refreshAccessToken();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        refreshAccessToken,
        exchangeCodeForTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
