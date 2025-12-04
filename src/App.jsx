import React, { useEffect } from "react";
import Routes from "./Routes";
import useAuthStore from "./store/useAuthStore";

function App() {
  const { fetchProfile, token, user } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
  }, [token, user, fetchProfile]);

  return (
    <Routes />
  );
}

export default App;
