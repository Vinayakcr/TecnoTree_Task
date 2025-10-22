import { useEffect } from "react";

const usePreventBack = (path = "/home") => {
  useEffect(() => {
    window.history.replaceState(null, "", path);
    window.history.pushState(null, "", path);

    const handlePopState = () => {
      window.history.pushState(null, "", path);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [path]);
};

export default usePreventBack;
