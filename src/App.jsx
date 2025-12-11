import React, { useEffect } from "react";
import Routes from "./Routes";
import useAuthStore from "./store/useAuthStore";

function App() {
  const { fetchProfile, token, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
  }, [token, user, fetchProfile]);

  // Show loading screen while fetching profile on initial load
  if (token && !user && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes />
  );
}

export default App;
